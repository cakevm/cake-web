use std::future::Future;
use std::sync::Arc;

use alloy::network::primitives::BlockTransactions;
use alloy::network::Ethereum;
use alloy::primitives::{map::HashMap, Address, TxHash, U256};
use alloy::providers::Provider;
use alloy::rpc::types::{Block, BlockTransactionsKind};
use alloy::transports::Transport;
use axum::Router;
use eyre::OptionExt;
use reth::primitives::BlockNumHash;
use reth::revm::db::states::StorageSlot;
use reth::revm::db::{BundleAccount, StorageWithOriginalValues};
use reth::rpc::eth::EthTxBuilder;
use reth::transaction_pool::{BlobStore, Pool, TransactionOrdering, TransactionPool, TransactionValidator};
use reth_execution_types::Chain;
use reth_exex::{ExExContext, ExExEvent, ExExNotification};
use reth_node_api::FullNodeComponents;
use reth_tracing::tracing::{error, info};
use tokio::select;

use crate::arguments::CakeArgs;
use cake_web_actor::WebServerActor;
use debug_provider::DebugProviderExt;
use defi_actors::{BlockchainActors, NodeBlockActorConfig};
use defi_blockchain::Blockchain;
use defi_events::{BlockHeader, BlockLogs, BlockStateUpdate, MessageBlockHeader, MessageMempoolDataUpdate, NodeMempoolDataUpdate};
use defi_types::{ChainParameters, GethStateUpdate, MempoolTx};
use futures_util::stream::StreamExt;
use loom_actors::Broadcaster;
use loom_topology::{BroadcasterConfig, EncoderConfig, TopologyConfig};
use loom_utils::reth_types::append_all_matching_block_logs_sealed;
use tokio_util::sync::CancellationToken;

pub async fn init<Node: FullNodeComponents>(
    ctx: ExExContext<Node>,
    bc: Blockchain,
) -> eyre::Result<impl Future<Output = eyre::Result<()>>> {
    Ok(loom_exex(ctx, bc))
}

async fn process_chain(
    chain: Arc<Chain>,
    chain_parameters: ChainParameters,
    block_header_channel: Broadcaster<MessageBlockHeader>,
    block_with_tx_channel: Broadcaster<Block>,
    logs_channel: Broadcaster<BlockLogs>,
    state_update_channel: Broadcaster<BlockStateUpdate>,
) -> eyre::Result<()> {
    for sealed_header in chain.headers() {
        let header = reth_rpc_types_compat::block::from_primitive_with_hash(sealed_header);
        if let Err(e) =
            block_header_channel.send(MessageBlockHeader::new_with_time(BlockHeader::new(chain_parameters.clone(), header))).await
        {
            error!(error=?e.to_string(), "block_header_channel.send")
        }
    }

    for (sealed_block, receipts) in chain.blocks_and_receipts() {
        let number = sealed_block.number;
        let hash = sealed_block.hash();

        let block_hash_num = BlockNumHash { number, hash };

        info!(block_number=?block_hash_num.number, block_hash=?block_hash_num.hash, "Processing block");
        match reth_rpc_types_compat::block::from_block::<EthTxBuilder>(
            sealed_block.clone().unseal(),
            sealed_block.difficulty,
            BlockTransactionsKind::Full,
            Some(sealed_block.hash()),
        ) {
            Ok(block) => {
                let block: Block = Block {
                    transactions: BlockTransactions::Full(block.transactions.into_transactions().map(|t| t.inner).collect()),
                    header: block.header,
                    uncles: block.uncles,
                    size: block.size,
                    withdrawals: block.withdrawals,
                };

                if let Err(e) = block_with_tx_channel.send(block).await {
                    error!(error=?e.to_string(), "block_with_tx_channel.send")
                }
            }
            Err(e) => {
                error!(error = ?e, "from_block")
            }
        }

        let mut logs: Vec<alloy::rpc::types::Log> = Vec::new();

        let receipts: Vec<reth_primitives::Receipt> = receipts.iter().filter_map(|r| r.clone()).collect();

        append_all_matching_block_logs_sealed(&mut logs, block_hash_num, receipts, false, sealed_block)?;

        let log_update = BlockLogs { block_hash: sealed_block.hash(), logs };

        if let Err(e) = logs_channel.send(log_update).await {
            error!(error=?e.to_string(), "logs_channel.send")
        }

        if let Some(execution_outcome) = chain.execution_outcome_at_block(block_hash_num.number) {
            let mut state_update = GethStateUpdate::new();

            let state_ref: &HashMap<Address, BundleAccount> = execution_outcome.bundle.state();

            for (address, accounts) in state_ref.iter() {
                let account_state = state_update.entry(*address).or_default();
                if let Some(account_info) = accounts.info.clone() {
                    account_state.code = account_info.code.map(|c| c.bytecode().clone());
                    account_state.balance = Some(account_info.balance);
                    account_state.nonce = Some(account_info.nonce);
                }

                let storage: &StorageWithOriginalValues = &accounts.storage;

                for (key, storage_slot) in storage.iter() {
                    let (key, storage_slot): (&U256, &StorageSlot) = (key, storage_slot);
                    account_state.storage.insert((*key).into(), storage_slot.present_value.into());
                }
            }

            let block_state_update = BlockStateUpdate { block_hash: block_hash_num.hash, state_update: vec![state_update] };

            if let Err(e) = state_update_channel.send(block_state_update).await {
                error!(error=?e.to_string(), "block_with_tx_channel.send")
            }
        }
    }

    Ok(())
}

