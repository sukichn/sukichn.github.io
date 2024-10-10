(function(global) {  
  // Load platform assets
  global.loadPlatformAssets = function(scene) {
    scene.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/platform.png');
};

 // Handle player falling off the platform
 global.handlePlayerFallsOffPlatform = function(scene, gameState) {
    if (gameState.player.y > 1200) {
        if (typeof gameState.health !== 'number') {
            gameState.health = 3; // Ensure health is a number
        }
        gameState.health -= 1;
        document.getElementById('health').innerText = `Health: ${gameState.health}`;

        if (gameState.health <= 0) {
            global.handleGameOver(scene, gameState);
        } else {
            // Store updated health in a global variable
            global.currentHealth = gameState.health;

            // Reset player's position without restarting the entire scene
            gameState.player.setVelocity(0, 0);
            gameState.player.setPosition(200, 100);
        }
    }
};
})(window);