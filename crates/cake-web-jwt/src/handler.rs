use axum::extract::State;
use axum::http::StatusCode;
use axum::Json;
use cake_web_user::models::user::User;

use chrono::{Duration, Utc};
use diesel::{QueryDsl, SelectableHelper};
use diesel_async::RunQueryDsl;

use crate::model::{AuthError, Claims, LoginRequest, LoginResponse, RefreshRequest, RefreshResponse};
use cake_web_state::AppState;
use cake_web_user::schema::cake_web::users::dsl::users;
use cake_web_user::schema::cake_web::users::email;
use cake_web_utils::error_handler::internal_error;
use diesel::ExpressionMethods;
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};

/// Login user
///
/// Login user.
#[utoipa::path(
    post,
    path = "login",
    tag = "auth",
    tags = [],
    request_body = LoginRequest,
    responses(
    (status = 200, description = "Todo item created successfully", body = LoginResponse),
    )
)]
pub async fn login(State(app_state): State<AppState>, Json(body): Json<LoginRequest>) -> Result<Json<LoginResponse>, AuthError> {
    let jwt_secret = "secret";
    let refresh_secret = "refresh_secret";

    let mut conn = app_state.pool.get().await.map_err(|_| AuthError::InternalServerError)?;
    let user = users
        .filter(email.eq(body.email.clone()))
        .select(User::as_select())
        .first(&mut conn)
        .await
        .map_err(|_| AuthError::WrongCredentials)?;

    let expiry_timestamp = (Utc::now() + Duration::hours(6)).timestamp();

    let header = &Header::default();
    let key = EncodingKey::from_secret(jwt_secret.as_ref());
    let refresh_key = EncodingKey::from_secret(refresh_secret.as_ref());
    let refresh_header = &Header::default();

    let claims = Claims { sub: format!("{}", user.id), username: user.username.clone(), exp: expiry_timestamp };

    let access_token = encode::<Claims>(header, &claims, &key);
    let refresh_token = encode::<Claims>(refresh_header, &claims, &refresh_key);

    Ok(Json(LoginResponse { token: access_token.unwrap(), refresh_token: refresh_token.unwrap(), username: user.username }))
}

/// Refresh token
///
/// Refresh token.
#[utoipa::path(
    post,
    path = "refresh",
    tag = "auth",
    tags = [],
    request_body = RefreshRequest,
    responses(
    (status = 200, description = "Token refreshed", body = RefreshResponse),
    )
)]
pub async fn refresh(
    State(app_state): State<AppState>,
    Json(body): Json<RefreshRequest>,
) -> Result<Json<RefreshResponse>, (StatusCode, String)> {
    let refresh_secret = "refresh_secret";
    let decode_key = DecodingKey::from_secret(refresh_secret.as_ref());
    let encode_key = EncodingKey::from_secret(refresh_secret.as_ref());

    let conn = app_state.pool.get().await.map_err(internal_error)?;
    let claims = Claims {
        sub: "jkfajfafghjjfn".to_string(),
        username: "ezesunday".to_string(),
        exp: (Utc::now() + Duration::hours(48)).timestamp(),
    };

    let mut decoded_claims = decode::<Claims>(&body.token, &decode_key, &Validation::new(Algorithm::HS256)).map_err(internal_error)?;

    decoded_claims.claims = claims.clone();

    let token = encode(&Header::default(), &claims, &encode_key).map_err(internal_error)?;
    Ok(Json(RefreshResponse { access_token: token }))
}
