(function(global) {  
  // Load platform assets
  global.loadPlatformAssets = function(scene) {
    scene.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/platform.png');
};

 // Handle player falling off the platform
 global.handlePlayerFallsOffPlatform = function(scene, gameState) {
    if (gameState.player.y > scene.sys.canvas.height) {
        gameState.active = false;
        gameState.player.setPosition(140, 700); // Reset player position or adjust accordingly
        gameState.health -= 1; // Decrease health
        document.getElementById('health').innerText = `Health: ${gameState.health}`;

        // Reset shooter-related flags
        gameState.spacePressed = false;
        gameState.spaceReleased = true;
        gameState.shootUpPressed = false;
        gameState.shootUpReleased = true;
        gameState.shootDownPressed = false;
        gameState.shootDownReleased = true;
        gameState.attackCooldown = false;

        // Display the game alert message
        const gameAlert = document.getElementById('game-alert');
        gameAlert.innerText = "You fell! Be careful!";
        gameAlert.classList.add('show');

        // Hide the alert after 2 seconds
        setTimeout(() => {
            gameAlert.classList.remove('show');
        }, 2000);

        // Re-enable the game state
        gameState.active = true;

        if (gameState.health <= 0) {
            global.handleGameOver(scene, gameState);
        } else {
            // Store updated health in a global variable
            global.currentHealth = gameState.health;

            // Reset player's position without restarting the entire scene
            gameState.player.setVelocity(0, 0);
            gameState.player.setPosition(140, 100);
        }
    }
};


/*function handlePlayerFallsOffPlatform(scene, gameState) {
    if (gameState.player.y > scene.sys.canvas.height) {
        gameState.active = false;
        gameState.player.setPosition(140, 700); // Reset player position or adjust accordingly
        gameState.health -= 1; // Decrease health
        document.getElementById('health').innerText = `Health: ${gameState.health}`;

        // Reset shooter-related flags
        gameState.spacePressed = false;
        gameState.spaceReleased = true;
        gameState.shootUpPressed = false;
        gameState.shootUpReleased = true;
        gameState.shootDownPressed = false;
        gameState.shootDownReleased = true;
        gameState.attackCooldown = false;

        // Display the game alert message
        const gameAlert = document.getElementById('game-alert');
        gameAlert.innerText = "You fell! Be careful!";
        gameAlert.classList.add('show');

        // Hide the alert after 2 seconds
        setTimeout(() => {
            gameAlert.classList.remove('show');
        }, 2000);

        // Re-enable the game state
        gameState.active = true;

        if (gameState.health <= 0) {
            global.handleGameOver(scene, gameState);
        } else {
            // Store updated health in a global variable
            global.currentHealth = gameState.health;

            // Reset player's position without restarting the entire scene
            gameState.player.setVelocity(0, 0);
            gameState.player.setPosition(140, 100);
        }
    }
}*/
})(window);