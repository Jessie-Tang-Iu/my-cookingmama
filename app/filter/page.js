"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Ingredients from "../recipeList/ingredients";


export default function Page() {
  const [allData, setAllData] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("/recipe.json")
        .then((res) => res.json())
        .then((data) => setRecipes(data));
    }, []);


  // Fetch ingredients on mount
  useEffect(() => {
    fetch("/ingredientsInRecipe.json")
      .then((res) => res.json())
      .then((data) => {
        setAllData(data);

        // Get unique ingredient names
        const unique = Array.from(new Set(data.map((item) => item.ingredientsName)));
        setIngredients(unique);
      });
  }, []);


  useEffect(() => {
    const groupedRecipes = allData.reduce((acc, item) => {
        const { recipe_name, ingredientsName } = item;
        if (!acc[recipe_name]) acc[recipe_name] = new Set();
        acc[recipe_name].add(ingredientsName);
        return acc;
    }, {});

    if (selectedIngredients.length === 0) {
        const matched = recipes.filter((r) => groupedRecipes[r.recipeName]);
        setFilteredRecipes(matched);
        return;
    }

    const result = recipes.filter((recipe) => {
        const ingredientsSet = groupedRecipes[recipe.recipeName];
        if (!ingredientsSet) return false;

        return selectedIngredients.some((ingredient) =>
        ingredientsSet.has(ingredient)
        );
    });

    setFilteredRecipes(result);
    }, [selectedIngredients, allData, recipes]);


  // Handle checkbox toggle
  const handleChange = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

    const tableStyle = {borderWidth: "2px",borderColor: "#1f1f1f",borderStyle: "solid",borderCollapse: "collapse",width: "100%",};
    const borderStyle= { border: "2px solid #1f1f1f", padding: "8px" };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Filter Recipes by Ingredients</h2>

      <button
        onClick={() => setSelectedIngredients([])}
        style={{ marginBottom: "10px", borderWidth: 1, borderRadius: 3, padding: 3 }}
      >
        Reset All
      </button>

      <div>
        {ingredients.map((ingredient) => (
          <label key={ingredient} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              value={ingredient}
              onChange={() => handleChange(ingredient)}
              checked={selectedIngredients.includes(ingredient)}
            />
            {ingredient}
          </label>
        ))}
      </div>

      <hr />

      <h3>Matching Recipes:</h3>
      {filteredRecipes.length > 0 ? (

        <table style={tableStyle}>
            <thead>
                <tr>
                    <th style={borderStyle}>Recipe Name</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {filteredRecipes.map((recipe, idx) => (
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
      ) : (
        <p>No recipes found.</p>
      )}

        {selectedIndex !== null && (
            <div style={{ marginTop: "20px", padding: "10px", border: "1px solid gray" }}>
            <h2>{filteredRecipes[selectedIndex].recipeName}</h2>
            <br />
            Ingredients:
            <Ingredients recipe={filteredRecipes[selectedIndex].recipeName}/>
            <br />
            <pre>Instruction:</pre>
            <pre>{filteredRecipes[selectedIndex].instruction}</pre>
            </div>
        )}
        {/* <Link href="/" className="text-cyan-600 underline hover:text-cyan-300">Home</Link> */}
    </div>

    
  );
}
