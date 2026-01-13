mod models;
mod store;
mod handlers;

use axum::{
    routing::{get, post, delete},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use crate::store::AppState;

#[tokio::main]
async fn main() {
    let state = AppState::new();

    let app = Router::new()
        .route("/api/recipes", get(handlers::list_recipes).post(handlers::create_recipe))
        .route("/api/plan", get(handlers::get_plan))
        .route("/api/plan/add", post(handlers::add_to_plan))
        .route("/api/plan/remove/:id", delete(handlers::remove_from_plan))
        .route("/api/shopping-list", get(handlers::generate_shopping_list))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
