const gameAlert = document.getElementById('game-alert');

(function(global) {
    global.loadBackgroundAssets = function(scene) {
        scene.load.image('bgColor', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/cloud-background.png');
        scene.load.image('bg', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/grass.png');
        scene.load.image('sunflower1', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/sunflower1.png');
        scene.load.image('sunflower2', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/sunflower2.png');
    };

    global.createBackgroundAssets = function(scene, gameState) {
        gameState.backgroundColor = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'bgColor')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setScale(1);
        gameState.background = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'bg')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setScale(1);

        // Define the sunflower animation
        scene.anims.create({
            key: 'sunflowerAnimation',
            frames: [
                { key: 'sunflower1' },
                { key: 'sunflower2' }
            ],
            frameRate: 2, // Set the frame rate (adjust as needed)
            repeat: -1 // Repeat indefinitely
        });

        // Add sunflower sprite and play the animation
        gameState.sunflower = scene.add.sprite(0, 0, 'sunflower1')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setScale(1)
            .setDepth(10); // Set depth to a high value to appear in front of other elements

        gameState.sunflower.play('sunflowerAnimation');
    };

    // Scrolling background following player
    global.updateBackgroundAssets = function(gameState) {
        const playerVelocityX = gameState.player.body.velocity.x;
        const playerVelocityY = gameState.player.body.velocity.y;

        // Adjust the scroll direction based on player's horizontal velocity
        if (playerVelocityX !== 0) {
            const directionX = playerVelocityX > 0 ? 1 : -1;
            
            gameState.backgroundColor.tilePositionX += directionX * 0.05;
            gameState.background.tilePositionX += directionX * 0.1;
            gameState.sunflower.x += directionX * 0.2;
        }

        // Adjust the scroll direction based on player's vertical velocity
        if (playerVelocityY !== 0) {
            const directionY = playerVelocityY > 0 ? 1 : -1;
            
            gameState.backgroundColor.tilePositionY += directionY * 0.05;
            gameState.background.tilePositionY += directionY * 0.1;
            gameState.sunflower.y += directionY * 0.2;
        }

        // Ensure vertical position resets when player is not moving vertically
        if (playerVelocityY === 0) {
            gameState.backgroundColor.tilePositionY = 0;
            gameState.background.tilePositionY = 0;
            gameState.sunflower.y = 0;
        }
    };

    // Health logic
    global.initializeGameState = function(gameState) {
        gameState.health = 3; // Initialize health
        document.getElementById('health').innerText = `Health: ${gameState.health}`; // Update the health display
    };
    
})(window);