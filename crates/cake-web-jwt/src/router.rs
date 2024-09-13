use crate::handler::{login, refresh};
use axum::routing::post;
use axum::Router;
use cake_web_state::AppState;

pub fn router() -> Router<AppState> {
    Router::new().route("/login", post(login)).route("/refresh", post(refresh))
}
