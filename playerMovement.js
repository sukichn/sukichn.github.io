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
        let velocityX = 300; // Default velocity for keyboard

        // Decrease velocity if the SHIFT key is down
        if (gameState.shiftKey.isDown) {
            velocityX *= 1.5; // Decrease velocity by 50%
        }

        // Handle keyboard input
        if (gameState.cursors.left.isDown) {
            gameState.player.setVelocityX(-velocityX);
            gameState.player.anims.play('run', true);
            gameState.player.flipX = true;
            isMoving = true;
        } else if (gameState.cursors.right.isDown) {
            gameState.player.setVelocityX(velocityX);
            gameState.player.anims.play('run', true);
            gameState.player.flipX = false;
            isMoving = true;
        } else if (!gameState.joystick.isMoving) { // Ensure idle animation if joystick is not moving
            gameState.player.setVelocityX(0);
           gameState.player.anims.play('idle', true);
        }

        // Handle joystick input separately with fixed velocity
        if (gameState.joystick.isMoving) {
            if (gameState.joystick.direction === 'left' || gameState.joystick.direction === 'upLeft' || gameState.joystick.direction === 'downLeft') {
                gameState.player.setVelocityX(-360);
                gameState.player.anims.play('run', true);
                gameState.player.flipX = true;
                isMoving = true;
            } else if (gameState.joystick.direction === 'right' || gameState.joystick.direction === 'upRight' || gameState.joystick.direction === 'downRight') {
                gameState.player.setVelocityX(360);
                gameState.player.anims.play('run', true);
                gameState.player.flipX = false;
                isMoving = true;
            }
        }

        if ((gameState.cursors.up.isDown || (gameState.joystick.isMoving && (gameState.joystick.direction === 'up' || gameState.joystick.direction === 'upLeft' || gameState.joystick.direction === 'upRight'))) && gameState.player.body.touching.down) {
            gameState.player.setVelocityY(-800);
            isMoving = true;
        }

        if (gameState.cursors.down.isDown || gameState.joystick.direction === 'down' || gameState.joystick.direction === 'downLeft' || gameState.joystick.direction === 'downRight') {
            gameState.player.setVelocityY(360);
            isMoving = true;
        }

        return isMoving;
    };
})(window);