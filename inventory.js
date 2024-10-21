(function(global) {
    // Function to add an item to the inventory
    function addItemToInventory(itemSrc, itemCaptionText) {
        // Ensure the inventory items container exists
        const inventoryItemsContainer = document.getElementById('inventory-items');
        if (!inventoryItemsContainer) {
            console.error('No inventory items container found!');
            return;
        }

        // Create the container for the image and caption
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item-container');

        const itemIcon = document.createElement('img');
        itemIcon.src = itemSrc; // Path to your item image
        itemIcon.classList.add('item-icon');

        const itemCaption = document.createElement('span');
        itemCaption.classList.add('item-caption');
        itemCaption.innerText = itemCaptionText;

        // Append the image and caption to the container
        itemContainer.appendChild(itemIcon);
        itemContainer.appendChild(itemCaption);

        // Add the container to the inventory items container
        inventoryItemsContainer.appendChild(itemContainer);

        // Add the container to the inventory elements array
        if (global.gameState && global.gameState.inventoryElements) {
            global.gameState.inventoryElements.push(itemContainer);
        } else {
            console.error('gameState or gameState.inventoryElements is not defined!');
        }
    }

    // Expose the function to the global object
    global.addItemToInventory = addItemToInventory;
})(window);