async fn loom_exex<Node: FullNodeComponents>(mut ctx: ExExContext<Node>, bc: Blockchain) -> eyre::Result<()> {
    info!("Loom ExEx is started");

    while let Some(exex_notification) = ctx.notifications.next().await {
        match &exex_notification {
            ExExNotification::ChainCommitted { new } => {
                info!(committed_chain = ?new.range(), "Received commit");
                if let Err(e) = process_chain(
                    new.clone(),
                    bc.chain_parameters(),
                    bc.new_block_headers_channel(),
                    bc.new_block_with_tx_channel(),
                    bc.new_block_logs_channel(),
                    bc.new_block_state_update_channel(),
                )
                .await
                {
                    error!(error=?e, "process_chain");
                }
            }
            ExExNotification::ChainReorged { old, new } => {
                // revert to block before the reorg
                info!(from_chain = ?old.range(), to_chain = ?new.range(), "Received reorg");
                if let Err(e) = process_chain(
                    new.clone(),
                    bc.chain_parameters(),
                    bc.new_block_headers_channel(),
                    bc.new_block_with_tx_channel(),
                    bc.new_block_logs_channel(),
                    bc.new_block_state_update_channel(),
                )
                .await
                {
                    error!(error=?e, "process_chain");
                }
            }
            ExExNotification::ChainReverted { old } => {
                info!(reverted_chain = ?old.range(), "Received revert");
            }
        };
        if let Some(committed_chain) = exex_notification.committed_chain() {
            ctx.events.send(ExExEvent::FinishedHeight(committed_chain.tip().number))?;
        }
    }

    info!("Loom ExEx is finished");
    Ok(())
}

pub async fn mempool_worker<V, T, S>(mempool: Pool<V, T, S>, bc: Blockchain) -> eyre::Result<()>
where
    V: TransactionValidator,
    T: TransactionOrdering<Transaction = <V as TransactionValidator>::Transaction>,
    S: BlobStore,
{
    info!("Mempool worker started");
    let mut tx_listener = mempool.new_transactions_listener();

    let mempool_tx = bc.new_mempool_tx_channel();

    loop {
        select! {
            tx_notification = tx_listener.recv() => {
                if let Some(tx_notification) = tx_notification {
                    let recovered_tx = tx_notification.transaction.to_recovered_transaction();
                    let tx_hash: TxHash = recovered_tx.hash;
                    let tx : alloy::rpc::types::eth::Transaction = reth_rpc_types_compat::transaction::from_recovered::<EthTxBuilder>(recovered_tx).inner;
                    let update_msg: MessageMempoolDataUpdate = MessageMempoolDataUpdate::new_with_source(NodeMempoolDataUpdate { tx_hash, mempool_tx: MempoolTx { tx: Some(tx), ..MempoolTx::default() } }, "exex".to_string());
                    if let Err(e) =  mempool_tx.send(update_msg).await {
                        error!(error=?e.to_string(), "mempool_tx.send");
                    }else{
                        info!(hash = ?tx_notification.transaction.hash(), "Received pool tx");
                    }
                }
            }
        }
    }
}

