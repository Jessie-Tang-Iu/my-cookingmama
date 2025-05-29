"use client";

import { useEffect, useState } from "react";
import Ingredients from "../recipeList/ingredients";
import FilterBar from "../recipeList/filterBar";

export default function Page({ name }) {
  const [recipes, setRecipes] = useState([]);
  const [ingredientsData, setIngredientsData] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load recipes first
    fetch("/recipe.json")
      .then((res) => res.json())
      .then((data) => {
        const foundRecipes = data.filter((recipe) =>
          recipe.owner.includes(name)
        );
        setRecipes(foundRecipes);
        return foundRecipes;
      })
      .then((filteredRecipes) => {
        // Then load ingredient data only for those recipes
        fetch("/ingredientsInRecipe.json")
          .then((res) => res.json())
          .then((data) => {
            const names = filteredRecipes.map((r) => r.recipeName);
            const filteredIngredients = data.filter((entry) =>
              names.includes(entry.recipe_name)
            );
            setIngredientsData(filteredIngredients);
            setLoading(false);
          });
      })
      .catch(() => setLoading(false));
  }, [name]);

  // Filter recipes based on selected ingredients
  const getFilteredRecipes = () => {
    if (selectedIngredients.length === 0) return recipes;

    // Group ingredient entries by recipe
    const grouped = ingredientsData.reduce((acc, entry) => {
      const { recipe_name, ingredientsName } = entry;
      if (!acc[recipe_name]) acc[recipe_name] = new Set();
      acc[recipe_name].add(ingredientsName);
      return acc;
    }, {});

    // Return only recipes with at least one matching ingredient
    return recipes.filter((recipe) => {
      const ingSet = grouped[recipe.recipeName];
      if (!ingSet) return false;
      return selectedIngredients.some((i) => ingSet.has(i));
    });
  };

  const filteredRecipes = getFilteredRecipes();

  if (loading) return <p>Loading...</p>;
  if (recipes.length === 0) return <p>No recipes found for {name}.</p>;

  const tableStyle = {
    borderWidth: "2px",
    borderColor: "white",
    borderStyle: "solid",
    borderCollapse: "collapse",
    width: "100%",
  };
  const borderStyle = { border: "2px solid white", padding: "8px" };

  return (
    <main>
      <h1>Recipes owned by {name}:</h1>
      <FilterBar
        ingredientsData={ingredientsData}
        selectedIngredients={selectedIngredients}
        setSelectedIngredients={setSelectedIngredients}
      />
      <br />
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={borderStyle}>Recipe Name</th>
            <th style={borderStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecipes.map((recipe, idx) => (
            <tr key={idx}>
              <td style={borderStyle}>{recipe.recipeName}</td>
              <td style={borderStyle}>
                <button
                  onClick={() =>
                    setSelectedIndex(
                      selectedIndex === idx ? null : idx
                    )
                  }
                >
                  {selectedIndex === idx ? "Hide Details" : "View Details"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedIndex !== null && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid gray",
          }}
        >
          <h2>{filteredRecipes[selectedIndex].recipeName}</h2>
          <Ingredients recipe={filteredRecipes[selectedIndex].recipeName} />
          <pre>Instruction:</pre>
          <pre>{filteredRecipes[selectedIndex].instruction}</pre>
        </div>
      )}
    </main>
  );
}
