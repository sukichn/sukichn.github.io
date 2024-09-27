let timerInterval;
let timeRemaining = 60;
let coins = 0;
let gameStarted = false;
let touchData = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

// Recipes
const recipes = [
    {
        name: "Potion I",
        ingredients: {
            Herb: 1,
            Berry: 2
        }
    },
    {
        name: "Potion II",
        ingredients: {
            Mushroom: 2,
            Berry: 1
        }
    },
    {
        name: "Potion III",
        ingredients: {
            Herb: 2,
            Mushroom: 1,
            Berry: 1
        }
    }
];

// Touch event handlers
function handleTouchStart(e) {
    const touch = e.targetTouches[0];
    touchData = e.target.id;
    e.preventDefault();
}

function handleTouchMove(e) {
    const touch = e.targetTouches[0];

    // Move element to the touch position
    e.target.style.left = (touch.pageX - touchOffsetX) + "px";
    e.target.style.top = (touch.pageY - touchOffsetY) + "px";

    e.preventDefault();
}

function handleTouchEnd(e) {
    const touch = e.changedTouches[0];
    const cauldron = document.getElementById("cauldron");
    const cauldronRect = cauldron.getBoundingClientRect();
    const ingredientRect = e.target.getBoundingClientRect();

    if (
        ingredientRect.left < cauldronRect.right &&
        ingredientRect.right > cauldronRect.left &&
        ingredientRect.top < cauldronRect.bottom &&
        ingredientRect.bottom > cauldronRect.top
    ) {
        cauldron.appendChild(e.target);
        e.target.style.position = "relative";
        e.target.style.left = "0px";
        e.target.style.top = "0px";
        e.target.style.display = 'none'; // Hide the dropped ingredient
        updateCauldronIngredients(); // Update the cauldron text
    } else {
        e.target.style.position = "";
        e.target.style.left = "";
        e.target.style.top = "";
        e.target.style.zIndex = "";
    }
    touchData = null;
    e.preventDefault();
}

// Function to select a random recipe
function recipeSelector() {
    let randomRecipe = Math.floor(Math.random() * recipes.length);
    return recipes[randomRecipe];
}

function createSparkleEffect(isMatch) {
    const cauldron = document.getElementById("cauldron");
    const cauldronRect = cauldron.getBoundingClientRect();
    const sparkleCount = 5; // Number of sparkles
    const radius = 60; // Increase this value to move the sparkles further out
    const additionalOffsetY = 50; // Additional offset to move the sparks higher

    // Function to create and animate a sparkle
    const createSparkle = (offsetX, offsetY) => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.backgroundColor = isMatch ? 'gold' : 'green';
        sparkle.style.left = (cauldronRect.width / 2 - 5 + offsetX) + "px"; // Adjust for positioning
        sparkle.style.top = (cauldronRect.height / 2 - 5 + offsetY - additionalOffsetY) + "px"; // Adjust for positioning and move higher
        cauldron.appendChild(sparkle);

        // Show the spark
        sparkle.style.display = 'block';

        // Remove the spark after the animation completes
        setTimeout(() => {
            cauldron.removeChild(sparkle);
        }, 500); // Duration of the animation in milliseconds
    };

    // Create multiple sparkles around the center
    for (let i = 0; i < sparkleCount; i++) {
        const angle = (i / sparkleCount) * 2 * Math.PI;
        const offsetX = radius * Math.cos(angle); // Adjust distance from center
        const offsetY = radius * Math.sin(angle); // Adjust distance from center
        createSparkle(offsetX, offsetY);
    }
}

// Function for mouse drag and drop
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    if (gameStarted) {
        event.dataTransfer.setData("text", event.target.id);
    }
}

function drop(event) {
    if (gameStarted) {
        event.preventDefault();
        const data = event.dataTransfer ? event.dataTransfer.getData("text") : touchData;
        const ingredient = document.getElementById(data);
        event.target.appendChild(ingredient);
        updateCauldronIngredients(); // Update the count of ingredients in the cauldron
        ingredient.style.display = 'none'; // Hide the dropped ingredient
        touchData = null;
    }
}

function startGame() {
    gameStarted = true;
    timeRemaining = 60;
    document.getElementById('timer').innerText = 'Time: ' + timeRemaining;
    document.getElementById('start-button').classList.add('hidden');
    document.getElementById('end-button').classList.remove('hidden');
    document.getElementById('play-button').classList.add('hidden');
    document.getElementById('clear-button').classList.remove('hidden');
    document.getElementById('brew-button').classList.remove('hidden');

    // Display random recipe
    currentRecipe = recipeSelector();
    const formattedRecipe = `${currentRecipe.name}: ${Object.entries(currentRecipe.ingredients).map(([ingredient, count]) => `${count} ${ingredient}`).join(', ')}`;
    document.getElementById('message').innerText = 'Recipe: ' + formattedRecipe;

    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('timer').innerText = 'Time: ' + timeRemaining;
        if (timeRemaining <= 0) {
            endGame(true);
        }
    }, 1000);
}

function setCoins(coinsEarned) {
    coins = coinsEarned;
    document.getElementById('coins').innerText = 'Coins: ' + coins;
    return coins;
}

