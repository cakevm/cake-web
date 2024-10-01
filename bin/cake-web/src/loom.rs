use std::future::Future;

use alloy::network::Ethereum;
use alloy::primitives::Address;
use alloy::providers::Provider;
use alloy::transports::Transport;
use axum::Router;
use eyre::OptionExt;
use reth_exex::ExExContext;
use reth_node_api::FullNodeComponents;
use reth_tracing::tracing::info;

use crate::arguments::CakeArgs;
use cake_web_actor::WebServerActor;
use debug_provider::DebugProviderExt;
use defi_actors::{loom_exex, BlockchainActors, NodeBlockActorConfig};
use defi_blockchain::Blockchain;
use defi_pools::PoolsConfig;
use loom_topology::{BroadcasterConfig, EncoderConfig, TopologyConfig};
use tokio_util::sync::CancellationToken;

pub async fn init<Node: FullNodeComponents>(
    ctx: ExExContext<Node>,
    bc: Blockchain,
    config: NodeBlockActorConfig,
) -> eyre::Result<impl Future<Output = eyre::Result<()>>> {
    Ok(loom_exex(ctx, bc, config))
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
        .with_pool_history_loader(PoolsConfig::new())?
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
        //.with_curve_pool_protocol_loader()? // load curve + steth + wsteth
        .with_new_pool_loader(PoolsConfig::new())? // load new pools
        .with_swap_path_merger()? // load merger for multiple swap paths
        .with_diff_path_merger()? // load merger for different swap paths
        .with_same_path_merger()? // load merger for same swap paths with different stuffing txes
       // .with_backrun_block()? // load backrun searcher for incoming block
       // .with_backrun_mempool()? // load backrun searcher for mempool txes
    ;

    bc_actors.wait().await;

    Ok(())
}
