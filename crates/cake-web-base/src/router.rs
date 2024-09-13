use crate::openapi::ApiDoc;
use axum::routing::get;
use axum::Router;
use cake_web_state::AppState;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

pub fn router(app_state: AppState) -> Router<()> {
    Router::new()
        .nest(
            "/api/v1",
            Router::new()
                .nest("/auth", cake_web_jwt::router())
                .nest("/users", cake_web_user::router())
                .nest("/block", cake_web_http::router_block()) // rename to node
                .nest("/markets", cake_web_http::router_market()),
        )
        .route("/ws", get(cake_web_websocket::ws_handler))
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .with_state(app_state)
}
