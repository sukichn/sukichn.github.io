(function(global) {
    // Setup input for pointer and cursor logic
    global.setupInput = function(scene, gameState) {
        // Setup cursor keys for player movement
        gameState.cursors = scene.input.keyboard.createCursorKeys();
    };

    // Setup joystick input and dot
    global.setupJoystick = function(scene, gameState) {
        const joystickButton = document.getElementById('joystick');
        let joystickDot = document.getElementById('joystick-dot');

        if (!joystickDot) {
            joystickDot = document.createElement('div');
            joystickDot.id = 'joystick-dot';
            joystickDot.style.width = '65px';  // Diameter is 50px
            joystickDot.style.height = '65px'; // Diameter is 50px
            joystickDot.style.backgroundColor = 'rgba(63, 63, 255, 0.447)';
            joystickDot.style.borderRadius = '50%';
            joystickDot.style.border = '2px solid white';
            joystickDot.style.position = 'absolute';
            joystickButton.appendChild(joystickDot);
        } else {
            // Reset the style in case it was modified
            joystickDot.style.backgroundColor = 'rgba(63, 63, 255, 0.447)';
        }

        const joystickDotRadius = 32.5; // Half of the dot's diameter
        let pointerPressed = false;

        const centerJoystickDot = () => {
            const rect = joystickButton.getBoundingClientRect();
            const centerX = (rect.width / 2) - joystickDotRadius;
            const centerY = (rect.height / 2) - joystickDotRadius;
            joystickDot.style.left = `${centerX}px`;
            joystickDot.style.top = `${centerY}px`;
        };

        // Center the dot initially
        centerJoystickDot();

        const stopMovement = () => {
            pointerPressed = false;
            gameState.joystick.isMoving = false;
            gameState.joystick.direction = null;
            gameState.player.setVelocityX(0); // Stop horizontal movement
            gameState.player.anims.play('idle', true); // Play idle animation
            // Reset the dot to the center
            centerJoystickDot();
        };

        joystickButton.addEventListener('pointerdown', (event) => {
            pointerPressed = true;
            updateJoystickDotPosition(event);
            calculateContactArea(event);
        });

        document.addEventListener('pointermove', (event) => {
            if (pointerPressed) {
                updateJoystickDotPosition(event);
            }
        });

        const updateJoystickDotPosition = (event) => {
            const rect = joystickButton.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;

            // Ensure the dot stays within the bounds of the joystick area
            x = Math.max(joystickDotRadius, Math.min(x, rect.width - joystickDotRadius));
            y = Math.max(joystickDotRadius, Math.min(y, rect.height - joystickDotRadius));

            joystickDot.style.left = `${x - joystickDotRadius}px`;
            joystickDot.style.top = `${y - joystickDotRadius}px`;

            // Determine direction based on the pointer position
            const thirdHeight = rect.height / 3;
            const thirdWidth = rect.width / 3;

            if (y < thirdHeight) { // Upper third
                gameState.joystick.isMoving = true;
                if (x < thirdWidth) {
                    gameState.joystick.direction = 'upLeft';
                } else if (x > 2 * thirdWidth) {
                    gameState.joystick.direction = 'upRight';
                } else {
                    gameState.joystick.direction = 'up';
                }
            } else if (y < 2 * thirdHeight) { // Middle third
                if (x < thirdWidth) {
                    gameState.joystick.isMoving = true;
                    gameState.joystick.direction = 'left';
                } else if (x > 2 * thirdWidth) {
                    gameState.joystick.isMoving = true;
                    gameState.joystick.direction = 'right';
                } else {
                    gameState.joystick.isMoving = false;
                    gameState.joystick.direction = null;
                }
            } else { // Lower third
                if (x < thirdWidth) {
                    gameState.joystick.isMoving = true;
                    gameState.joystick.direction = 'left';
                } else if (x > 2 * thirdWidth) {
                    gameState.joystick.isMoving = true;
                    gameState.joystick.direction = 'right';
                } else {
                    gameState.joystick.isMoving = false;
                    gameState.joystick.direction = null;
                }
            }
        };

        document.addEventListener('pointerup', stopMovement);
        document.addEventListener('pointercancel', stopMovement);

        const calculateContactArea = (event) => {
            let width = event.width || 0;
            let height = event.height || 0;

            // Set pointer width and height
            width = Math.max(width, 40);
            height = Math.max(height, 40);

            const area = width * height;
            console.log('Area:', area, 'Width:', width, 'Height:', height);
        };
    };

    // Handle player movement
    global.handlePlayerMovement = function(scene, gameState) {
        let isMoving = false;

        if (gameState.cursors.left.isDown || gameState.joystick.direction === 'left' || gameState.joystick.direction === 'upLeft') {
            gameState.player.setVelocityX(-360);
            gameState.player.anims.play('run', true);
            gameState.player.flipX = true;
            isMoving = true;
        } else if (gameState.cursors.right.isDown || gameState.joystick.direction === 'right' || gameState.joystick.direction === 'upRight') {
            gameState.player.setVelocityX(360);
            gameState.player.anims.play('run', true);
            gameState.player.flipX = false;
            isMoving = true;
        } else {
            gameState.player.setVelocityX(0);
            gameState.player.anims.play('idle', true);
        }

        if ((gameState.cursors.up.isDown || (gameState.joystick.isMoving && (gameState.joystick.direction === 'up' || gameState.joystick.direction === 'upLeft' || gameState.joystick.direction === 'upRight'))) && gameState.player.body.touching.down) {
            gameState.player.setVelocityY(-800);
            isMoving = true;
        }

        return isMoving;
    };
/*
// Repellent shooting logic
global.shootRepellent = function(scene, direction, player, repellentsGroup, gameState) {
    // Check if gameState.attacks is greater than 0
    if (gameState.attacks > 0) {
        console.log("Attacks left before shooting: " + gameState.attacks);

        const repellent = repellentsGroup.create(player.x, player.y, 'repellent');
        repellent.body.allowGravity = false; // Disable gravity for the repellent

        switch (direction) {
            case 'left':
                repellent.setVelocity(-800, 0); // Shoot left
                break;
            case 'right':
                repellent.setVelocity(800, 0); // Shoot right
                break;
            case 'up':
                const xVelocityUp = player.body.velocity.x * 0.5; // Add a fraction of the player's X velocity
                repellent.setVelocity(xVelocityUp, -800); // Shoot upward
                break;
            case 'down':
                const xVelocityDown = player.body.velocity.x * 0.5; // Add a fraction of the player's X velocity
                repellent.setVelocity(xVelocityDown, 800); // Shoot downward
                break;
        }

        // Decrease the number of attacks
        gameState.attacks--;
        console.log("Repellent shot. Attacks remaining after shooting: " + gameState.attacks);
        
        // Update the inner text of the attacks element
        document.getElementById('attacks').innerText = `Attacks: ${gameState.attacks}`;
    } else {
        // Logic when there are no attacks left
        console.log("No attacks left to shoot repellent.");
    }
};

// Setup shooting button
global.setupShooterButton = function(scene, gameState) {
    const shooterButton = document.getElementById('shooter');

    // Flags to track button press and release state
    gameState.pointerPressed = false;
    gameState.spacePressed = false;

    if (shooterButton) {
        shooterButton.addEventListener('pointerdown', () => {
            console.log('Shooter button pressed');
            gameState.pointerPressed = true;
        });

        shooterButton.addEventListener('pointerup', () => {
            console.log('Shooter button released');
            if (gameState.pointerPressed) {
                const direction = gameState.player.flipX ? 'left' : 'right';
                shootRepellent(scene, direction, gameState.player, gameState.repellent, gameState);
                gameState.pointerPressed = false; // Reset the flag
            }
        });
    }

    scene.input.keyboard.on('keydown-SPACE', () => {
        console.log('Spacebar pressed');
        gameState.spacePressed = true;
    });

    scene.input.keyboard.on('keyup-SPACE', () => {
        console.log('Spacebar released');
        if (gameState.spacePressed) {
            const direction = gameState.player.flipX ? 'left' : 'right';
            shootRepellent(scene, direction, gameState.player, gameState.repellent, gameState);
            gameState.spacePressed = false; // Reset the flag
        }
    });
};*/

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