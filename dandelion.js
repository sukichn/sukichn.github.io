(function(global) {
    // Load exit assets
    global.loadDandelionAssets = function(scene) {
        scene.load.spritesheet('dandelion', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/dandelion-sprite.png', {
            frameWidth: 380,
            frameHeight: 205
        });
    };

    // Create exit animations
    global.createDandelionAnimations = function(scene) {
        scene.anims.create({
            key: 'move',
            frames: scene.anims.generateFrameNumbers('dandelion', { start: 0, end: 6 }),
            frameRate: 4,
            repeat: -1
        });
        gameState.dandelion.play('move');
    };

})(window);