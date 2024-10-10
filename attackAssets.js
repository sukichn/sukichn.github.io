(function(global) { 
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