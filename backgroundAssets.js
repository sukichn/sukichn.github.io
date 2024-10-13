const gameAlert = document.getElementById('game-alert');

(function(global) {
    global.loadBackgroundAssets = function(scene) {
        scene.load.image('bgColor', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/cloud-background.png');
        scene.load.image('bg', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/grass.png');
        /*scene.load.image('fog', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/fog.png');
        scene.load.image('trees', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/trees.png');
        scene.load.image('foreground', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/foreground.png');*/
    };

    global.createBackgroundAssets = function(scene, gameState) {
        gameState.backgroundColor = scene.add.tileSprite(0, -75, scene.cameras.main.width, scene.cameras.main.height, 'bgColor')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setScale(1);
        gameState.background = scene.add.tileSprite(0, -75, scene.cameras.main.width, scene.cameras.main.height, 'bg')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setScale(1);
        // No need to set tilePositionY to a fixed value now, as we want vertical scrolling

        /*gameState.trees = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'trees').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);
        gameState.fog = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'fog').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);
        gameState.foreground = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'foreground').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);*/
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

            /*gameState.trees.tilePositionX += directionX * 0.14;
            gameState.foreground.tilePositionX += directionX * 0.2;
            gameState.fog.tilePositionX += directionX * 0.7;*/
        }

        // Adjust the scroll direction based on player's vertical velocity
        if (playerVelocityY !== 0) {
            const directionY = playerVelocityY > 0 ? 1 : -1;
            
            gameState.backgroundColor.tilePositionY += directionY * 0.05;
            gameState.background.tilePositionY += directionY * 0.1;

            /*gameState.trees.tilePositionY += directionY * 0.14;
            gameState.foreground.tilePositionY += directionY * 0.2;
            gameState.fog.tilePositionY += directionY * 0.7;*/
        }

        // Ensure vertical position resets when player is not moving vertically
        if (playerVelocityY === 0) {
            gameState.backgroundColor.tilePositionY = 0;
            gameState.background.tilePositionY = 0;

            /*gameState.trees.tilePositionY = 0;
            gameState.foreground.tilePositionY = 0;
            gameState.fog.tilePositionY = 0;*/
        }
    };

    // Health logic
    global.initializeGameState = function(gameState) {
        gameState.health = 3; // Initialize health
        document.getElementById('health').innerText = `Health: ${gameState.health}`; // Update the health display
    };
    
})(window);