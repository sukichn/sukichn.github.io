(function(global) {
   // Setup input for pointer and cursor logic
   global.setupInput = function(scene, gameState) {
    // Setup cursor keys for player movement
    gameState.cursors = scene.input.keyboard.createCursorKeys();
    gameState.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
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
        if (!gameState.isJumping) {
            gameState.player.anims.play('idle', true); // Play idle animation
        }
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
            gameState.joystick.isMoving = true;
            if (x < thirdWidth) {
                gameState.joystick.direction = 'downLeft';
            } else if (x > 2 * thirdWidth) {
                gameState.joystick.direction = 'downRight';
            } else {
                gameState.joystick.direction = 'down';
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
    let velocityX = 360; // Default velocity for keyboard

    // Initial player direction
    if (!gameState.previousDirection) {
        gameState.previousDirection = null;
    }

    // Jumping flag
    if (!gameState.isJumping) {
        gameState.isJumping = false;
    }

    // Decrease velocity if the SHIFT key is down
    if (gameState.shiftKey.isDown) {
        velocityX *= 1; // Decrease velocity by 50%
    }

    // Handle horizontal movement
    if (gameState.cursors.left.isDown) {
        gameState.player.setVelocityX(-velocityX);
        gameState.player.flipX = true;
        isMoving = true;
    } else if (gameState.cursors.right.isDown) {
        gameState.player.setVelocityX(velocityX);
        gameState.player.flipX = false;
        isMoving = true;
    } else if (gameState.joystick.isMoving) {
        if (gameState.joystick.direction === 'left' || gameState.joystick.direction === 'upLeft' || gameState.joystick.direction === 'downLeft') {
            gameState.player.setVelocityX(-360);
            gameState.player.flipX = true;
            isMoving = true;
        } else if (gameState.joystick.direction === 'right' || gameState.joystick.direction === 'upRight' || gameState.joystick.direction === 'downRight') {
            gameState.player.setVelocityX(360);
            gameState.player.flipX = false;
            isMoving = true;
        } else {
            gameState.player.setVelocityX(0);
        }
    } else {
        gameState.player.setVelocityX(0);
    }

    // Handle vertical movement and animations
    if (gameState.player.body.velocity.y < 0) {
        gameState.isJumping = true;
        if (gameState.player.body.velocity.x !== 0) {
            gameState.player.anims.play('movingJump', true);
        } else {
            gameState.player.anims.play('idleJump', true);
        }
    } else if (gameState.player.body.touching.down) {
        gameState.isJumping = false;
        if (isMoving) {
            gameState.player.anims.play('run', true);
        } else {
            gameState.player.anims.play('idle', true);
        }
    }

    // Handle jump initiation
    if ((gameState.cursors.up.isDown || (gameState.joystick.isMoving && (gameState.joystick.direction === 'up' || gameState.joystick.direction === 'upLeft' || gameState.joystick.direction === 'upRight'))) && gameState.player.body.touching.down) {
        gameState.player.setVelocityY(-800);
        gameState.isJumping = true; // Set jumping flag
        if (gameState.player.body.velocity.x !== 0) {
            gameState.player.anims.play('movingJump', true);
        } else {
            gameState.player.anims.play('idleJump', true);
        }
    }

    return isMoving;
};
})(window);