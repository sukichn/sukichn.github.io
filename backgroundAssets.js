const gameAlert = document.getElementById('game-alert');

(function(global) {
    global.loadBackgroundAssets = function(scene) {
        scene.load.image('bg', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/snowscape.png');
    };

    global.createBackgroundAssets = function(scene, gameState) {
        const width = scene.cameras.main.width;
        const height = scene.cameras.main.height;

        // Create a tile sprite that covers the entire viewport with appropriate scaling
        gameState.background = scene.add.tileSprite(0, 0, width * 2, height * 2, 'bg').setOrigin(0, 0).setScrollFactor(0);

        // Calculate scale based on the original image dimensions, ensuring it covers the entire viewport
        const scaleX = width / gameState.background.width;
        const scaleY = height / gameState.background.height;
        const scale = Math.max(scaleX, scaleY);

        // Apply scaling
        gameState.background.setScale(scale);
    };

    global.updateBackgroundAssets = function(gameState) {
        if (gameState.player.body.velocity.x !== 0 || gameState.player.body.velocity.y !== 0) {
            // Adjust the scroll direction based on player's velocity
            const directionX = gameState.player.body.velocity.x > 0 ? 1 : -1;
            const directionY = gameState.player.body.velocity.y > 0 ? 1 : -1;

            gameState.background.tilePositionX += directionX * 0.1;
            gameState.background.tilePositionY += directionY * 0.1;
        }
    };

    global.initializeGameState = function(gameState) {
        gameState.health = 3; // Initialize health
        document.getElementById('health').innerText = `Health: ${gameState.health}`; // Update the health display
    };

    global.handleSceneTransition = function(scene, nextSceneKey) {
        scene.scene.start(nextSceneKey);
    };
    
})(window);