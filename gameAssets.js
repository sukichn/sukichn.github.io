(function(global) {
    // Load coin spritesheet
    global.loadCoinAssets = function(scene) {
        scene.load.spritesheet('coinSprite', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/coin-sprite.png', {
            frameWidth: 55,
            frameHeight: 51
        });
    };

    // Create coin animations
    global.createCoinAnimations = function(scene) {
        scene.anims.create({
            key: 'coinHere',
            frames: scene.anims.generateFrameNumbers('coinSprite', { start: 0, end: 12 }),
            frameRate: 11,
            repeat: -1
        });
    };

    // Create and animate coins
    global.createAndAnimateCoins = function(scene, gameState, coinPositions) {
        gameState.coins = scene.physics.add.staticGroup();

        coinPositions.forEach(pos => {
            const coin = scene.add.sprite(pos.x, pos.y, 'coinSprite').setScale(0.8);
            gameState.coins.add(coin);
            coin.anims.play('coinHere', true); // Play coin animation
        });
    };

    // Load codey spritesheet
    global.loadCodeyAssets = function(scene) {
        scene.load.spritesheet('codey', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/codey_sprite.png', {
            frameWidth: 72,
            frameHeight: 90
        });
    };

    // Create codey animations
    global.createCodeyAnimations = function(scene) {
        scene.anims.create({
            key: 'run',
            frames: scene.anims.generateFrameNumbers('codey', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('codey', { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1
        });
    };

    // Load snowman spritesheet
    global.loadSnowmanAssets = function(scene) {
        scene.load.spritesheet('snowman', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/snowman.png', {
            frameWidth: 50,
            frameHeight: 70
        });
    };

    // Create snowman animations
    global.createSnowmanAnimations = function(scene) {
        scene.anims.create({
            key: 'snowmanAlert',
            frames: scene.anims.generateFrameNumbers('snowman', { start: 0, end: 6 }),
            frameRate: 4,
            repeat: -1
        });
    };

    // Load platform assets
    global.loadPlatformAssets = function(scene) {
        scene.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/platform.png');
    };

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

    // Handle game over logic
    global.handleGameOver = function(scene, gameState) {
        document.getElementById('game-alert').innerText = 'Game over!\n Click to play again';
        scene.physics.pause();
        gameState.active = false;
        scene.anims.pauseAll();
        if (gameState.enemy1.move) gameState.enemy1.move.stop();
        if (gameState.enemy2.move) gameState.enemy2.move.stop();
        gameState.player.setTint(0xff0000);
        document.getElementById('coins-earned').innerText = 'Score: 0';

        // Stop the timer event
        if (gameState.timerEvent) {
            gameState.timerEvent.remove();
        }

        // Remove previous event listeners to avoid multiple triggers
        scene.input.keyboard.off('keydown');
        scene.input.off('pointerup');
        scene.input.off('pointerdown');
        scene.input.off('pointermove');

        // Add new event listeners for restarting the scene
        scene.input.keyboard.on('keydown', () => {
            scene.anims.resumeAll();
            gameState.leftPressed = false;
            gameState.rightPressed = false;
            gameState.upPressed = false;
            scene.scene.restart();
        });

        scene.input.on('pointerup', () => {
            scene.anims.resumeAll();
            gameState.leftPressed = false;
            gameState.rightPressed = false;
            gameState.upPressed = false;
            scene.scene.restart();
        });
    };

    // Handle player reaching the exit
    global.handlePlayerReachesExit = function(scene, gameState) {
        document.getElementById('game-alert').innerText = 'You reached the exit!\n Click to play again';
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

        // Add new event listeners for restarting the scene
        scene.input.on('pointerup', () => {
            scene.anims.resumeAll();
            gameState.leftPressed = false;
            gameState.rightPressed = false;
            gameState.upPressed = false;
            scene.scene.restart();
        });

        scene.input.keyboard.on('keydown', () => {
            scene.anims.resumeAll();
            gameState.leftPressed = false;
            gameState.rightPressed = false;
            gameState.upPressed = false;
            scene.scene.restart();
        });
    };

    // Handle player falling off the platform
    global.handlePlayerFallsOffPlatform = function(scene, gameState) {
        if (gameState.player.y > 1200) {
            global.handleGameOver(scene, gameState);
        }
    };

    // Setup camera to follow the player
    global.setupCamera = function(scene, gameState) {
        scene.cameras.main.startFollow(gameState.player, true);
    };

    // Setup input for pointer and cursor logic
    global.setupInput = function(scene, gameState) {
        // Setup cursor keys for player movement
        gameState.cursors = scene.input.keyboard.createCursorKeys();
    };

    // Setup joystick input and dot
    global.setupJoystick = function(scene, gameState) {
        const joystickButton = document.getElementById('joystick');
        const joystickDot = document.createElement('div');
        joystickDot.id = 'joystick-dot';
        joystickDot.style.width = '40px';
        joystickDot.style.height = '40px';
        joystickDot.style.backgroundColor = 'rgba(63, 63, 255, 0.447)';
        joystickDot.style.borderRadius = '50%';
        joystickDot.style.border = '2px solid white';
        joystickDot.style.position = 'absolute';
        joystickDot.style.display = 'none';
        joystickButton.appendChild(joystickDot);

        const joystickDotRadius = 10; // Half of the dot's diameter
        let pointerPressed = false;

        const stopMovement = () => {
            pointerPressed = false;
            gameState.joystick.isMoving = false;
            gameState.joystick.direction = null;
            gameState.player.setVelocityX(0); // Stop horizontal movement
            gameState.player.anims.play('idle', true); // Play idle animation
            joystickDot.style.display = 'none'; // Hide the dot
        };

        joystickButton.addEventListener('pointerdown', (event) => {
            pointerPressed = true;
            updateJoystickDotPosition(event);
            joystickDot.style.display = 'block'; // Show the dot
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
            gameState.player.setVelocityY(-820);
            isMoving = true;
        }

        return isMoving;
    };

    // Setup exit logic
    global.setupExitLogic = function(scene, gameState) {
        createExitAnimations(scene);
        gameState.exit.anims.play('glow', true);
        scene.physics.add.collider(gameState.exit, gameState.platforms);
        scene.physics.add.overlap(gameState.player, gameState.exit, () => {
            handlePlayerReachesExit(scene, gameState);
        });
    };
})(window);