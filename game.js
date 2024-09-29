let timerInterval;
let timeRemaining = 60;
let coins = 0;
let gameStarted = false;
let currentRecipe = null; // To keep track of the current recipe
const initialPositions = {}; // To store initial positions of draggable elements

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

interact('.drag-drop')
    .draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true
            })
        ],
        autoScroll: true,
        listeners: { move: dragMoveListener }
    });

function dragMoveListener(event) {
    var target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '.yes-drop',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.75,

    // listen for drop related events:
    ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
    },
    ondragenter: function (event) {
        var draggableElement = event.relatedTarget;
        var dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
    },
    ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
    },
    ondrop: function (event) {
        // Append the dropped element to the dropzone
        var draggableElement = event.relatedTarget;
        var dropzoneElement = event.target;

        // Reset the transformation and position attributes
        draggableElement.style.transform = 'translate(0px, 0px)';
        draggableElement.setAttribute('data-x', 0);
        draggableElement.setAttribute('data-y', 0);
        
        dropzoneElement.appendChild(draggableElement);

        // update the count of yes-drop elements in inner-dropzone and display the message
        displayCauldronMessage();
        checkRecipeMatch();
    },
    ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
    }
});

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

function checkRecipeMatch() {
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

    if (!currentRecipe) return;

    const recipeIngredients = currentRecipe.ingredients;
    let match = true;

    for (const [ingredient, quantity] of Object.entries(recipeIngredients)) {
        if (ingredientCounts[ingredient] !== quantity) {
            match = false;
            break;
        }
    }

    if (match) {
        coins += 5;
        document.getElementById('cauldron-text').innerText = "You've earned 5 coins!";
        document.getElementById('coins').innerText = `Coins: ${coins}`;
        document.getElementById('new-message').innerText = 'Your cauldron is empty. Add your ingredients!'
        resetIngredients();
        displayRandomRecipe();
    } else {
        document.getElementById('cauldron-text').innerText = "Your ingredients do not match the recipe!";
    }
}

function startGame() {
    document.getElementById('start-button').classList.add('hidden');
    document.getElementById('end-button').classList.remove('hidden');
    document.getElementById('clear-button').classList.remove('hidden');
    
    // Store initial positions of draggable elements
    storeInitialPositions();
    
    // Start the timer
    startTimer(60); // Start the timer with 60 seconds

    // Display random recipe
    displayRandomRecipe();
}

function endGame(autoEnd = false) {
    if (autoEnd || confirm('Are you sure you want to end the game?')) {
        clearInterval(timerInterval);
        document.getElementById('end-button').classList.add('hidden');
        document.getElementById('play-button').classList.remove('hidden');
    }
}

function playGame() {
    document.getElementById('start-button').classList.remove('hidden');
    document.getElementById('play-button').classList.add('hidden');
    document.getElementById('timer').innerText = 'Time: 60';
    document.getElementById('message').innerText = 'Start brewing to see a recipe!';
    document.getElementById('coins').innerText = 'Coins: 0';
    coins = 0; // Reset coins
}

function startTimer(duration) {
    let timer = duration;
    const timerDisplay = document.getElementById('timer');

    timerInterval = setInterval(() => {
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;

        timerDisplay.innerText = `Time: ${minutes}:${seconds}`;

        if (--timer < 0) {
            clearInterval(timerInterval);
            endGame(true);
        }
    }, 1000);
}

function displayRandomRecipe() {
    const randomIndex = Math.floor(Math.random() * recipes.length);
    currentRecipe = recipes[randomIndex];

    let recipeText = `Recipe: ${currentRecipe.name} - `;
    for (const [ingredient, quantity] of Object.entries(currentRecipe.ingredients)) {
        recipeText += `${quantity} ${ingredient}, `;
    }
    recipeText = recipeText.slice(0, -2); // Remove trailing comma and space

    document.getElementById('message').innerText = recipeText;
}

function storeInitialPositions() {
    const draggableElements = document.querySelectorAll('.drag-drop');
    draggableElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        initialPositions[element.id] = { x: rect.left, y: rect.top };
    });
}

function resetIngredients() {
    const draggableElements = document.querySelectorAll('.drag-drop');
    draggableElements.forEach(element => {
        const initialPosition = initialPositions[element.id];
        element.style.transform = `translate(0px, 0px)`;
        element.setAttribute('data-x', 0);
        element.setAttribute('data-y', 0);

        // Move the element back to its initial position
        element.style.left = `${initialPosition.x}px`;
        element.style.top = `${initialPosition.y}px`;

        // Append the element back to its original parent
        document.body.appendChild(element);

        //Reset cauldron ingredients message
        document.getElementById('new-message').innerText = 'Your cauldron is empty. Add your ingredients!';
    });
}
/*
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
            if (isMatch) {
                sparkle.style.backgroundColor = 'gold';
            } else {
                sparkle.style.backgroundColor = 'green';
            }
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
            const data = event.dataTransfer.getData("text");
            const ingredient = document.getElementById(data);
            event.target.appendChild(ingredient);
            updateCauldronIngredients(); // Update the count of ingredients in the cauldron
            ingredient.style.display = 'none'; // Hide the dropped ingredient
        }
    }
    
    // Add event listeners to draggable elements
    document.querySelectorAll('.ingredient').forEach(item => {
        item.addEventListener('dragstart', function(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        });
    });

        function startGame() {
        gameStarted = true;
        timeRemaining = 60;
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
            document.getElementById('cauldron-text').innerText="";
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
        document.querySelectorAll('.ingredient').forEach(ingredient => {
            ingredient.addEventListener('dragstart', drag);
        });
        document.getElementById('chopping-board').addEventListener('drop', drop);
        document.getElementById('chopping-board').addEventListener('dragover', allowDrop);
        document.getElementById('cauldron').addEventListener('drop', drop);
        document.getElementById('cauldron').addEventListener('dragover', allowDrop);
    });
*/
