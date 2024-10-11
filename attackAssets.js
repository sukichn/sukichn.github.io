(function(global) { 
    // Load moonstone assets
    global.loadAttackAssets = function(scene) {
        scene.load.image('moonstone', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/moonstone-small.png');
    };
    
    // Handle player-moonstone overlap
    global.handlePlayerMoonstoneOverlap = function(scene, gameState, moonstone) {
        scene.physics.add.overlap(gameState.player, moonstone, () => {
            gameState.attacks += 3;
            document.getElementById('attacks').innerText = `Attacks: ${gameState.attacks}`;
            moonstone.destroy();
        });
    };

    // Function to create and animate moonstones
 global.createAndAnimatemoonstones = function(scene, gameState, moonstonePositions) {
    gameState.moonstones = scene.physics.add.staticGroup();

    moonstonePositions.forEach(pos => {
        const moonstone = scene.add.sprite(pos.x, pos.y, 'moonstone').setScale(1);

        gameState.moonstones.add(moonstone);


        // Optionally, if you have moonstone animations, you can play them here
        // moonstone.anims.play('moonstoneAnimation', true);
    });}

    
    })(window);