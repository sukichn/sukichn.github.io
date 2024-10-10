(function(global) {

     // Load potion assets
 global.loadPotionAssets = function(scene) {
    scene.load.image('potion', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/berry.png');
};

    // Handle player-potion overlap
    global.handlePlayerPotionOverlap = function(scene, gameState, potion) {
        scene.physics.add.overlap(gameState.player, potion, () => {
            gameState.health += 1;
            document.getElementById('health').innerText = `Health: ${gameState.health}`;
            potion.destroy();
        });
    };

// Load moonstone assets
global.loadAttackAssets = function(scene) {
    scene.load.image('moonstone', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/moonstone.png');
};

// Handle player-moonstone overlap
global.handlePlayerMoonstoneOverlap = function(scene, gameState, moonstone) {
    scene.physics.add.overlap(gameState.player, moonstone, () => {
        gameState.attacks += 3;
        document.getElementById('attacks').innerText = `Attacks: ${gameState.attacks}`;
        moonstone.destroy();
    });
};

})(window);