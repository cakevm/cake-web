use crate::models::user::{NewUser, User};
use crate::schema::cake_web::users;
use axum::extract::State;
use axum::http::StatusCode;
use axum::Json;
use cake_web_state::AppState;
use cake_web_utils::error_handler::internal_error;
use diesel::{QueryDsl, SelectableHelper};
use diesel_async::RunQueryDsl;

/// List all User
///
/// List all users.
#[utoipa::path(
    get,
    path = "users",
    tag = "user",
    tags = [],
    responses(
        (status = 200, description = "List all users", body = [User])
    )
)]
pub async fn list_users(State(app_state): State<AppState>) -> Result<Json<Vec<User>>, (StatusCode, String)> {
    let mut conn = app_state.pool.get().await.map_err(internal_error)?;
    let res = users::table.select(User::as_select()).load(&mut conn).await.map_err(internal_error)?;
    Ok(Json(res))
}

/// Create new User
///
/// Tries to create a new User or fails with 409 conflict if already exists.
#[utoipa::path(
    post,
    path = "users",
    tag = "user",
    tags = [],
    request_body = User,
    responses(
    (status = 201, description = "Todo item created successfully", body = User),
    )
)]
pub async fn create_user(State(app_state): State<AppState>, Json(new_user): Json<NewUser>) -> Result<Json<User>, (StatusCode, String)> {
    let mut conn = app_state.pool.get().await.map_err(internal_error)?;

    let res = diesel::insert_into(users::table)
        .values(new_user)
        .returning(User::as_returning())
        .get_result(&mut conn)
        .await
        .map_err(internal_error)?;
    Ok(Json(res))
}
