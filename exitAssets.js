(function(global) { 
 // Load exit assets
    global.loadExitAssets = function(scene) {
        scene.load.spritesheet('exit', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/cave_exit.png', {
            frameWidth: 60,
            frameHeight: 70
        });
    };

    // Create exit animations
    global.createExitAnimations = function(scene) {
        scene.anims.create({
            key: 'glow',
            frames: scene.anims.generateFrameNumbers('exit', { start: 0, end: 5 }),
            frameRate: 4,
            repeat: -1
        });
    };

        // Setup exit logic
        global.setupExitLogic = function(scene, gameState) {
            global.createExitAnimations(scene);
            gameState.exit.anims.play('glow', true);
            scene.physics.add.collider(gameState.exit, gameState.platforms);
            scene.physics.add.overlap(gameState.player, gameState.exit, () => {
                global.handlePlayerReachesExit(scene, gameState);
            });
        };

        // Handle player reaching the exit
        global.handlePlayerReachesExit = function(scene, gameState) {
            document.getElementById('game-alert').innerText = 'You reached the exit!\n Click to play again';
            gameAlert.classList.add('show');
            scene.physics.pause();
            gameState.active = false;
            scene.anims.pauseAll();
            if (gameState.enemy1.move) gameState.enemy1.move.stop();
            if (gameState.enemy2.move) gameState.enemy2.move.stop();
    
            // Stop the timer event
            if (gameState.timerEvent) {
                gameState.timerEvent.remove();
            }
    
            // Remove previous event listeners to avoid multiple triggers
            scene.input.keyboard.off('keydown');
            scene.input.off('pointerup');
            scene.input.off('pointerdown');
            scene.input.off('pointermove');
    
            const restartGame = () => {
                document.getElementById('game-alert').classList.remove('show');
                
                scene.anims.resumeAll();
                gameState.leftPressed = false;
                gameState.rightPressed = false;
                gameState.upPressed = false;
                scene.scene.restart();
            };
    
            // Add new event listeners for restarting the scene
            scene.input.on('pointerup', restartGame);
            scene.input.keyboard.on('keydown', restartGame);
        };
        
    })(window);