(function(global) {
    global.handleGameOver = function(scene, gameState) {
        const gameAlert = document.getElementById('game-alert');
        gameAlert.innerText = 'Game over!\n Click to play again';
        void gameAlert.offsetWidth; // Trigger reflow to restart the animation
        gameAlert.classList.add('show');
    
        scene.physics.pause();
        gameState.active = false;
        scene.anims.pauseAll();
    
        // Stop movements of all enemies
        if (Array.isArray(gameState.enemies)) {
            gameState.enemies.children.iterate(enemy => {
                if (enemy.move) enemy.move.stop();
            });
        }
    
        // Pause all tweens
        scene.tweens.pauseAll();
    
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
    
        // Create a transparent overlay that covers the entire screen
        const overlay = scene.add.graphics();
        overlay.fillStyle(0x000000, 0); // Transparent fill
        overlay.fillRect(0, 0, scene.sys.canvas.width, scene.sys.canvas.height);
        overlay.setInteractive(new Phaser.Geom.Rectangle(0, 0, scene.sys.canvas.width, scene.sys.canvas.height), Phaser.Geom.Rectangle.Contains);

        // Bring the overlay to the top
        overlay.setDepth(100);
        
        const restartGame = () => {
            gameAlert.classList.remove('show');
            scene.anims.resumeAll();
            scene.tweens.resumeAll();
            gameState.leftPressed = false;
            gameState.rightPressed = false;
            gameState.upPressed = false;
            gameState.health = 3; // Reset health
            document.getElementById('health').innerText = `Health: ${gameState.health}`;
            /*gameState.coinsCollected = 0;*/ // Reset coins to zero
            /*const coinsElement = document.getElementById('coins-earned');
            coinsElement.innerText = `Butterflies: ${gameState.coinsCollected}`;
            coinsElement.style.color = "red";*/ // Change color to red
    
            // Set timeout to change the color back to its original color after 1 second
            /*setTimeout(() => {
                coinsElement.style.color = ""; // Change color back to original
            }, 400);*/ // 400 milliseconds
    
            // Reset flying ability
            gameState.canFly = false;
    
            scene.scene.restart();

            // Reset the flag
            gameState.reachedExit = false;
        };

        // Re-enable inputs and handle restart after a delay or on next click
        setTimeout(() => {
            scene.input.enabled = true;

            overlay.on('pointerup', restartGame);
            scene.input.keyboard.on('keydown', restartGame);
        }, 500); // 500 milliseconds delay to ensure the alert is visible before re-enabling inputs
    
        // Update total elapsed time
        gameState.elapsedTime = gameState.totalElapsedTime;
    };
})(window);