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

        // Adjust NPC physics body size
        gameState.npc.body.setSize(400); // Increase width and height
        // Optionally adjust the offset if needed
        // gameState.npc.body.setOffset(-50, -50); // Adjust the offset if the NPC is not centered correctly

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
                this.cameras.main.zoomTo(1.1);
                gameState.npc.isAppearing = true;
                gameState.npc.isHidden = false;
                gameState.npc.anims.play('appear', true);
                gameState.npc.once('animationcomplete-appear', () => {
                    gameState.npc.isAppearing = false;
                    gameState.npc.isTalking = true;
                    gameState.npc.anims.play('talk', true);
                });
            } else if (gameState.npc.isTalking) {
                this.cameras.main.zoomTo(1.1);
                gameState.npc.anims.play('talk', true);
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
                        // Reset camera zoom
                        scene.cameras.main.zoomTo(1);
                    });
                }
            } else {
                // Ensure camera zoom is set when overlapping
                if (gameState.npc.isTalking || gameState.npc.isAppearing) {
                    scene.cameras.main.zoomTo(1.1);
                }
            }
        });
    };
})(window);