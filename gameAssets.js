(function(global) {
    // Load coin spritesheet
    global.loadCoinAssets = function(scene) {
        scene.load.spritesheet('coin', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/coin-sprite.png', {
            frameWidth: 55,
            frameHeight: 51
        });
    };

    // Create coin animations
    global.createCoinAnimations = function(scene) {
        scene.anims.create({
            key: 'coinAlert',
            frames: scene.anims.generateFrameNumbers('coin', { start: 0, end: 12 }),
            frameRate: 11,
            repeat: -1
        });
    };

    // Load codey spritesheet
    global.loadCodeyAssets = function(scene) {
        scene.load.spritesheet('codey', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/codey_sprite.png', {
            frameWidth: 72,
            frameHeight: 90
        });
    };

    // Create codey animations
    global.createCodeyAnimations = function(scene) {
        scene.anims.create({
            key: 'run',
            frames: scene.anims.generateFrameNumbers('codey', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('codey', { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1
        });
    };

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

    // Load platform assets
    global.loadPlatformAssets = function(scene) {
        scene.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/platform.png');
    };

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
})(window);