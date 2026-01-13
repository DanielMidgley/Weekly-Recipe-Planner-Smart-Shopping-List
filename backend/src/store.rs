use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use uuid::Uuid;
use crate::models::{Recipe, WeeklyPlan};

#[derive(Clone)]
pub struct AppState {
    pub recipes: Arc<RwLock<HashMap<Uuid, Recipe>>>,
    pub weekly_plan: Arc<RwLock<WeeklyPlan>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            recipes: Arc::new(RwLock::new(HashMap::new())),
            weekly_plan: Arc::new(RwLock::new(WeeklyPlan {
                id: Uuid::new_v4(),
                recipe_ids: Vec::new(),
            })),
        }
    }
}
