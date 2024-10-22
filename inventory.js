(function(global) {
    // Initialize gameState if not already initialized
    global.gameState = global.gameState || {
        inventoryElements: [],
        coinsCollected: 0,
        mushroomsCollected: 0,
    };

    // Function to initialize inventory items
    global.initializeInventory = function() {
        const inventoryItemsContainer = document.getElementById('inventory-items');

        // Butterfly (coin) item
        const butterflyContainer = document.createElement('div');
        butterflyContainer.classList.add('item-container');
        butterflyContainer.id = 'butterfly-container';
        butterflyContainer.style.display = 'none'; // Initially hidden

        const butterflyIcon = document.createElement('img');
        butterflyIcon.src = 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/butterfly-inventory.png';
        butterflyIcon.classList.add('item-icon');

        const butterflyCaption = document.createElement('span');
        butterflyCaption.classList.add('item-caption');
        butterflyCaption.id = 'butterfly-caption';
        butterflyCaption.innerText = `Butterfly: ${gameState.coinsCollected}`;

        const butterflyRemove = document.createElement('button');
        butterflyRemove.classList.add('item-remove');
        butterflyRemove.innerText = 'Discard';
        butterflyRemove.onclick = () => discardItem('butterfly');

        butterflyContainer.appendChild(butterflyIcon);
        butterflyContainer.appendChild(butterflyCaption);
        butterflyContainer.appendChild(butterflyRemove);

        inventoryItemsContainer.appendChild(butterflyContainer);

        // Mushroom item
        const mushroomContainer = document.createElement('div');
        mushroomContainer.classList.add('item-container');
        mushroomContainer.id = 'mushroom-container';
        mushroomContainer.style.display = 'none'; // Initially hidden

        const mushroomIcon = document.createElement('img');
        mushroomIcon.src = 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/mushroom-small.png';
        mushroomIcon.classList.add('item-icon');

        const mushroomCaption = document.createElement('span');
        mushroomCaption.classList.add('item-caption');
        mushroomCaption.id = 'mushroom-caption';
        mushroomCaption.innerText = `Mushroom: ${gameState.mushroomsCollected}`;

        const mushroomRemove = document.createElement('button');
        mushroomRemove.classList.add('item-remove');
        mushroomRemove.innerText = 'Discard';
        mushroomRemove.onclick = () => discardItem('mushroom');

        mushroomContainer.appendChild(mushroomIcon);
        mushroomContainer.appendChild(mushroomCaption);
        mushroomContainer.appendChild(mushroomRemove);

        inventoryItemsContainer.appendChild(mushroomContainer);
    };

    // Function to handle item pickup
    global.pickupItem = function(itemType) {
        let itemContainerId = '';

        if (itemType === 'butterfly') {
            gameState.coinsCollected += 2; // Increment by 2 for butterfly
            document.getElementById('butterfly-caption').innerText = `Butterfly: ${gameState.coinsCollected}`;
            itemContainerId = 'butterfly-container';
        } else if (itemType === 'mushroom') {
            gameState.mushroomsCollected += 1; // Increment by 1 for mushroom
            document.getElementById('mushroom-caption').innerText = `Mushroom: ${gameState.mushroomsCollected}`;
            itemContainerId = 'mushroom-container';
        }

        if (itemContainerId) {
            // Show the item container if it has items
            const itemContainer = document.getElementById(itemContainerId);
            const inventoryControlButton = document.getElementById('inventory-control');

            itemContainer.style.display = 'flex';

            // Apply the green background color momentarily
            itemContainer.style.backgroundColor = 'green';
            setTimeout(() => {
                itemContainer.style.backgroundColor = ''; // Reset the background color
            }, 600);
        }
    };

    // Function to handle item discard
    global.discardItem = function(itemType) {
        // Confirm with the user before discarding the item
        if (confirm(`Are you sure you want to discard a ${itemType}?`)) {
            let itemContainerId = '';
            let captionId = '';
            let earnedId = '';

            if (itemType === 'butterfly' && gameState.coinsCollected > 0) {
                gameState.coinsCollected -= 1; // Decrement by 1 for discard
                captionId = 'butterfly-caption';
                earnedId = 'coins-earned';
                itemContainerId = 'butterfly-container';
            } else if (itemType === 'mushroom' && gameState.mushroomsCollected > 0) {
                gameState.mushroomsCollected -= 1; // Decrement by 1 for discard
                captionId = 'mushroom-caption';
                earnedId = 'mushrooms-earned';
                itemContainerId = 'mushroom-container';
            }

            if (captionId && earnedId) {
                const itemCount = gameState[itemType === 'butterfly' ? 'coinsCollected' : 'mushroomsCollected'];
                document.getElementById(earnedId).innerText = `${capitalizeFirstLetter(itemType)}: ${itemCount}`;
                document.getElementById(captionId).innerText = `${capitalizeFirstLetter(itemType)}: ${itemCount}`;

                // Hide the item container if it has no items
                const itemContainer = document.getElementById(itemContainerId);
                const inventoryControlButton = document.getElementById('inventory-control');
                if (itemCount === 0) {
                    itemContainer.style.display = 'none';
                } else {
                    // Apply the red background color momentarily
                    itemContainer.style.backgroundColor = 'red';
                    setTimeout(() => {
                        itemContainer.style.backgroundColor = ''; // Reset the background color
                    }, 600);
                }
            }
        }
    };

    // Helper function to capitalize the first letter of a string
    global.capitalizeFirstLetter = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

})(window);