import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:3000/api',
});

export const getRecipes = () => api.get('/recipes').then(res => res.data);
export const createRecipe = (recipe) => api.post('/recipes', recipe).then(res => res.data);
export const getPlan = () => api.get('/plan').then(res => res.data);
export const addToPlan = (recipeId) => api.post('/plan/add', { recipe_id: recipeId }).then(res => res.data);
export const removeFromPlan = (recipeId) => api.delete(`/plan/remove/${recipeId}`).then(res => res.data);
export const getShoppingList = () => api.get('/shopping-list').then(res => res.data);