pub async fn start_loom<P, T>(
    provider: P,
    bc: Blockchain,
    topology_config: TopologyConfig,
    is_exex: bool,
    cake_args: CakeArgs,
    shutdown_token: CancellationToken,
) -> eyre::Result<()>
where
    T: Transport + Clone,
    P: Provider<T, Ethereum> + DebugProviderExt<T, Ethereum> + Send + Sync + Clone + 'static,
{
    let chain_id = provider.get_chain_id().await?;

    info!(chain_id = ?chain_id, "Starting Loom" );

    // Get multicaller address from config
    let (_encoder_name, encoder) = topology_config.encoders.iter().next().ok_or_eyre("NO_ENCODER")?;
    let multicaller_address: Option<Address> = match encoder {
        EncoderConfig::SwapStep(e) => e.address.parse().ok(),
    };
    let multicaller_address = multicaller_address.ok_or_eyre("MULTICALLER_ADDRESS_NOT_SET")?;

    // Get flashbots relays from config
    let relays = topology_config
        .actors
        .broadcaster
        .as_ref()
        .and_then(|b| b.get("flashbots"))
        .map(|b| match b {
            BroadcasterConfig::Flashbots(f) => f.relays(),
        })
        .unwrap_or_default();

    //let private_key_encrypted = hex::decode(env::var("DATA")?)?;

    info!(address=?multicaller_address, "Multicaller");

    let mut bc_actors = BlockchainActors::new(provider.clone(), bc.clone(), relays);

    if !is_exex {
        bc_actors.with_block_events(NodeBlockActorConfig::new().with_block_header().with_block_with_tx())?;
        //.with_remote_mempool(provider.clone())?;
    }
    let router = Router::new();

    bc_actors
        //.mempool()?
        //.initialize_signers_with_encrypted_key(private_key_encrypted)? // initialize signer with encrypted key
        .with_block_history()? // collect blocks
        .start(WebServerActor::new(cake_args.host, router, shutdown_token).on_bc(bc.clone()))?
        .with_pool_history_loader()?
        .with_price_station()? // calculate price fo tokens
        .with_health_monitor_pools()? // monitor pools health to disable empty
        .with_health_monitor_state()? // monitor state health
        .with_health_monitor_stuffing_tx()? // collect stuffing tx information
        .with_swap_encoder(Some(multicaller_address))? // convert swaps to opcodes and passes to estimator
        .with_evm_estimator()? // estimate gas, add tips
        //.with_signers()? // start signer actor that signs transactions before broadcasting
        //.with_flashbots_broadcaster(true)? // broadcast signed txes to flashbots
        .with_market_state_preloader()? // preload contracts to market state
        //.with_nonce_and_balance_monitor()? // start monitoring balances of
         // load pools used in latest 10000 blocks
        .with_pool_protocol_loader()? // load curve + steth + wsteth
        .with_new_pool_loader()? // load new pools
        .with_swap_path_merger()? // load merger for multiple swap paths
        .with_diff_path_merger()? // load merger for different swap paths
        .with_same_path_merger()? // load merger for same swap paths with different stuffing txes
       // .with_backrun_block()? // load backrun searcher for incoming block
       // .with_backrun_mempool()? // load backrun searcher for mempool txes
    ;

    bc_actors.wait().await;

    Ok(())
}
