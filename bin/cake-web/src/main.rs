mod arguments;
mod loom;

use alloy::providers::{ProviderBuilder, WsConnect};
use alloy::rpc::client::ClientBuilder;
use clap::{CommandFactory, FromArgMatches, Parser};
use defi_blockchain::Blockchain;
use dotenv::dotenv;
use loom_topology::TopologyConfig;
use reth::args::utils::DefaultChainSpecParser;
use std::env;
use std::time::Duration;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;
use tracing_subscriber::{fmt, EnvFilter};

use crate::arguments::{AppArgs, CakeArgs, Command};
use defi_actors::{mempool_worker, NodeBlockActorConfig};
use reth_node_ethereum::EthereumNode;
use tokio::{signal, task};
use tokio_util::sync::CancellationToken;
use tracing::{error, info};

fn main() -> eyre::Result<()> {
    println!("The current directory is {}", env::current_dir()?.display());
    let shutdown_token = CancellationToken::new();
    dotenv().ok();
    env::set_var("RUST_LOG", "info");
    tracing_subscriber::registry().with(fmt::layer()).with(EnvFilter::from_default_env()).init();

    // workaround for not raising an error for unknown commands
    let app_args = AppArgs::from_arg_matches_mut(&mut AppArgs::command().ignore_errors(true).get_matches())?;

    match app_args.command {
        Command::Node(_) => {
            reth::cli::Cli::<DefaultChainSpecParser, CakeArgs>::parse().run(|builder, cake_args: CakeArgs| async move {
                info!("Loading config from {}", cake_args.loom_config);
                let topology_config = TopologyConfig::load_from_file(cake_args.loom_config.clone())?;
                let bc = Blockchain::new(builder.config().chain.chain.id());
                let bc_clone = bc.clone();

                let handle = builder
                    .node(EthereumNode::default())
                    .install_exex("cake-exex", |node_ctx| loom::init(node_ctx, bc_clone, NodeBlockActorConfig::default()))
                    .launch()
                    .await?;

                let mempool = handle.node.pool.clone();
                let ipc_provider = ProviderBuilder::new().on_builtin(handle.node.config.rpc.ipcpath.as_str()).await?;

                tokio::task::spawn(mempool_worker(mempool, bc.clone()));
                let shutdown_token_clone = shutdown_token.clone();
                if let Err(e) = loom::start_loom(ipc_provider, bc, topology_config, true, cake_args, shutdown_token_clone).await {
                    error!("{}", e);
                }

                info!("Bot started");
                handle.wait_for_node_exit().await?;
                info!("Node exited");
                shutdown_token.cancel();
                Ok(())
            })?;
        }
        Command::Remote(cake_args) => {
            // start remote mode
            let rt = tokio::runtime::Builder::new_multi_thread().enable_all().build()?;

            rt.block_on(async {
                // init loom
                info!("Loading config from {}", cake_args.loom_config);
                let topology_config = TopologyConfig::load_from_file(cake_args.loom_config.clone())?;

                let client_config = topology_config.clients.get("remote").unwrap();
                let transport = WsConnect { url: client_config.url(), auth: None };
                let client = ClientBuilder::default().ws(transport).await?;
                let provider = ProviderBuilder::new().on_client(client).boxed();
                let bc = Blockchain::new(1);
                let shutdown_token_clone = shutdown_token.clone();
                tokio::task::spawn(async move {
                    if let Err(e) = loom::start_loom(provider, bc, topology_config, false, cake_args, shutdown_token_clone).await {
                        panic!("{}", e)
                    }
                });

                info!("Bot started");
                // keep the bot running
                tokio::select! {
                    _ = signal::ctrl_c() => {
                    info!("CTRL+C received... exiting");
                        shutdown_token.cancel();
                }
                _ = async {
                        loop {
                        tokio::time::sleep(Duration::from_secs(60)).await;
                        task::yield_now().await;
                        }
                    } => {}
                }
                Ok::<(), eyre::Error>(())
            })?;
        }
    }
    Ok(())
}
