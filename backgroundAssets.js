(function(global) {
    global.loadBackgroundAssets = function(scene) {
        scene.load.image('bg', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/snowscape.png');
    };

    global.createBackgroundAssets = function(scene, gameState) {
        const width = scene.cameras.main.width;
        const height = scene.cameras.main.height;

        // Create a tile sprite that covers the entire viewport with some extra margin for larger screens
        gameState.background = scene.add.tileSprite(0, 0, width * 2, height * 2, 'bg').setOrigin(0, 0).setScrollFactor(0);
        
        // Adjust the scale to ensure more of the image is visible
        const scaleX = width / gameState.background.width;
        const scaleY = height / gameState.background.height;

        // Apply a uniform scale that keeps the aspect ratio but makes sure the image is not too small
        const scale = Math.max(scaleX, scaleY);
        gameState.background.setScale(scale);
    };

    global.updateBackgroundAssets = function(gameState) {
        const playerVelocityX = gameState.player.body.velocity.x;
        const playerVelocityY = gameState.player.body.velocity.y;

        if (playerVelocityX !== 0 || playerVelocityY !== 0) {
            // Adjust the scroll direction based on player's velocity
            const directionX = playerVelocityX > 0 ? 1 : -1;
            const directionY = playerVelocityY > 0 ? 1 : -1;

            gameState.background.tilePositionX += directionX * 0.1;
            gameState.background.tilePositionY += directionY * 0.1;
        }
    };

    global.initializeGameState = function(gameState) {
        gameState.health = 3; // Initialize health
        document.getElementById('health').innerText = `Health: ${gameState.health}`; // Update the health display
    };
})(window);