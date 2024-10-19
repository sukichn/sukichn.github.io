(function(global) {
    // Load exit assets
    global.loadDandelionAssets = function(scene) {
        scene.load.spritesheet('dandelion', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/dandelion-sprite.png', {
            frameWidth: 439,
            frameHeight: 236
        });
    };

    // Create exit animations
    global.createDandelionAnimations = function(scene) {
        scene.anims.create({
            key: 'move',
            frames: scene.anims.generateFrameNumbers('dandelion', { start: 0, end: 6 }),
            frameRate: 7,
            repeat: -1
        });
    };

})(window);