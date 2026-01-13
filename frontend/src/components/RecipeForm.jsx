import React, { useState } from 'react';
import { createRecipe } from '../api';

const RecipeForm = ({ onRecipeAdded }) => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [ingName, setIngName] = useState('');
    const [ingQty, setIngQty] = useState('');
    const [ingUnit, setIngUnit] = useState('');
    const [ingPrice, setIngPrice] = useState('');

    const addIngredient = () => {
        if (!ingName || !ingQty || !ingUnit) return;
        setIngredients([...ingredients, {
            name: ingName,
            quantity: parseFloat(ingQty),
            unit: ingUnit,
            price_per_unit: ingPrice ? parseFloat(ingPrice) : null
        }]);
        setIngName('');
        setIngQty('');
        setIngPrice('');
        // Keep unit for convenience or clear it
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || ingredients.length === 0) return;

        const newRecipe = { title, image_url: null, ingredients };
        await createRecipe(newRecipe);
        setTitle('');
        setIngredients([]);
        if (onRecipeAdded) onRecipeAdded();
    };

    return (
        <div className="card">
            <h3>Add New Recipe</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Recipe Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />

                <h4>Ingredients</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="Name (e.g. Flour)" value={ingName} onChange={e => setIngName(e.target.value)} />
                    <input type="number" placeholder="Qty" value={ingQty} onChange={e => setIngQty(e.target.value)} style={{ width: '80px' }} />
                    <input type="text" placeholder="Unit (kg)" value={ingUnit} onChange={e => setIngUnit(e.target.value)} style={{ width: '80px' }} />
                    <input type="number" placeholder="Price/Unit ($)" value={ingPrice} onChange={e => setIngPrice(e.target.value)} style={{ width: '100px' }} />
                    <button type="button" onClick={addIngredient}>Add</button>
                </div>

                <ul>
                    {ingredients.map((ing, idx) => (
                        <li key={idx}>
                            {ing.quantity} {ing.unit} {ing.name}
                            {ing.price_per_unit && ` ($${ing.price_per_unit}/unit)`}
                        </li>
                    ))}
                </ul>

                <button type="submit" disabled={!title || ingredients.length === 0}>Save Recipe</button>
            </form>
        </div>
    );
};

export default RecipeForm;
