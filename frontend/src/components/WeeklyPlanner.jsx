import React, { useEffect, useState } from 'react';
import { getPlan, getRecipes, removeFromPlan } from '../api';

const WeeklyPlanner = () => {
    const [plan, setPlan] = useState(null);
    const [recipesMap, setRecipesMap] = useState({});

    const fetchData = async () => {
        const [planData, recipesData] = await Promise.all([getPlan(), getRecipes()]);
        setPlan(planData);

        const map = {};
        recipesData.forEach(r => map[r.id] = r);
        setRecipesMap(map);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRemove = async (recipeId) => {
        await removeFromPlan(recipeId);
        fetchData();
    };

    if (!plan) return <div>Loading...</div>;

    return (
        <div>
            <h2>Weekly Plan</h2>
            {plan.recipe_ids.length === 0 ? (
                <p>No recipes in your plan yet. Go to Recipes to add some!</p>
            ) : (
                <div className="recipe-grid">
                    {plan.recipe_ids.map((id, index) => {
                        const recipe = recipesMap[id];
                        if (!recipe) return null;
                        return (
                            <div className="card" key={`${id}-${index}`}>
                                <h3>{recipe.title}</h3>
                                <p>{recipe.ingredients.length} ingredients</p>
                                <button className="danger" onClick={() => handleRemove(id)}>Remove</button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default WeeklyPlanner;
