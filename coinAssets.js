(function(global) {
// Load coin spritesheet
global.loadCoinAssets = function(scene) {
    scene.load.spritesheet('coinSprite', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/butterfly-sprite.png', {
        frameWidth: 165,
        frameHeight: 109
    });
};

// Create coin animations
global.createCoinAnimations = function(scene) {
    scene.anims.create({
        key: 'coinHere',
        frames: scene.anims.generateFrameNumbers('coinSprite', { start: 0, end: 6 }),
        frameRate: 7,
        repeat: -1,
        yoyo: true,
    });
};

// Create and animate coins
global.createAndAnimateCoins = function(scene, gameState, coinPositions) {
    gameState.coins = scene.physics.add.staticGroup();

    coinPositions.forEach(pos => {
        const coin = scene.add.sprite(pos.x, pos.y, 'coinSprite').setScale(0.8);
        gameState.coins.add(coin);
        coin.anims.play('coinHere', true); // Play coin animation
    });
};
})(window);