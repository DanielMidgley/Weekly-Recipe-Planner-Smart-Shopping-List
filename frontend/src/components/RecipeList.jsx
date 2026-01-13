import React, { useEffect, useState } from 'react';
import { getRecipes, addToPlan } from '../api';
import RecipeForm from './RecipeForm';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);

    const fetchRecipes = async () => {
        const data = await getRecipes();
        setRecipes(data);
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const handleAddToPlan = async (recipeId) => {
        try {
            await addToPlan(recipeId);
            alert('Added to weekly plan!');
        } catch (err) {
            console.error(err);
            alert('Failed to add to plan');
        }
    };

    return (
        <div>
            <h2>Recipes</h2>
            <RecipeForm onRecipeAdded={fetchRecipes} />
            <div className="recipe-grid">
                {recipes.map(recipe => (
                    <div className="card" key={recipe.id}>
                        <h3>{recipe.title}</h3>
                        <p>{recipe.ingredients.length} ingredients</p>
                        <button onClick={() => handleAddToPlan(recipe.id)}>Add to Weekly Plan</button>
                        <ul style={{ fontSize: '0.9rem', color: '#666' }}>
                            {recipe.ingredients.slice(0, 3).map((ing, i) => (
                                <li key={i}>{ing.name}</li>
                            ))}
                            {recipe.ingredients.length > 3 && <li>...</li>}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipeList;
