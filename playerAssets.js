(function(global) {
       // Load codey spritesheet
    global.loadCodeyAssets = function(scene) {
        scene.load.spritesheet('codey', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/character-sprite.png', {
            frameWidth: 111,
            frameHeight: 170,
        });
    };

    // Create codey animations
    global.createCodeyAnimations = function(scene) {
        scene.anims.create({
            key: 'run',
            frames: scene.anims.generateFrameNumbers('codey', { start: 12, end: 15 }),
            frameRate: 4,
            repeat: -1
        });

        scene.anims.create({
            key: 'idle',
            frames: [
                { key: 'codey', frame: 1 },
                { key: 'codey', frame: 2 },
                { key: 'codey', frame: 1 },
                { key: 'codey', frame: 2 },
                { key: 'codey', frame: 3 },
                { key: 'codey', frame: 4 },
                { key: 'codey', frame: 5 },
                { key: 'codey', frame: 6 },
                { key: 'codey', frame: 7 },
                { key: 'codey', frame: 8 },
                { key: 'codey', frame: 9 },
                { key: 'codey', frame: 10 },
                { key: 'codey', frame: 9 },
                { key: 'codey', frame: 10 }, 
            ],
            frameRate: 4,
            repeat: -1,
            yoyo:true            
        });

        scene.anims.create({
            key: 'movingJump',
            frames: [
                { key: 'codey', frame: 16 },
                { key: 'codey', frame: 17 },
                { key: 'codey', frame: 18 },
                { key: 'codey', frame: 17 },
                { key: 'codey', frame: 18 },
                { key: 'codey', frame: 17 },
                { key: 'codey', frame: 19 },
                { key: 'codey', frame: 19 },
                { key: 'codey', frame: 19 },
                { key: 'codey', frame: 19 },
                { key: 'codey', frame: 20 },
                { key: 'codey', frame: 21 },
                { key: 'codey', frame: 20 },
                { key: 'codey', frame: 15 },
                { key: 'codey', frame: 15 },
            ],
            frameRate: 12,
            repeat: -1, 
     
        });

        scene.anims.create({
            key: 'idleJump',
            frames: [
                { key: 'codey', frame: 15 },
                { key: 'codey', frame: 16 },
                { key: 'codey', frame: 17 },
                { key: 'codey', frame: 18 },
                { key: 'codey', frame: 19 },
                { key: 'codey', frame: 19 },
                { key: 'codey', frame: 19 },
                { key: 'codey', frame: 18 },
            ],
            frameRate: 8,
            repeat: -1, 
     
        });

            
    };

    // Setup camera to follow the player
    global.setupCamera = function(scene, gameState) {
        scene.cameras.main.startFollow(gameState.player, true);
    };

})(window);