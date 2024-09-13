use crate::block_handler::latest_block;
use axum::Router;

use crate::pools_handler::{market_stats, pool, pool_quote, pools};
use crate::tokens_handler::token;
use axum::routing::{get, post};
use cake_web_state::AppState;

pub fn router_block() -> Router<AppState> {
    Router::new().route("/latest_block", get(latest_block))
}

pub fn router_market() -> Router<AppState> {
    Router::new()
        .route("/pools/:address", get(pool))
        .route("/pools/:address/quote", post(pool_quote))
        .route("/pools", get(pools))
        .route("/tokens/:address", get(token))
        .route("/", get(market_stats))
}
