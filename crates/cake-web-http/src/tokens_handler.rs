use crate::dto::token::TokenDetailsResponse;
use alloy_primitives::Address;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use cake_web_state::AppState;

/// Get pool details
///
/// Get pool details
#[utoipa::path(
    get,
    path = "/tokens/{address}",
    tag = "token",
    tags = [],
    params(
        ("address" = String, Path, description = "Address of the token"),
    ),
    responses(
    (status = 200, description = "Token detail response", body = TokenDetailsResponse),
    )
)]
pub async fn token(
    State(app_state): State<AppState>,
    Path(address): Path<String>,
) -> Result<Json<TokenDetailsResponse>, (StatusCode, String)> {
    Ok(Json(TokenDetailsResponse { address: Address::ZERO, name: "Test".to_string() }))
}
