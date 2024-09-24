let timerInterval;
    let timeRemaining = 30;
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


    // Function to select a random recipe
    function recipeSelector() {
        let randomRecipe = Math.floor(Math.random() * recipes.length);
        return recipes[randomRecipe];
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
            const data = event.dataTransfer.getData("text");
            const ingredient = document.getElementById(data);
            event.target.appendChild(ingredient);
            updateCauldronIngredients(); // Update the count of ingredients in the cauldron
        }
    }

    function touchStart(event) {
        if (gameStarted && event.touches.length === 1) {
            event.preventDefault(); // Prevent default behavior like trying to open the image or link
            const touch = event.touches[0];
            const target = touch.target;
    
            // Mock dataTransfer object
            event.dataTransfer = { data: {} };
            event.dataTransfer.setData("text", target.id);
    
            target.style.opacity = '0.5'; // Visual cue
            target.style.transform = 'scale(1.1)'; // Optionally scale the element a bit
    
            // Store initial position to help calculate movement in touchMove
            target.setAttribute('data-start-x', touch.clientX);
            target.setAttribute('data-start-y', touch.clientY);
        }
    }
    
    function touchMove(event) {
        if (gameStarted && event.touches.length === 1) {
            event.preventDefault(); // Prevent scrolling and other default actions
            const touch = event.touches[0];
            const target = touch.target;
    
            // Calculate movement based on initial touch
            const startX = parseFloat(target.getAttribute('data-start-x'));
            const startY = parseFloat(target.getAttribute('data-start-y'));
    
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
    
            // Apply the movement as a CSS transform
            target.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.1)`;
        }
    }
    
    function touchEnd(event) {
        if (gameStarted && event.changedTouches.length === 1) {
            event.preventDefault();
            const touch = event.changedTouches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
    
            // Mimic the drop
            if (target && target.classList.contains('dropzone')) {
                const data = event.dataTransfer.getData("text");
                const ingredient = document.getElementById(data);
                target.appendChild(ingredient);
                updateCauldronIngredients(); // Update the count of ingredients in the cauldron
    
                ingredient.style.opacity = '1';
                ingredient.style.transform = 'none'; // Reset any transformations
            }
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

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.ingredient').forEach(ingredient => {
            ingredient.addEventListener('dragstart', drag);
            ingredient.addEventListener('touchstart', touchStart);
            ingredient.addEventListener('touchmove', touchMove);
            ingredient.addEventListener('touchend', touchEnd);
        });
    
        const dropZones = [document.getElementById('chopping-board'), document.getElementById('cauldron')];
        dropZones.forEach(dropZone => {
            dropZone.addEventListener('drop', drop);
            dropZone.addEventListener('dragover', allowDrop);
            dropZone.addEventListener('touchend', touchEnd);
            dropZone.addEventListener('touchmove', touchMove);
        });
    });
