let timerInterval;
let timeRemaining = 60;
let coins = 0;
let gameStarted = false;
let currentRecipe = null; // To keep track of the current recipe

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

// Store the initial positions and parent containers of the draggable elements
const initialPositions = {};
const initialParents = {};

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
    accept: '#yes-drop, .drag-drop',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.85,  

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
        event.relatedTarget.textContent = event.relatedTarget.getAttribute('alt');
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

        // Hide ingredient when dropped
        draggableElement.classList.add('hidden');
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

function displayCauldronMessage() {
    const innerDropzone = document.getElementById('inner-dropzone');
    const yesDropElements = innerDropzone.querySelectorAll('.drag-drop');
    
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
        message += `${count} ${ingredient}, `;
    }

    // Remove the trailing comma and space
    message = message.slice(0, -2);

    document.getElementById('cauldron-status').innerText = message.trim();
}

function checkRecipeMatch() {
    const innerDropzone = document.getElementById('inner-dropzone');
    const yesDropElements = innerDropzone.querySelectorAll('.drag-drop');
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
        reset(); // Call reset instead of resetIngredients
        displayRandomRecipe();
    } else {
        document.getElementById('cauldron-text').innerText = "Your ingredients do not match the recipe!";
    }
}

function startGame() {
    document.getElementById('start-button').classList.add('hidden');
    document.getElementById('end-button').classList.remove('hidden');
    document.getElementById('reset-button').style.display = 'block'; // Unhide reset button
    document.getElementById('reset-button').disabled = false; // Enable reset button when the game starts
    
    // Show ingredients when the game starts
    const draggableElements = document.querySelectorAll('.drag-drop');
    draggableElements.forEach(element => {
        element.classList.remove('hidden');
    });

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
        document.getElementById('reset-button').disabled = true; // Disable reset button when the game ends;
        // Hide ingredients when the game end
        const draggableElements = document.querySelectorAll('.drag-drop');
        draggableElements.forEach(element => {
        element.classList.add('hidden');
    });
    
    }
}

function playGame() {
    document.getElementById('start-button').classList.remove('hidden');
    document.getElementById('play-button').classList.add('hidden');
    document.getElementById('timer').innerText = 'Time: 60';
    document.getElementById('message').innerText = 'Start brewing to see a recipe!';
    document.getElementById('coins').innerText = 'Coins: 0';
    coins = 0; // Reset coins
    reset(); // Ensure the game elements are reset to their initial state
    document.getElementById('cauldron-text').innerText = "";
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

// Initialize the initial positions and parent containers after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    const draggableElements = document.querySelectorAll('.drag-drop');
    draggableElements.forEach(element => {
      initialPositions[element.id] = {
        x: element.offsetLeft,
        y: element.offsetTop
      };
      initialParents[element.id] = element.parentElement; // Store the initial parent container
      
      element.classList.add('hidden');// Ensure ingredients are hidden when the DOM is loaded
    });
    document.getElementById('reset-button').style.display = 'none'; // Hide reset button
});
  
// Reset function to move elements back to their original positions and containers
function reset() {
    const draggableElements = document.querySelectorAll('.drag-drop');
    draggableElements.forEach(element => {
      const initialPosition = initialPositions[element.id];
      const initialParent = initialParents[element.id];
      initialParent.appendChild(element); // Move elements back to their initial parent container
      element.style.transform = 'translate(0px, 0px)'; // Reset the transform
      element.style.left = `${initialPosition.x}px`;
      element.style.top = `${initialPosition.y}px`;
      element.setAttribute('data-x', 0);
      element.setAttribute('data-y', 0);
      element.textContent = element.getAttribute('alt');
      element.classList.remove('hidden'); // Reset visibility
      document.getElementById('cauldron-status').innerText = 'Your cauldron is empty. Add your ingredients!'
    });
}