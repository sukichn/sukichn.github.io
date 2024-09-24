let timerInterval;
    let timeRemaining = 30;
    let coins = 0;
    let gameStarted = false;

    // Recipes
    const recipes = [
        "Potion I: 1 Herb, 2 Berry",
        "Potion II: 2 Mushroom, 1 Berry",
        "Potion III: 2 Herb, 1 Mushroom, 1 Berry"
    ];

    // Function to select a random recipe
    function recipeSelector() {
        let randomRecipe = Math.floor(Math.random() * recipes.length);
        return recipes[randomRecipe];
    }

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
            const data = event.dataTransfer.getData("text");
            const ingredient = document.getElementById(data);
            event.target.appendChild(ingredient);
            updateCauldronIngredients(); // Update the count of ingredients in the cauldron
        }
    }

    function updateCauldronIngredients() {
        const cauldron = document.getElementById('cauldron');
        const cauldronIngredients = {};

        Array.from(cauldron.getElementsByClassName('ingredient')).forEach(ingredient => {
            const ingredientName = ingredient.alt;
            cauldronIngredients[ingredientName] = (cauldronIngredients[ingredientName] || 0) + 1;
        });

        let ingredientsText = 'Cauldron Ingredients: ';
        for (const [ingredient, count] of Object.entries(cauldronIngredients)) {
            ingredientsText += `${ingredient}: ${count}, `;
        }
        ingredientsText = ingredientsText.slice(0, -2); // Remove trailing comma and space
        document.getElementById('cauldron-ingredients').innerText = ingredientsText;
    }

    function startGame() {
        gameStarted = true;
        timeRemaining = 30;
        document.getElementById('timer').innerText = 'Time: ' + timeRemaining;
        document.getElementById('cauldron-text').classList.add('hidden');
        document.getElementById('start-button').classList.add('hidden');
        document.getElementById('end-button').classList.remove('hidden');
        document.getElementById('play-button').classList.add('hidden');
        document.getElementById('clear-button').classList.remove('hidden');
        const recipe = recipeSelector();
        document.getElementById('message').innerText = "Recipe: " + recipe; // Display random recipe

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

    function endGame(autoEnd = false) {
        if (autoEnd || confirm('Are you sure you want to end the game?')) {
            clearInterval(timerInterval);
            gameStarted = false;
            document.getElementById('play-button').classList.remove('hidden');
            document.getElementById('end-button').classList.add('hidden');
            document.getElementById('clear-button').classList.add('hidden');
            document.getElementById('cauldron-text').classList.add('hidden');
            document.getElementById('timer').innerText = 'Time: 30';
            document.getElementById('message').innerText = 'Game over! You earned ' + coins + ' coins!';
            clearCauldron(); // Clear the cauldron
            document.getElementById('cauldron-ingredients').innerText = 'Your cauldron is empty';
        }
    }

    function playGame() {
        document.getElementById('start-button').classList.remove('hidden');
        document.getElementById('play-button').classList.add('hidden');
        document.getElementById('cauldron-text').classList.remove('hidden');
        document.getElementById('message').innerText = 'Start brewing to see a recipe!';
        resetIngredients();
    }

    function resetIngredients() {
        const choppingBoard = document.getElementById('chopping-board');
        document.querySelectorAll('.ingredient').forEach(ingredient => {
            choppingBoard.appendChild(ingredient);
            clearCauldron(); // Clear the cauldron
        });
    }

    function clearCauldron() {
        const cauldron = document.getElementById('cauldron');
        const choppingBoard = document.getElementById('chopping-board');
        const ingredients = Array.from(cauldron.getElementsByClassName('ingredient'));
        updateCauldronIngredients(); // Update the cauldron ingredients display to be empty
        document.getElementById('cauldron-ingredients').innerText = 'Your cauldron is empty';
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.ingredient').forEach(ingredient => {
            ingredient.addEventListener('dragstart', drag);
        });
        document.getElementById('chopping-board').addEventListener('drop', drop);
        document.getElementById('chopping-board').addEventListener('dragover', allowDrop);
        document.getElementById('cauldron').addEventListener('drop', drop);
        document.getElementById('cauldron').addEventListener('dragover', allowDrop);
    });
