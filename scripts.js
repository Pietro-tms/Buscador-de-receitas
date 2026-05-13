const form = document.querySelector(".search-form");
const recipeList = document.querySelector(".recipe-list");
const recipeDetails = document.querySelector(".recipe-details");
const loading = document.querySelector(".loading");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = document.querySelector(".search-input").value;
  loading.style.display = "block";

  searchRecipes(searchTerm);
});

async function searchRecipes(ingredient) {
  recipeList.innerHTML = "";
  recipeDetails.style.display = "none";
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`,
  );
  const data = await response.json();
  console.log(data);

  loading.style.display = "none";
  displayRecipes(data.meals);
}

function displayRecipes(recipes) {
  try {
    recipeList.innerHTML = recipes
      .map(
        (recipe) => `
        <div class="recipe-item" data-id="${recipe.idMeal}">
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h3>${recipe.strMeal}</h3>
        </div>
    `,
      )
      .join("");
  } catch (error) {
    recipeList.innerHTML =
      "<p>No recipes found. Please try another ingredient.</p>";
  }
}

recipeList.addEventListener("click", (e) => {
  const recipeItem = e.target.closest(".recipe-item");
  recipeDetails.style.display = "block";

  console.log(recipeItem.dataset.id);

  getRecipeDetails(recipeItem.dataset.id);
});

async function getRecipeDetails(id) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
  );
  const data = await response.json();
  console.log(data);

  displayRecipeDetails(data.meals[0]);
}

function displayRecipeDetails(recipe) {
  const ingredientsList = [];
  for (let i = 1; i < 20; i++) {
    const igredient = recipe[`strIngredient${i}`];
    if (igredient != "" && igredient != null) {
      ingredientsList.push(igredient);
    }
  }

  recipeDetails.innerHTML = `
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <p><strong>Category:</strong> ${recipe.strCategory}</p>
        <p><strong>Area:</strong> ${recipe.strArea}</p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredientsList.map((ingredient) => `<li>${ingredient}</li>`).join("")}
        </ul>
        <h3>Instructions:</h3>
        <p>${recipe.strInstructions}</p>
        
        <a href="${recipe.strYoutube}" target="_blank">Watch on YouTube</a>
    `;
}
