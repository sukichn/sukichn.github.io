(function(global) {
    // Repellent shooting logic
    global.shootRepellent = function(scene, direction, player, repellentsGroup, gameState) {
        // Check if gameState.attacks is greater than 0 and shooter is enabled
        if (gameState.attacks > 0 && !gameState.shooterDisabled) {
            console.log("Attacks left before shooting: " + gameState.attacks);
    
            const repellent = repellentsGroup.create(player.x, player.y, 'repellent').setScale(.08);
            repellent.body.allowGravity = false; // Disable gravity for the repellent
    
            switch (direction) {
                case 'left':
                    repellent.setVelocity(-850, 0); // Shoot left
                    break;
                case 'right':
                    repellent.setVelocity(850, 0); // Shoot right
                    break;
                case 'up':
                    const xVelocityUp = player.body.velocity.x * 0.5; // Add a fraction of the player's X velocity
                    repellent.setVelocity(xVelocityUp, -850); // Shoot upward
                    break;
                case 'down':
                    const xVelocityDown = player.body.velocity.x * 0.5; // Add a fraction of the player's X velocity
                    repellent.setVelocity(xVelocityDown, 850); // Shoot downward
                    break;
            }
    
            // Decrease the number of attacks
            gameState.attacks--;
            console.log("Repellent shot. Attacks remaining after shooting: " + gameState.attacks);
            
            // Update the inner text of the attacks element
            document.getElementById('attacks').innerText = `Attacks: ${gameState.attacks}`;
        } else if (gameState.shooterDisabled) {
            console.log("Shooter is disabled, cannot shoot repellent.");
        } else {
            // Logic when there are no attacks left
            console.log("No attacks left to shoot repellent.");
        }
    };
    
    // Setup shooting button
    global.setupShooterButton = function(scene, gameState) {
        const leftHalf = document.querySelector('#shooter .left-half');
        const rightHalf = document.querySelector('#shooter .right-half');
    
        // Flags to track button press and release state
        gameState.pointerPressed = false;
        gameState.spacePressed = false;
        gameState.shooterDisabled = false; // Initialize shooter as enabled
    
        if (leftHalf && rightHalf) {
            leftHalf.addEventListener('pointerdown', () => {
                if (!gameState.shooterDisabled) {
                    console.log('Left half of shooter button pressed');
                    gameState.pointerPressed = true;
                    gameState.shootDirection = 'left';
                }
            });
    
            rightHalf.addEventListener('pointerdown', () => {
                if (!gameState.shooterDisabled) {
                    console.log('Right half of shooter button pressed');
                    gameState.pointerPressed = true;
                    gameState.shootDirection = 'right';
                }
            });
    
            document.querySelectorAll('#shooter .left-half, #shooter .right-half').forEach(half => {
                half.addEventListener('pointerup', () => {
                    if (!gameState.shooterDisabled) {
                        console.log('Shooter button released');
                        if (gameState.pointerPressed) {
                            shootRepellent(scene, gameState.shootDirection, gameState.player, gameState.repellent, gameState);
                            gameState.pointerPressed = false; // Reset the flag
                        }
                    }
                });
            });
        }
    
        scene.input.keyboard.on('keydown-SPACE', () => {
            if (!gameState.shooterDisabled) {
                console.log('Spacebar pressed');
                gameState.spacePressed = true;
            }
        });
    
        scene.input.keyboard.on('keyup-SPACE', () => {
            if (!gameState.shooterDisabled) {
                console.log('Spacebar released');
                if (gameState.spacePressed) {
                    const direction = gameState.player.flipX ? 'left' : 'right';
                    shootRepellent(scene, direction, gameState.player, gameState.repellent, gameState);
                    gameState.spacePressed = false; // Reset the flag
                }
            }
        });
    };
    
})(window);

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
            // Disable shooter when player reaches exit
            gameState.shooterDisabled = true;
            console.log("Player reached exit, shooter disabled.");
            scene.handlePlayerReachesExit(); // Call the scene-specific function
        });
    };

})(window);