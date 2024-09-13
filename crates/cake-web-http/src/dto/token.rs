use alloy_primitives::Address;
use serde::Serialize;
use utoipa::PartialSchema;
use utoipa::ToSchema;

#[derive(Debug, Serialize, ToSchema)]
pub struct TokenDetailsResponse {
    #[schema(schema_with = String::schema)]
    pub address: Address,
    pub name: String,
}
