use cake_web_db::pool::Pool;
use defi_blockchain::Blockchain;

#[derive(Clone)]
pub struct AppState {
    pub pool: Pool,
    pub bc: Blockchain,
}
