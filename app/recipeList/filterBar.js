"use client";

import { useEffect, useState } from "react";

export default function FilterBar({ recipes = [] }) {
    
  const [ingredientData, setIngredientData] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [filteredRecipeNames, setFilteredRecipeNames] = useState([]);

  // Fetch ingredients on mount, but filter by recipe names in `recipes` prop
  useEffect(() => {
    if (!recipes || recipes.length === 0) return;

    console.log("Received recipes:", recipes);

    fetch("/ingredientsInRecipe.json")
        .then((res) => res.json())
        .then((data) => {
        console.log("Fetched ingredientsInRecipe.json:", data);

        const userRecipeNames = recipes.map((r) => r.recipeName);
        console.log("User recipe names:", userRecipeNames);

        const filteredData = data.filter((entry) =>
            userRecipeNames.includes(entry.recipe_name)
        );
        console.log("Filtered ingredient data:", filteredData);

        setIngredientData(filteredData);

        const unique = Array.from(
            new Set(filteredData.map((item) => item.ingredientsName))
        );
        setIngredients(unique);
        })
        .catch((err) => console.error("Error fetching ingredients:", err));
    }, [recipes]);



  // Update filtered recipes based on selected ingredients
  useEffect(() => {
    const grouped = ingredientData.reduce((acc, item) => {
      const { recipe_name, ingredientsName } = item;
      if (!acc[recipe_name]) acc[recipe_name] = new Set();
      acc[recipe_name].add(ingredientsName);
      return acc;
    }, {});

    if (selectedIngredients.length === 0) {
      setFilteredRecipeNames(Object.keys(grouped)); // All recipes
      return;
    }

    const result = Object.entries(grouped)
      .filter(([_, ingSet]) =>
        selectedIngredients.some((ingredient) => ingSet.has(ingredient))
      )
      .map(([name]) => name);

    setFilteredRecipeNames(result);
  }, [selectedIngredients, ingredientData]);

  // Handle checkbox changes
  const handleChange = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Filter Recipes by Ingredients</h2>

      <div style={{ marginBottom: "1rem" }}>
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
      {filteredRecipeNames.length > 0 ? (
        <ul>
          {filteredRecipeNames.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
}
