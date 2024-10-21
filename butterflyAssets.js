(function(global) {
    // Load butterfly spritesheet
    global.loadCoinAssets = function(scene) {
        scene.load.spritesheet('coinSprite', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/butterfly-sprite.png', {
            frameWidth: 165,
            frameHeight: 108
        });
    };
    
    // Create butterfly animations
    global.createCoinAnimations = function(scene) {
        scene.anims.create({
            key: 'butterflyHere',
            frames: scene.anims.generateFrameNumbers('coinSprite', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1,
            yoyo: true,
        });
    };
    
    // Create and animate butterflies
    global.createAndAnimateCoins = function(scene, gameState, coinPositions) {
        gameState.coins = scene.physics.add.staticGroup();
    
        coinPositions.forEach(pos => {
            const butterfly = scene.add.sprite(pos.x, pos.y, 'coinSprite').setScale(0.8);
            gameState.coins.add(butterfly);
            butterfly.anims.play('butterflyHere', true); // Play butterfly animation
        });
    };
})(window);