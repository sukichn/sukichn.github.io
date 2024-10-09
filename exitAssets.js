(function(global) {
    // Load exit assets
    global.loadExitAssets = function(scene) {
        scene.load.spritesheet('exit', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/cave_exit.png', {
            frameWidth: 60,
            frameHeight: 70
        });
    };

    // Create exit animations
    global.createExitAnimations = function(scene) {
        scene.anims.create({
            key: 'glow',
            frames: scene.anims.generateFrameNumbers('exit', { start: 0, end: 5 }),
            frameRate: 4,
            repeat: -1
        });
    };

    // Setup exit logic
    global.setupExitLogic = function(scene, gameState) {
        global.createExitAnimations(scene);
        gameState.exit.anims.play('glow', true);
        scene.physics.add.collider(gameState.exit, gameState.platforms);
        scene.physics.add.overlap(gameState.player, gameState.exit, () => {
            scene.handlePlayerReachesExit(); // Call the scene-specific function
        });
    };

})(window);