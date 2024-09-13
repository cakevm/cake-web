use cake_web_http::openapi::BlockApi;
use cake_web_http::openapi::MarketApi;
use cake_web_jwt::openapi::{AuthApi, SecurityAddon};
use cake_web_user::openapi::UserApi;
use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
    modifiers(&SecurityAddon),

    nest(
        (path = "/api/v1/", api = UserApi),
        (path = "/api/v1/auth/", api = AuthApi),
        (path = "/api/v1/block/", api = BlockApi),
        (path = "/api/v1/markets", api = MarketApi)
    )
)]
pub struct ApiDoc;
