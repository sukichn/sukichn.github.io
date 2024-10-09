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

})(window);