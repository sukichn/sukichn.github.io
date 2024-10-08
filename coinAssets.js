(function(global) {
// Load coin spritesheet
global.loadCoinAssets = function(scene) {
    scene.load.spritesheet('coinSprite', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/coin-sprite.png', {
        frameWidth: 55,
        frameHeight: 51
    });
};

// Create coin animations
global.createCoinAnimations = function(scene) {
    scene.anims.create({
        key: 'coinHere',
        frames: scene.anims.generateFrameNumbers('coinSprite', { start: 0, end: 12 }),
        frameRate: 11,
        repeat: -1
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