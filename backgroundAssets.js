const gameAlert = document.getElementById('game-alert');

(function(global) {
    global.loadBackgroundAssets = function(scene) {
        scene.load.image('bgColor', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/cloud-background.png');
        scene.load.image('bg', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/grass.png');
        scene.load.image('sunflower1', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/sunflower1.png');
        scene.load.image('sunflower2', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/sunflower2.png');
        scene.load.image('sunflower3', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/sunflower3.png');
        scene.load.image('sunflower4', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/sunflower4.png');

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
                { key: 'sunflower2' },
                { key: 'sunflower3' },
                { key: 'sunflower4' },
            ],
            frameRate: 4, // Set the frame rate (adjust as needed)
            repeat: -1 // Repeat indefinitely
        });

        // Add sunflower sprite at the desired position and play the animation
        gameState.sunflower = scene.add.sprite(-500, 350, 'sunflower1') // Adjust the x and y coordinates as needed
            .setOrigin(0, 0)
            .setScale(1)
            .setDepth(10); // Set depth to a high value to appear in front of other elements

        gameState.sunflower.play('sunflowerAnimation');
    };

    // Scrolling background following player
    global.updateBackgroundAssets = function(gameState) {
        const playerVelocityX = gameState.player.body.velocity.x;

        // Adjust the scroll direction based on player's horizontal velocity
        if (playerVelocityX !== 0) {
            const directionX = playerVelocityX > 0 ? 1 : -1;
            
            gameState.backgroundColor.tilePositionX += directionX * 0.05;
            gameState.background.tilePositionX += directionX * 0.1;
        }
    };

    // Health logic
    global.initializeGameState = function(gameState) {
        gameState.health = 3; // Initialize health
        document.getElementById('health').innerText = `Health: ${gameState.health}`; // Update the health display
    };

})(window);