(function(global) {
       // Load codey spritesheet
    global.loadCodeyAssets = function(scene) {
        scene.load.spritesheet('codey', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/character-sprite.png', {
            frameWidth: 111,
            frameHeight: 165,
        });
    };

    // Create codey animations
    global.createCodeyAnimations = function(scene) {
        /*scene.anims.create({
            key: 'run',
            frames: scene.anims.generateFrameNumbers('codey', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });*/

        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('codey', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });
    };

    // Setup camera to follow the player
    global.setupCamera = function(scene, gameState) {
        scene.cameras.main.startFollow(gameState.player, true);
    };

})(window);