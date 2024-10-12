const gameAlert = document.getElementById('game-alert');

(function(global) {
    global.loadBackgroundAssets = function(scene) {
        scene.load.image('bg', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/snowscape.png');
        /*scene.load.image('fog', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/fog.png');
        scene.load.image('trees', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/trees.png');
        scene.load.image('foreground', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/foreground.png');*/
    };

    global.createBackgroundAssets = function(scene, gameState) {
        /*gameState.background = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'bg').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);*/
       /* gameState.trees = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'trees').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);
        gameState.fog = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'fog').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);
        gameState.foreground = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'foreground').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);*/
        gameState.background = scene.add.tileSprite(0, 20, 4000, 2000, 'bg').setOrigin(0, 0).setScrollFactor(0).setScale(0.5, 0.5);
    };

    // Scrolling background following player
    global.updateBackgroundAssets = function(gameState) {
        const playerVelocityX = gameState.player.body.velocity.x;
        const playerVelocityY = gameState.player.body.velocity.y;

        if (playerVelocityX !== 0 || playerVelocityY !== 0) {
            // Adjust the scroll direction based on player's velocity
            const directionX = playerVelocityX > 0 ? 1 : -1;
            const directionY = playerVelocityY > 0 ? 1 : -1;

            gameState.background.tilePositionX += directionX * 0.1;
            gameState.background.tilePositionY += directionY * 0.1;
           /* gameState.trees.tilePositionX += direction * 0.14;
            gameState.foreground.tilePositionX += direction * 0.2;
            gameState.fog.tilePositionX += direction * 0.7;*/
        }
    };

    // Health logic
    global.initializeGameState = function(gameState) {
        gameState.health = 3; // Initialize health
        document.getElementById('health').innerText = `Health: ${gameState.health}`; // Update the health display
    };
    
})(window);