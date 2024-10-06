let timerInterval;
let timeRemaining = 60;
let coins = 0;
let gameStarted = false;

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

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('play-button').addEventListener('click', playGame);
});

function startGame() {
    gameStarted = true;
    document.getElementById('start-button').classList.add('hidden');
    document.getElementById('end-button').classList.remove('hidden');

    // Start the timer
    startTimer(60); // Start the timer with 60 seconds

    // Display random recipe
    displayRandomRecipe();
}

function startTimer(duration) {
    clearInterval(timerInterval); // Clear any existing timer intervals

    timeRemaining = duration;
    const timerDisplay = document.getElementById('timer');

    timerInterval = setInterval(() => {
        if (!gameStarted) {
            clearInterval(timerInterval);
            return;
        }

        let minutes = Math.floor(timeRemaining / 60);
        let seconds = timeRemaining % 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;

        timerDisplay.innerText = `Time: ${minutes}:${seconds}`;

        if (--timeRemaining < 0) {
            clearInterval(timerInterval);
            endGame(true);
        }
    }, 1000);
}

function endGame(autoEnd = false) {
    if (!gameStarted) return; // Prevent multiple calls

    clearInterval(timerInterval); // Stop the timer
    gameStarted = false;

    if (autoEnd) {
        alert('Time is up! Game over.');
        showEndGameButtons();
    } else if (confirm('Are you sure you want to end the game?')) {
        showEndGameButtons();
    } else {
        // If the user cancels, restart the timer
        gameStarted = true; // Re-enable the game state
        startTimer(timeRemaining); // Restart the timer with the remaining time
    }
}

function showEndGameButtons() {
    document.getElementById('end-button').classList.add('hidden');
    document.getElementById('play-button').classList.remove('hidden');
}

function playGame() {
    document.getElementById('start-button').classList.remove('hidden');
    document.getElementById('play-button').classList.add('hidden');
    document.getElementById('timer').innerText = 'Time: 60';
    document.getElementById('message').innerText = 'Start brewing to see a recipe!';
    document.getElementById('cauldron-status').innerText = 'Your cauldron is empty. Add your ingredients!';
    clearInterval(timerInterval); // Clear any existing timers
    reset(); // Reset any game elements to their initial state
}

function displayRandomRecipe() {
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const currentRecipe = recipes[randomIndex];

    let recipeText = `Recipe: ${currentRecipe.name} - `;
    for (const [ingredient, quantity] of Object.entries(currentRecipe.ingredients)) {
        recipeText += `${quantity} ${ingredient}, `;
    }
    recipeText = recipeText.slice(0, -2); // Remove trailing comma and space

    document.getElementById('message').innerText = recipeText;
}

function displayCauldronMessage() {
    const innerDropzone = document.getElementById('inner-dropzone');
    const yesDropElements = innerDropzone.querySelectorAll('.yes-drop');
    
    const ingredientCounts = {};

    yesDropElements.forEach(element => {
        const altText = element.getAttribute('alt');
        if (ingredientCounts[altText]) {
            ingredientCounts[altText]++;
        } else {
            ingredientCounts[altText] = 1;
        }
    });

    let message = 'Cauldron ingredients: ';
    for (const [ingredient, count] of Object.entries(ingredientCounts)) {
        message += `${count} ${ingredient} `;
    }

    document.getElementById('new-message').innerText = message.trim();
}