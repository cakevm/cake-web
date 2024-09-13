use crate::handler::__path_login;
use crate::handler::__path_refresh;
use crate::model::LoginRequest;
use crate::model::LoginResponse;
use crate::model::RefreshRequest;
use crate::model::RefreshResponse;
use utoipa::openapi::security::{HttpAuthScheme, HttpBuilder, SecurityScheme};
use utoipa::{Modify, OpenApi};

pub struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        if let Some(components) = openapi.components.as_mut() {
            components.add_security_scheme(
                "api_jwt_token",
                SecurityScheme::Http(HttpBuilder::new().scheme(HttpAuthScheme::Bearer).bearer_format("JWT").build()),
            )
        }
    }
}

#[derive(OpenApi)]
#[openapi(
    paths(login, refresh),
    tags(
        (name = "auth", description = "JWT auth login")
    ),
    components(schemas(LoginRequest, LoginResponse, RefreshRequest, RefreshResponse))
)]
pub struct AuthApi;
