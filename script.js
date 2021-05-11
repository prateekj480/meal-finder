const searchBtn = document.getElementById("search")
const randomBtn = document.getElementById("random")
const inputMeal = document.getElementById("search-meal")
const searchResult = document.getElementById("search-result")
const meals = document.getElementById("meals")
const singleMeal = document.getElementById("single-meal")

// event listeners
searchBtn.addEventListener("click", searchMeals)
meals.addEventListener("click", displaySingleMeal)
randomBtn.addEventListener("click", searchRandomMeal)


function searchMeals() {
    singleMeal.innerHTML = ""
    meals.innerHTML = '<div class="meals" id="meals"></div>'
    const mealTerm = inputMeal.value;
    if (mealTerm.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealTerm}`).then(res => res.json()).then(data => {
            if (data.meals === null) {
                searchResult.innerHTML = `<p>Please enter a valid meal name or keyword</p>`
            } else {
                searchResult.innerHTML = `<h2>Search results for '${mealTerm}':</h2>`
                meals.innerHTML = data.meals.map(meal => `
                <div class="img-container" data-mealId=${meal.idMeal}>
                <img src=${meal.strMealThumb} alt=${meal.strMeal}>
                <h3 class="meal-info">${meal.strMeal}</h3>
                </div>
                `).join("")
            }
        })
    }
}

function displaySingleMeal(e) {
    if (e.target.parentElement.classList.contains("img-container")) {
        let mealId = e.target.parentElement.getAttribute("data-mealid")
        getMealByID(mealId)
    }
}

function getMealByID(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`).then(res => res.json()).then(data => {
        const meal = data.meals[0]
        addMealToDom(meal)
    })
}

function addMealToDom(meal) {
    const ingredientsArr = []
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredientsArr.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
        } else {
            break;
        }
    }
    searchResult.innerHTML = ""
    meals.innerHTML = `
    <div class="img-container" data-mealid="${meal.idMeal}">
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    </div>`
    singleMeal.innerHTML = `<h2>${meal.strMeal}</h2>
        <div class="meal-category">
            <h3>${meal.strCategory}</h3>
            <h3>${meal.strArea}</h3>
            </div>
            <div class="meal-instructions">
            <p>${meal.strInstructions}</p>
            </div>
            <div class="meal-ingredients">
            <h2>Ingredients</h2>
            <div class="ingredient-div-container"></div>
        </div>`
    ingredientsArr.forEach(ingredient => {
        const ingredientsEl = document.querySelector(".ingredient-div-container")
        const ingredientDiv = document.createElement("div")
        ingredientDiv.className = "ingredient-div"
        ingredientDiv.innerHTML = `<p>${ingredient}</p>`
        ingredientsEl.appendChild(ingredientDiv)
    })
}

function searchRandomMeal() {
    singleMeal.innerHTML = ""
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`).then(res => res.json()).then(data => {
        const meal = data.meals[0]
        addMealToDom(meal)
    })
}


