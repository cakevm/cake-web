CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'SYSTEM');


CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   username varchar(20) NOT NULL,
   password varchar(50) NOT NULL,
   email varchar(255) NOT NULL,
   user_role user_role NOT NULL,
   is_active BOOLEAN NOT NULL DEFAULT TRUE,
   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO users (username, password, email, user_role, is_active) VALUES ('admin', 'admin', 'admin@admin.com', 'ADMIN', TRUE);