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
    
        const restartGame = () => {
            gameAlert.classList.remove('show');
            scene.anims.resumeAll();
            scene.tweens.resumeAll();
            gameState.leftPressed = false;
            gameState.rightPressed = false;
            gameState.upPressed = false;
            gameState.health = 3; // Reset health
            document.getElementById('health').innerText = `Health: ${gameState.health}`;
            gameState.coinsCollected = 0; // Reset coins to zero
            const coinsElement = document.getElementById('coins-earned');
            coinsElement.innerText = `Butterflies: ${gameState.coinsCollected}`;
            coinsElement.style.color = "red"; // Change color to red
    
            // Set timeout to change the color back to its original color after 1 second
            setTimeout(() => {
                coinsElement.style.color = ""; // Change color back to original
            }, 400); // 400 milliseconds = 0.4 second
    
            // Reset flying ability
            gameState.canFly = false;
    
            scene.scene.restart();
        };
    
        // Add new event listeners for restarting the scene
        scene.input.keyboard.on('keydown', restartGame);
        scene.input.on('pointerup', restartGame);
    
    
        // Update total elapsed time
        gameState.elapsedTime = gameState.totalElapsedTime;
    };

    

    
})(window);

