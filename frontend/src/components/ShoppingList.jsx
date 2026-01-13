import React, { useEffect, useState } from 'react';
import { getShoppingList } from '../api';

const ShoppingList = () => {
    const [listData, setListData] = useState(null);

    useEffect(() => {
        getShoppingList().then(setListData);
    }, []);

    if (!listData) return <div>Loading...</div>;

    return (
        <div>
            <h2>Shopping List</h2>
            <div className="card">
                <ul className="ingredient-list">
                    {listData.items.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>
                                <strong>{item.total_quantity} {item.ingredient.unit}</strong> {item.ingredient.name}
                            </span>
                            <span>
                                {item.estimated_cost > 0 ? `$${item.estimated_cost.toFixed(2)}` : '-'}
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="price-summary">
                    Total Estimated Cost: ${listData.total_estimated_cost.toFixed(2)}
                </div>
            </div>
        </div>
    );
};

export default ShoppingList;