function updateCauldronIngredients() {
    const cauldron = document.getElementById('cauldron');
    const cauldronIngredients = {};

    // Count the ingredients in the cauldron
    Array.from(cauldron.getElementsByClassName('ingredient')).forEach(ingredient => {
        const ingredientName = ingredient.alt;
        cauldronIngredients[ingredientName] = (cauldronIngredients[ingredientName] || 0) + 1;
    });

    // Display the ingredients in the cauldron in the message box
    let ingredientsText = 'Cauldron Ingredients: ';
    for (const [ingredient, count] of Object.entries(cauldronIngredients)) {
        ingredientsText += `${count} ${ingredient}, `;
    }
    ingredientsText = ingredientsText.slice(0, -2); // Remove trailing comma and space
    document.getElementById('cauldron-ingredients').innerText = ingredientsText;
}

function checkRecipeMatch() {
    const cauldron = document.getElementById('cauldron');
    const cauldronIngredients = {};

    // Count the ingredients in the cauldron
    Array.from(cauldron.getElementsByClassName('ingredient')).forEach(ingredient => {
        const ingredientName = ingredient.alt;
        cauldronIngredients[ingredientName] = (cauldronIngredients[ingredientName] || 0) + 1;
    });

    console.log('Cauldron Ingredients:', cauldronIngredients);
    console.log('Current Recipe Ingredients:', currentRecipe.ingredients);

    let isMatch = true;

    // Compare the cauldron ingredients with the required recipe ingredients
    for (const [ingredient, count] of Object.entries(currentRecipe.ingredients)) {
        if (!cauldronIngredients[ingredient] || cauldronIngredients[ingredient] < count) {
            isMatch = false;
            break;
        }
    }

    // Trigger appropriate spark animation
    if (isMatch) {
        setCoins(coins + 5);
        document.getElementById('cauldron-text').innerText = "The potion is successfully brewed! You've earned 5 coins.";
        console.log('Coins:', coins); // Debugging: Log the updated coin count
        createSparkleEffect(true);
    } else {
        document.getElementById('cauldron-text').innerText = "The ingredients do not match the recipe!";
        createSparkleEffect(false);
    }

    // Generate and display a new recipe
    currentRecipe = recipeSelector();
    const formattedRecipe = `${currentRecipe.name}: ${Object.entries(currentRecipe.ingredients).map(([ingredient, count]) => `${count} ${ingredient}`).join(', ')}`;
    document.getElementById('message').innerText = 'Recipe: ' + formattedRecipe;

    clearCauldron();
    resetIngredients();

    return true;
}

function endGame(autoEnd = false) {
    if (autoEnd || confirm('Are you sure you want to end the game?')) {
        clearInterval(timerInterval);
        gameStarted = false;
        document.getElementById('play-button').classList.remove('hidden');
        document.getElementById('end-button').classList.add('hidden');
        document.getElementById('clear-button').classList.add('hidden');
        document.getElementById('brew-button').classList.add('hidden');
        document.getElementById('timer').innerText = 'Time: 60';
        document.getElementById('message').innerText = 'Game over! You earned ' + coins + ' coins!';
        document.getElementById('cauldron-text').innerText = "";
    }
}

function playGame() {
    document.getElementById('start-button').classList.remove('hidden');
    document.getElementById('play-button').classList.add('hidden');
    document.getElementById('brew-button').classList.add('hidden');
    document.getElementById('message').innerText = 'Start brewing to see a recipe!';
    document.getElementById('cauldron-text').innerText = "";
    resetIngredients();
    clearCauldron(); // Ensure the cauldron is cleared when the game is restarted
}

function clearCauldron() {
    const cauldron = document.getElementById('cauldron');
    const choppingBoard = document.getElementById('chopping-board');
    const ingredients = Array.from(cauldron.getElementsByClassName('ingredient'));
    ingredients.forEach(ingredient => {
        choppingBoard.appendChild(ingredient); // Move each ingredient back to the chopping board
        ingredient.style.display = 'block'; // Ensure the ingredient is visible
    });
    updateCauldronIngredients(); // Update the cauldron ingredients display to be empty
    document.getElementById('cauldron-ingredients').innerText = 'Your cauldron is empty. Add your ingredients!';
}

function resetIngredients() {
    const choppingBoard = document.getElementById('chopping-board');
    document.querySelectorAll('.ingredient').forEach(ingredient => {
        ingredient.style.display = 'block'; // Reset visibility to block
        choppingBoard.appendChild(ingredient);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const ingredients = document.querySelectorAll('.ingredient');
    const choppingBoard = document.getElementById('chopping-board');
    const cauldron = document.getElementById('cauldron');

    // Add drag event listeners
    ingredients.forEach(ingredient => {
        ingredient.addEventListener('dragstart', drag);
    });
    choppingBoard.addEventListener('drop', drop);
    choppingBoard.addEventListener('dragover', allowDrop);
    cauldron.addEventListener('drop', drop);
    cauldron.addEventListener('dragover', allowDrop);

    // Add touch event listeners
    ingredients.forEach(ingredient => {
        ingredient.addEventListener('touchstart', handleTouchStart, false);
        ingredient.addEventListener('touchmove', handleTouchMove, false);
        ingredient.addEventListener('touchend', handleTouchEnd, false);
    });
});