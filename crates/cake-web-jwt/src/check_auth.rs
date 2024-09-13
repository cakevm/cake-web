use crate::model::{AuthError, Claims};
use axum::{body::Body, http::Request, middleware::Next, response::Response, RequestExt};
use axum_extra::{
    headers::{authorization::Bearer, Authorization},
    TypedHeader,
};
use jsonwebtoken::{decode, DecodingKey, Validation};

pub async fn verify_user(
    mut req: Request<Body>,
    decode_key: &DecodingKey,
    validation: Validation,
    next: Next,
) -> Result<Response, AuthError> {
    let TypedHeader(Authorization(bearer)) =
        req.extract_parts::<TypedHeader<Authorization<Bearer>>>().await.map_err(|_| AuthError::InvalidToken)?;

    if let Ok(claims) = decode::<Claims>(bearer.token(), decode_key, &validation) {
        req.extensions_mut().insert(claims);
        Ok(next.run(req).await)
    } else {
        Err(AuthError::InvalidToken)
    }
}
