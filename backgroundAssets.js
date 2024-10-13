const gameAlert = document.getElementById('game-alert');

(function(global) {
    global.loadBackgroundAssets = function(scene) {
        scene.load.image('bgColor', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/distant-mountains.png');
        scene.load.image('bg', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/blue-mountains.png');
        /*scene.load.image('fog', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/fog.png');
        scene.load.image('trees', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/trees.png');
        scene.load.image('foreground', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/foreground.png');*/
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
        // No need to set tilePositionY to a fixed value now, as we want vertical scrolling

        /*gameState.trees = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'trees').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);
        gameState.fog = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'fog').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);
        gameState.foreground = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'foreground').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);*/
    };

    // Scrolling background following player
    global.updateBackgroundAssets = function(gameState) {
        const playerVelocityX = gameState.player.body.velocity.x;

        if (playerVelocityX !== 0 || gameState.player.body.velocity.y !== 0) {
            // Adjust the scroll direction based on player's horizontal velocity
            const direction = playerVelocityX > 0 ? 1 : -1;
            
            gameState.backgroundColor.tilePositionX += direction * 0.08;
            gameState.backgroundColor.tilePositionY += 0.08; // Use fixed vertical velocity

            gameState.background.tilePositionX += direction * 0.12;
            gameState.background.tilePositionY += 0.12; // Use fixed vertical velocity

            /*gameState.trees.tilePositionX += direction * 0.14;
            gameState.trees.tilePositionY += 0.14;
            gameState.foreground.tilePositionX += direction * 0.2;
            gameState.foreground.tilePositionY += 0.2;
            gameState.fog.tilePositionX += direction * 0.7;
            gameState.fog.tilePositionY += 0.7;*/
        }
    };

    // Health logic
    global.initializeGameState = function(gameState) {
        gameState.health = 3; // Initialize health
        document.getElementById('health').innerText = `Health: ${gameState.health}`; // Update the health display
    };
    
})(window);