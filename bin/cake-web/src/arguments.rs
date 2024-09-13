use clap::{Parser, Subcommand};

#[derive(Debug, Subcommand)]
pub enum Command {
    Node(CakeArgsNode),
    Remote(CakeArgs),
}

#[derive(Parser, Debug)]
#[command(name="pine", version, about, long_about = None)]
pub struct AppArgs {
    #[command(subcommand)]
    pub command: Command,
}

#[derive(Parser, Debug)]
pub struct CakeArgsNode {}

#[derive(Parser, Debug)]
pub struct CakeArgs {
    #[arg(long, default_value = "config-topology-remote.toml")]
    pub loom_config: String,
    #[arg(long, default_value = "false")]
    pub test: bool,
    #[arg(long, default_value = "127.0.0.1:3000")]
    pub host: String,
}
