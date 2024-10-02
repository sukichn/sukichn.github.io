let timerInterval;
let timeRemaining = 60;
let coins = 0;
let gameStarted = false;
let currentRecipe = null; // To keep track of the current recipe

// Global elements
const innerDropzone = document.getElementById('inner-dropzone');
const cauldronStatus = document.getElementById('cauldron-status');
const cauldronText = document.getElementById('cauldron-text');
const resetButton = document.getElementById('reset-button');
const coin1 = document.getElementById('coin1');
const coin2 = document.getElementById('coin2');
const timerDisplay = document.getElementById('timer');
const messageDisplay = document.getElementById('message');
const coinsDisplay = document.getElementById('coins');

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
        // Update the cauldron message and check ingredient counts
        displayCauldronMessage();
        checkIngredientCounts();
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

    let message = '';
    const totalIngredients = Object.values(ingredientCounts).reduce((total, count) => total + count, 0);

    if (totalIngredients > 0) {
        message = 'Cauldron ingredients: ';
        for (const [ingredient, count] of Object.entries(ingredientCounts)) {
            message += `${count} ${ingredient}, `;
        }
        // Remove the trailing comma and space
        message = message.slice(0, -2);
    }

    cauldronStatus.innerText = message.trim();

    // Return the ingredient counts
    return ingredientCounts;
}

function checkRecipeMatch() {
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
        cauldronText.innerText = "You've earned 5 coins!";
        coinsDisplay.innerText = ` ${coins}`;
        // Change the background color to purple
        innerDropzone.style.backgroundColor = "rgba(52, 4, 52, 0.7)";
        // Revert the background color after a delay
        setTimeout(() => {
            innerDropzone.style.backgroundColor = "";
        }, 500); // 500 milliseconds
        runAnimations(true);
        playMagicAudio(); // Play magic audio
        /*playSuccessAudio(); // Play coin audio*/
        reset(); // Call reset instead of resetIngredients
        displayRandomRecipe();
    } else {
        cauldronText.innerText = "Your ingredients do not match the recipe!";
    }
}

function startGame() {
    document.getElementById('start-button').classList.add('hidden');
    document.getElementById('end-button').classList.remove('hidden');
    resetButton.style.display = 'block'; // Unhide reset button
    resetButton.disabled = true; // Enable reset button when the game starts
    
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
        resetButton.disabled = true; // Disable reset button when the game ends;
        // Hide ingredients when the game ends
        const draggableElements = document.querySelectorAll('.drag-drop');
        draggableElements.forEach(element => {
        element.classList.add('hidden');
        });
    // Display total earned coins
    cauldronText.innerText = `Game over! You've earned ${coins} coins!`;
    }
}

function playGame() {
    document.getElementById('start-button').classList.remove('hidden');
    document.getElementById('play-button').classList.add('hidden');
    timerDisplay.innerText = 'Time: 60';
    messageDisplay.innerText = 'Start brewing to see a recipe!';
    coinsDisplay.innerText = ' 0';
    coins = 0; // Reset coins
    reset(); // Ensure the game elements are reset to their initial state
    cauldronText.innerText = "";
    // Continue hiding ingredients until start game
    const draggableElements = document.querySelectorAll('.drag-drop');
    draggableElements.forEach(element => {
        element.classList.add('hidden');
    });
}

function startTimer(duration) {
    let timer = duration;

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

    messageDisplay.innerText = recipeText;
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
    resetButton.style.display = 'none'; // Hide reset button

    // Add event listeners for animation end
    coin1.addEventListener('animationend', () => {
        coin1.classList.add('hidden');
    });
    coin2.addEventListener('animationend', () => {
        coin2.classList.add('hidden');
    });

    // Call the function initially to check the ingredient counts on page load
    checkIngredientCounts();
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
    });
    cauldronStatus.innerText = 'Your cauldron is empty. Add your ingredients!';
    // Check the ingredient counts and disable the reset button if necessary
    checkIngredientCounts();
}

function runAnimations(condition) {
    if (condition) {
        resetAnimations(); // Ensure previous animations are reset

        // Unhide coins
        const coins = document.querySelectorAll('.coin');
        coins.forEach(element => {
        element.classList.remove('hidden');
    });

        // Use a timeout to force a reflow and trigger the animations again
        setTimeout(() => {
            coin1.classList.add('animate-coin1');
            coin2.classList.add('animate-coin2');
        }, 0);
    }
}

function resetAnimations() {
    coin1.classList.remove('animate-coin1');
    coin2.classList.remove('animate-coin2');
}

// Function to play magic audio
function playMagicAudio() {
    const audio = document.getElementById('magic-audio');
    audio.play();
}

resetButton.addEventListener('click', playResetAudio);

// Function to play reset audio
function playResetAudio() {
    const audio = document.getElementById('reset-audio');
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
    });
}

// Function to check the ingredient counts and disable the reset button if necessary
function checkIngredientCounts() {
    const ingredientCounts = displayCauldronMessage();

    // Check if there are no ingredients in the cauldron
    const totalIngredients = Object.values(ingredientCounts).reduce((total, count) => total + count, 0);
    if (totalIngredients === 0) {
        resetButton.disabled = true;
    } else {
        resetButton.disabled = false;
    }
}