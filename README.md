# cake-web
A web interface for the loom bot.

# Requirements
* Archive node
* Postgresql

## Setup
1. Clone the repository:
   ```sh
   git clone
    ```
### backend
1. Build the backend:
    ```sh
    make
    ```
2. Configure loom:
   Create `config-topology-remote.toml` in root and set env `DATA=<your encrypted PK>`. See https://github.com/dexloom/loom
3. Copy the `.env.example` file to `.env` and set the database URL. Then run migrations:
    ```sh
    cd crates/cake-user
    cargo install diesel_cli
    diesel migration run
    git checkout crates/cake-web-user/src/schema.rs
    ```
4. Run the backend:
    ```sh
    ./target/debug/cake-web
    ```
   Note: You can specify a different configuration file with the `--config` flag or enable `--exex` for direct db access (currently not tested well).
### UI
1. Install the dependencies:
    ```sh
    cd cake-web-ui
    npm install
    npm run generate-client
    ```
   _Note: Server must be running to generate the client._
2. Run the development server:
   ```sh
   npm run dev
   ```
3. Open the browser and navigate to `http://localhost:3000` and login with `admin@admin.com` and password `admin`.

# Many thanks to
- Dexloom for [loom](https://github.com/dexloom/loom)
- [Paradigm](https://github.com/paradigmxyz) for reth, alloy, etc. 