use crate::block_handler::__path_latest_block;
use crate::dto::pool::MarketStats;
use crate::dto::pool::{Pool, PoolClass, PoolDetailsResponse, PoolProtocol, PoolResponse};
use crate::dto::token::TokenDetailsResponse;
use crate::model::{QuoteRequest, QuoteResponse};
use crate::pools_handler::__path_market_stats;
use crate::pools_handler::__path_pool;
use crate::pools_handler::__path_pool_quote;
use crate::pools_handler::__path_pools;
use crate::tokens_handler::__path_token;
use cake_web_dto::BlockHeader;
use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
    paths(latest_block),
    tags(
        (name = "block", description = "Blockchain")
    ),
    components(schemas(BlockHeader))
)]
pub struct BlockApi;

#[derive(OpenApi)]
#[openapi(
    paths(pool, pools, pool_quote, market_stats, token),
    tags(
        (name = "market", description = "Market")
    ),
    components(schemas(PoolResponse, PoolDetailsResponse, Pool, PoolClass, PoolProtocol, MarketStats, QuoteRequest, QuoteResponse, TokenDetailsResponse))
)]
pub struct MarketApi;
