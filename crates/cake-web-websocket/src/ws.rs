use axum::extract::{ConnectInfo, State};
use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::IntoResponse,
};
use cake_web_dto::{BlockHeader, WebSocketMessage};
use cake_web_state::AppState;
use defi_types::ChainParameters;
use std::net::SocketAddr;
use tracing::{error, warn};

/// Handle websocket upgrade
pub async fn ws_handler(
    ws: WebSocketUpgrade,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(app_state): State<AppState>,
) -> impl IntoResponse {
    ws.on_failed_upgrade(move |e| {
        warn!("ws upgrade error: {} with {}", e, addr);
    })
    .on_upgrade(move |socket| on_upgrade(socket, addr, app_state))
}

/// Actual websocket statemachine (one will be spawned per connection)
async fn on_upgrade(mut socket: WebSocket, _who: SocketAddr, app_state: AppState) {
    let mut receiver = app_state.bc.new_block_headers_channel().subscribe().await;

    while let Ok(header) = receiver.recv().await {
        let ws_msg = WebSocketMessage::BlockHeader(BlockHeader {
            number: header.inner.header.number,
            timestamp: header.inner.header.timestamp,
            base_fee_per_gas: header.inner.header.base_fee_per_gas,
            next_block_base_fee: ChainParameters::ethereum().calc_next_block_base_fee_from_header(&header.inner.header),
        });
        match serde_json::to_string(&ws_msg) {
            Ok(json) => {
                let _ = socket.send(Message::Text(json)).await;
            }
            Err(e) => {
                error!("Failed to serialize block header: {}", e);
            }
        }
    }
}
