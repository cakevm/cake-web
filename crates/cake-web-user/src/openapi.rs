use crate::handler::__path_create_user;
use crate::handler::__path_list_users;
use crate::models::user::NewUser;
use crate::models::user::User;
use crate::models::user::UserRole;
use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
    paths(list_users, create_user),
    tags(
        (name = "user", description = "User management")
    ),
    components(schemas(User, UserRole, NewUser))
)]
pub struct UserApi;
