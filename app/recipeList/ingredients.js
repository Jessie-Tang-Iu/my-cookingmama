"use client";

import { useEffect, useState } from 'react';

export default function Ingredients({ recipe }) {

    const [ingredients, setIngredients] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/ingredientsInRecipe.json")
        .then((res) => res.json())
        .then((data) => {
            const foundIngredients = data.filter((ingredient) => ingredient.recipe_name.includes(recipe)
        );
        setIngredients(foundIngredients);
        setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [recipe]);

    if (loading) return <p>Loading recipes...</p>;

    if (!ingredients || ingredients.length === 0) 
        return <p>No ingredient found!</p>;

    return (
        <div>
            {ingredients.map((ingredient, idx) => (
                <div key={idx}>
                    <p>{ingredient.ingredientsName} {ingredient.quantity}</p>
                </div>
            ))}
        </div>
    );
}