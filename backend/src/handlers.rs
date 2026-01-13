use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use uuid::Uuid;
use crate::models::{Ingredient, Recipe, WeeklyPlan};
use crate::store::AppState;
use serde::{Deserialize, Serialize};

// --- Models for Requests ---
#[derive(Deserialize)]
pub struct CreateRecipeRequest {
    pub title: String,
    pub image_url: Option<String>,
    pub ingredients: Vec<Ingredient>,
}

#[derive(Deserialize)]
pub struct AddToPlanRequest {
    pub recipe_id: Uuid,
}

// --- Recipe Handlers ---

pub async fn list_recipes(State(state): State<AppState>) -> Json<Vec<Recipe>> {
    let recipes = state.recipes.read().unwrap();
    let list: Vec<Recipe> = recipes.values().cloned().collect();
    Json(list)
}

pub async fn create_recipe(
    State(state): State<AppState>,
    Json(payload): Json<CreateRecipeRequest>,
) -> Json<Recipe> {
    let mut recipes = state.recipes.write().unwrap();
    let id = Uuid::new_v4();
    let recipe = Recipe {
        id,
        title: payload.title,
        image_url: payload.image_url,
        ingredients: payload.ingredients,
    };
    recipes.insert(id, recipe.clone());
    Json(recipe)
}

// --- Weekly Plan Handlers ---

pub async fn get_plan(State(state): State<AppState>) -> Json<WeeklyPlan> {
    let plan = state.weekly_plan.read().unwrap();
    Json(plan.clone())
}

pub async fn add_to_plan(
    State(state): State<AppState>,
    Json(payload): Json<AddToPlanRequest>,
) -> Result<Json<WeeklyPlan>, StatusCode> {
    let recipes = state.recipes.read().unwrap();
    if !recipes.contains_key(&payload.recipe_id) {
        return Err(StatusCode::NOT_FOUND);
    }

    let mut plan = state.weekly_plan.write().unwrap();
    plan.recipe_ids.push(payload.recipe_id);
    Ok(Json(plan.clone()))
}

pub async fn remove_from_plan(
    State(state): State<AppState>,
    Path(recipe_id_str): Path<String>,
) -> Result<Json<WeeklyPlan>, StatusCode> {
    let recipe_id = Uuid::parse_str(&recipe_id_str).map_err(|_| StatusCode::BAD_REQUEST)?;
    let mut plan = state.weekly_plan.write().unwrap();
    if let Some(pos) = plan.recipe_ids.iter().position(|x| *x == recipe_id) {
        plan.recipe_ids.remove(pos);
    }
    Ok(Json(plan.clone()))
}

// --- Shopping List Logic ---

#[derive(Serialize)]
pub struct ShoppingItem {
    pub ingredient: Ingredient,
    pub total_quantity: f64,
    pub estimated_cost: f64,
}

#[derive(Serialize)]
pub struct ShoppingListResponse {
    pub items: Vec<ShoppingItem>,
    pub total_estimated_cost: f64,
}

pub async fn generate_shopping_list(State(state): State<AppState>) -> Json<ShoppingListResponse> {
    let plan = state.weekly_plan.read().unwrap();
    let recipes = state.recipes.read().unwrap();

    let mut aggregated_ingredients: std::collections::HashMap<String, ShoppingItem> = std::collections::HashMap::new();

    for recipe_id in &plan.recipe_ids {
        if let Some(recipe) = recipes.get(recipe_id) {
            for ing in &recipe.ingredients {
                let key = format!("{}-{}", ing.name.to_lowercase(), ing.unit.to_lowercase());
                
                let entry = aggregated_ingredients.entry(key).or_insert(ShoppingItem {
                    ingredient: ing.clone(),
                    total_quantity: 0.0,
                    estimated_cost: 0.0,
                });
                
                entry.total_quantity += ing.quantity;
                if let Some(price) = ing.price_per_unit {
                    entry.estimated_cost += ing.quantity * price;
                }
            }
        }
    }

    let mut items: Vec<ShoppingItem> = aggregated_ingredients.into_values().collect();
    // Sort by name for consistency
    items.sort_by(|a, b| a.ingredient.name.cmp(&b.ingredient.name));

    let total_estimated_cost: f64 = items.iter().map(|item| item.estimated_cost).sum();

    Json(ShoppingListResponse {
        items,
        total_estimated_cost,
    })
}
