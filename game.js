let timerInterval;
    let timeRemaining = 30;
    let coins = 0;
    let gameStarted = false;    
    let currentRecipe = null;

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

    function startGame() {
        gameStarted = true;
        timeRemaining = 30;
        document.getElementById('timer').innerText = 'Time: ' + timeRemaining;
        document.getElementById('start-button').classList.add('hidden');
        document.getElementById('end-button').classList.remove('hidden');
        document.getElementById('play-button').classList.add('hidden');
        document.getElementById('clear-button').classList.remove('hidden');
        document.getElementById('brew-button').classList.remove('hidden');

        //Display random recipe
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
            ingredientsText += `${ingredient}: ${count}, `;
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
    
        // Compare the cauldron ingredients with the required recipe ingredients
        for (const [ingredient, count] of Object.entries(currentRecipe.ingredients)) {
            if (!cauldronIngredients[ingredient] || cauldronIngredients[ingredient] < count) {
                document.getElementById('cauldron-text').innerText="The ingredients do not match the recipe!";
                return false;
            }
        }
    
        // If the ingredients match the recipe
        setCoins(coins + 5);
        document.getElementById('cauldron-text').innerText="The potion is successfully brewed! You've earned 5 coins.";
        console.log('Coins:', coins); // Debugging: Log the updated coin count
        
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
            document.getElementById('timer').innerText = 'Time: 30';
            document.getElementById('message').innerText = 'Game over! You earned ' + coins + ' coins!';
            document.getElementById('cauldron-text').innerText="";

        }
    }

    function playGame() {
        document.getElementById('start-button').classList.remove('hidden');
        document.getElementById('play-button').classList.add('hidden');
        document.getElementById('brew-button').classList.add('hidden');
        document.getElementById('message').innerText = 'Start brewing to see a recipe!';
        document.getElementById('cauldron-text').innerText="";
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
        document.getElementById('cauldron-ingredients').innerText = 'Your cauldron is empty.  Add your ingredients!';
    }

    // Handle touch events for mobile support
    function handleTouchStart(event) {
        if (gameStarted) {
            event.preventDefault();
            const touch = event.targetTouches[0];
            const ingredient = event.target;
            ingredient.style.position = 'absolute';
            ingredient.style.left = `${touch.pageX - ingredient.offsetWidth / 2}px`;
            ingredient.style.top = `${touch.pageY - ingredient.offsetHeight / 2}px`;
            ingredient.ontouchmove = handleTouchMove;
            ingredient.ontouchend = handleTouchEnd;
        }
    }

    function handleTouchMove(event) {
        if (gameStarted) {
            event.preventDefault();
            const touch = event.targetTouches[0];
            const ingredient = event.target;
            ingredient.style.left = `${touch.pageX - ingredient.offsetWidth / 2}px`;
            ingredient.style.top = `${touch.pageY - ingredient.offsetHeight / 2}px`;
        }
    }

    function handleTouchEnd(event) {
        if (gameStarted) {
            event.preventDefault();
            const ingredient = event.target;
            ingredient.style.position = 'initial';
            ingredient.ontouchmove = null;
            ingredient.ontouchend = null;

            // Check if the ingredient was dropped on a valid target
            const cauldron = document.getElementById('cauldron');
            const choppingBoard = document.getElementById('chopping-board');
            if (ingredient.getBoundingClientRect().intersects(cauldron.getBoundingClientRect())) {
                cauldron.appendChild(ingredient);
            } else if (ingredient.getBoundingClientRect().intersects(choppingBoard.getBoundingClientRect())) {
                choppingBoard.appendChild(ingredient);
            }
            updateCauldronIngredients(); // Update the count of ingredients in the cauldron
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.ingredient').forEach(ingredient => {
            ingredient.addEventListener('dragstart', drag);
            ingredient.addEventListener('touchstart', handleTouchStart);
        });
        document.getElementById('chopping-board').addEventListener('drop', drop);
        document.getElementById('chopping-board').addEventListener('dragover', allowDrop);
        document.getElementById('cauldron').addEventListener('drop', drop);
        document.getElementById('cauldron').addEventListener('dragover', allowDrop);
    });
