use crate::handler::{create_user, list_users};
use axum::routing::{get, post};
use axum::Router;
use cake_web_state::AppState;

pub fn router() -> Router<AppState> {
    Router::new().route("/", get(list_users)).route("/", post(create_user))
}
