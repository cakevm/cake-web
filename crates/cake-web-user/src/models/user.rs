use chrono::{DateTime, Utc};
use diesel::{Insertable, Queryable, Selectable};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Serialize, Deserialize, diesel_derive_enum::DbEnum, ToSchema)]
#[ExistingTypePath = "crate::schema::cake_web::sql_types::UserRole"]
#[DbValueStyle = "SCREAMING_SNAKE_CASE"]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum UserRole {
    Admin,
    User,
    System,
}

#[derive(Serialize, Selectable, Queryable, ToSchema)]
#[diesel(table_name = crate::schema::cake_web::users)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub password: String,
    pub email: String,
    pub user_role: UserRole,
    pub is_active: bool,
    pub updated_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

#[derive(Deserialize, Insertable, ToSchema)]
#[diesel(table_name = crate::schema::cake_web::users)]
pub struct NewUser {
    pub username: String,
    pub password: String,
    pub email: String,
    pub user_role: UserRole,
    pub is_active: bool,
}
