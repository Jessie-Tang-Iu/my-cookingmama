"use client";

import { useEffect, useState } from "react";
import Ingredients from "./ingredients";

export default function Page({ name }) {

    const [recipes, setRecipes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        fetch("/recipe.json")
        .then((res) => res.json())
        .then((data) => {
            const foundRecipes = data.filter((recipe) => recipe.owner.includes(name)
        );
        setRecipes(foundRecipes);
        setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading recipes...</p>;
    if(!recipes || recipes.length === 0)
        return <p>No recipes found for owner: {name}</p>;

    const tableStyle = {borderWidth: "2px",borderColor: "#1f1f1f",borderStyle: "solid",borderCollapse: "collapse",width: "100%",};
    const borderStyle= { border: "2px solid #1f1f1f", padding: "8px" };

    return (
        <main>
        <h1>Recipes owned by {name}:</h1>
        <br />
        <table style={tableStyle}>
            <thead>
            <tr>
                <th style={borderStyle}>Recipe Name</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {recipes.map((recipe, idx) => (
                <tr key={idx}>
                <td style={borderStyle}>{recipe.recipeName}</td>
                <td style={borderStyle}>
                    <button onClick={() => setSelectedIndex(idx === selectedIndex ? null : idx)}>
                    {selectedIndex === idx ? "Hide Details" : "View Details"}
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {selectedIndex !== null && (
            <div style={{ marginTop: "20px", padding: "10px", border: "1px solid gray" }}>
            <h2>{recipes[selectedIndex].recipeName}</h2>
            <br />
            Ingredients:
            <Ingredients recipe={recipes[selectedIndex].recipeName}/>
            <br />
            <pre>Instruction:</pre>
            <pre>{recipes[selectedIndex].instruction}</pre>
            </div>
        )}
        </main>
    );
}