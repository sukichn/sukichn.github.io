(function(global) {
    // Load coin spritesheet
    global.loadCoinAssets = function(scene) {
        scene.load.spritesheet('coin', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/coin-sprite.png', {
            frameWidth: 55,
            frameHeight: 51
        });
    };

    // Create coin animations
    global.createCoinAnimations = function(scene) {
        scene.anims.create({
            key: 'coinAlert',
            frames: scene.anims.generateFrameNumbers('coin', { start: 0, end: 12 }),
            frameRate: 11,
            repeat: -1
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
        gameState.player.setTint(0xff0000);
        document.getElementById('coins-earned').innerText = 'Score: 0';

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

        // Touch input settings for left/right press detection
        scene.input.on('pointerdown', function (pointer) {
            if (pointer.x < scene.scale.width / 2) {
                // Left side of the screen
                gameState.leftPressed = true;
                gameState.rightPressed = false;
            } else {
                // Right side of the screen
                gameState.rightPressed = true;
                gameState.leftPressed = false;
            }
        });

        scene.input.on('pointerup', function () {
            gameState.leftPressed = false;
            gameState.rightPressed = false;
        });

        // Touch input settings for movement detection
        scene.input.on('pointermove', function (pointer) {
            if (pointer.isDown) { // Only process if the pointer is down
                // Horizontal movement handling
                if (pointer.x < scene.scale.width / 2) {
                    // Left side of the screen
                    gameState.leftPressed = true;
                    gameState.rightPressed = false;
                } else {
                    // Right side of the screen
                    gameState.rightPressed = true;
                    gameState.leftPressed = false;
                }

                // Vertical movement handling
                if (pointer.y < scene.scale.height / 2) {
                    // Top half of the screen
                    gameState.upPressed = true;
                } else {
                    // Bottom half of the screen
                    gameState.upPressed = false;
                }
            }
        });

        scene.input.on('pointerup', function () {
            gameState.leftPressed = false;
            gameState.rightPressed = false;
            gameState.upPressed = false;
        });
    };

    // Handle player movement
    global.handlePlayerMovement = function(scene, gameState) {
        let isMoving = false;

        if (gameState.cursors.left.isDown || gameState.leftPressed) {
            gameState.player.setVelocityX(-360);
            gameState.player.anims.play('run', true);
            gameState.player.flipX = true;
            isMoving = true;
        } else if (gameState.cursors.right.isDown || gameState.rightPressed) {
            gameState.player.setVelocityX(360);
            gameState.player.anims.play('run', true);
            gameState.player.flipX = false;
            isMoving = true;
        } else {
            gameState.player.setVelocityX(0);
            gameState.player.anims.play('idle', true);
        }

        if ((gameState.cursors.up.isDown || gameState.upPressed) && gameState.player.body.touching.down) {
            gameState.player.setVelocityY(-800);
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