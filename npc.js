(function(global) {
    // Load spritesheet
    global.loadBugAssets = function(scene) {
        scene.load.spritesheet('bug', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/bug-sprite.png', {
            frameWidth: 257,
            frameHeight: 176,
        });
    };

    // Create bug animations
    global.createBugAnimations = function(scene) {
        scene.anims.create({
            key: 'hidden',
            frames: scene.anims.generateFrameNumbers('bug', { start: 11, end: 13 }),
            frameRate: 3,
            repeat: -1,
            yoyo: true,
        });
        scene.anims.create({
            key: 'appear',
            frames: [
                { key: 'bug', frame: 11 },
                { key: 'bug', frame: 10 },
                { key: 'bug', frame: 9 },
                { key: 'bug', frame: 8 },
                { key: 'bug', frame: 7 },
                { key: 'bug', frame: 6 },
                { key: 'bug', frame: 5 },
                { key: 'bug', frame: 4 },
                { key: 'bug', frame: 3 },
                { key: 'bug', frame: 2 },
                { key: 'bug', frame: 1 },
                { key: 'bug', frame: 0 },
            ],
            frameRate: 7,
            repeat: 0, // Do not repeat
            yoyo: false,
        });
        scene.anims.create({
            key: 'burrow',
            frames: scene.anims.generateFrameNumbers('bug', { start: 0, end: 11 }),
            frameRate: 7,
            repeat: 0, // Do not repeat
        });
        scene.anims.create({
            key: 'talk',
            frames: scene.anims.generateFrameNumbers('bug', { start: 0, end: 4 }),
            frameRate: 4,
            repeat: -1, // Repeat indefinitely
        });

        // Play initial hidden animation
        gameState.npc.anims.play('hidden', true);

        // Adjust physics body size to increase padding
        const padding = 120; // Change this value to increase/decrease padding
        gameState.npc.body.setSize(gameState.npc.width + padding, gameState.npc.height);

        // State flags
        gameState.npc.isAppearing = false;
        gameState.npc.isBurrowing = false;
        gameState.npc.isHidden = true;
        gameState.npc.isTalking = false;

        // Add overlap detection
        scene.physics.add.overlap(gameState.player, gameState.npc, handleOverlap, null, scene);

        // Function to handle overlap
        function handleOverlap() {
            if (gameState.npc.isHidden && !gameState.npc.isAppearing) {
                gameState.npc.isAppearing = true;
                gameState.npc.isHidden = false;
                gameState.npc.anims.play('appear', true);
                gameState.npc.once('animationcomplete-appear', () => {
                    gameState.npc.isAppearing = false;
                    gameState.npc.isTalking = true;
                    gameState.npc.anims.play('talk', true);
                    scene.cameras.main.zoomTo(1.1); // Zoom in when talking
                });
            } else if (gameState.npc.isTalking) {
                gameState.npc.anims.play('talk', true);
                scene.cameras.main.zoomTo(1.1); // Ensure zoom is set if talking
            }
        }

        // Function to check overlap state
        scene.events.on('update', () => {
            if (!scene.physics.overlap(gameState.player, gameState.npc)) {
                if (!gameState.npc.isBurrowing && !gameState.npc.isAppearing && !gameState.npc.isHidden) {
                    gameState.npc.isBurrowing = true;
                    gameState.npc.isTalking = false;
                    gameState.npc.anims.play('burrow', true);
                    gameState.npc.once('animationcomplete-burrow', () => {
                        gameState.npc.isBurrowing = false;
                        gameState.npc.isHidden = true;
                        gameState.npc.anims.play('hidden', true);
                        scene.cameras.main.zoomTo(1); // Reset zoom when not talking
                    });
                }
            }
        });
    };
})(window);