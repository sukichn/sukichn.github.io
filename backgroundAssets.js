const gameAlert = document.getElementById('game-alert');

(function(global) {
    global.loadBackgroundAssets = function(scene) {
        scene.load.image('bg', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/background.png');
        scene.load.image('fog', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/fog.png');
        scene.load.image('trees', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/trees.png');
        scene.load.image('foreground', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/foreground.png');
    };

    global.createBackgroundAssets = function(scene, gameState) {
        gameState.background = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'bg').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);
        gameState.trees = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'trees').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);
        gameState.fog = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'fog').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);
        gameState.foreground = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, 'foreground').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);
    };

    // Scrolling background following player
    global.updateBackgroundAssets = function(gameState) {
        if (gameState.player.body.velocity.x !== 0 || gameState.player.body.velocity.y !== 0) {
            gameState.background.tilePositionX += 0.1;
            gameState.trees.tilePositionX += 0.14;
            gameState.foreground.tilePositionX += 0.2;
            gameState.fog.tilePositionX += 0.7;
        }
    };

    // Health logic
    global.initializeGameState = function(gameState) {
        gameState.health = 3; // Initialize health
        document.getElementById('health').innerText = `Health: ${gameState.health}`; // Update the health display
    };

    // Handle game over logic
    global.handleGameOver = function(scene, gameState) {
        gameAlert.innerText = 'Game over!\n Click to play again';
        void gameAlert.offsetWidth; // Trigger reflow to restart the animation
        gameAlert.classList.add('show');

        scene.physics.pause();
        gameState.active = false;
        scene.anims.pauseAll();
        if (gameState.enemy1.move) gameState.enemy1.move.stop();
        if (gameState.enemy2.move) gameState.enemy2.move.stop();
        gameState.player.setTint(0xff0000);

        // Stop the timer event
        if (gameState.timerEvent) {
            gameState.timerEvent.remove();
        }

        // Remove previous event listeners to avoid multiple triggers
        scene.input.keyboard.off('keydown');
        scene.input.off('pointerup');
        scene.input.off('pointerdown');
        scene.input.off('pointermove');

        const restartGame = () => {
            gameAlert.classList.remove('show');
            scene.anims.resumeAll();
            gameState.leftPressed = false;
            gameState.rightPressed = false;
            gameState.upPressed = false;
            gameState.health = 3; // Reset health
            document.getElementById('health').innerText = `Health: ${gameState.health}`;
            document.getElementById('coins-earned').innerText = 'Score: 0';
            scene.scene.restart();
        };

        // Add new event listeners for restarting the scene
        scene.input.keyboard.on('keydown', restartGame);
        scene.input.on('pointerup', restartGame);

        // Add global event listener for pointerdown on the entire screen
        document.addEventListener('pointerdown', restartGame, { once: true });
    };

    

    
})(window);