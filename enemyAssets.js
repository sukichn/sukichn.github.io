(function(global) {
// Load snowman spritesheet
global.loadSnowmanAssets = function(scene) {
    scene.load.spritesheet('snowman', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/snowman.png', {
        frameWidth: 50,
        frameHeight: 70
    });
};

// Create snowman animations
global.createSnowmanAnimations = function(scene) {
    scene.anims.create({
        key: 'snowmanAlert',
        frames: scene.anims.generateFrameNumbers('snowman', { start: 0, end: 6 }),
        frameRate: 4,
        repeat: -1
    });
};

    // Handle player-snowman overlap
    global.handlePlayerSnowmanOverlap = function(scene, gameState, snowman) {
        scene.physics.add.overlap(gameState.player, snowman, () => {
            const currentTime = scene.time.now;

            // Check if enough time has passed since the last damage
            if (currentTime - gameState.lastDamageTime > 1000) { // 1000 ms = 1 second
                if (typeof gameState.health !== 'number') {
                    gameState.health = 3; // Ensure health is a number
                }
                gameState.health -= 1;
                document.getElementById('health').innerText = `Health: ${gameState.health}`;

                if (gameState.health <= 0) {
                    global.handleGameOver(scene, gameState);
                } else {
                    gameState.player.setTint(0xff0000);

                    // Reset the tint after 500 milliseconds
                    scene.time.delayedCall(500, () => {
                        gameState.player.clearTint();
                    });
                }

                // Update last damage time
                gameState.lastDamageTime = currentTime;
            }
        });
    };

})(window);