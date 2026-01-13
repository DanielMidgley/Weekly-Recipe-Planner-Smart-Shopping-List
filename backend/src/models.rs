use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Ingredient {
    pub name: String,
    pub quantity: f64,
    pub unit: String,
    pub price_per_unit: Option<f64>, // Price per 1 unit
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Recipe {
    pub id: Uuid,
    pub title: String,
    pub image_url: Option<String>,
    pub ingredients: Vec<Ingredient>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WeeklyPlan {
    pub id: Uuid,
    pub recipe_ids: Vec<Uuid>,
}
