class Scene4 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene4' });
        gameState.joystick = { isMoving: false, direction: null };
        gameState.lastDamageTime = 0; // Initialize last damage time
        if (typeof gameState.health !== 'number') {
            gameState.health = 3; // Initialize health if it is not already set
        }
        gameState.elapsedTime = 0; // Initialize elapsed time
        if (typeof gameState.attacks !== 'number') {
            gameState.attacks = 0; // Initialize attacks if it is not already set
        }
        gameState.attackCooldown = false; // Initialize attack cooldown flag
    }

    preload() {
        console.log('Preloading assets...');
        // Load common assets
        loadBackgroundAssets(this);
        loadCoinAssets(this);
        loadCodeyAssets(this);
        loadSnowmanAssets(this);
        loadPlatformAssets(this);
        loadExitAssets(this);
        loadPotionAssets(this);  
        loadAttackAssets(this);  

        // Load the repellent asset
        this.load.image('repellent', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/moonstone.png');
    }

    create() {
        console.log('Creating scene...');
        // Set the current scene instance
        gameState.scene = this;

        // Display level
        document.getElementById('level').innerText = `Level 4`;

        // Clear game alerts
        document.getElementById('game-alert').innerText = "";

        // Initialize coin counter
        
        document.getElementById('coins-earned').innerText = `Score: ${gameState.coinsCollected}`;

        // Display initial health (ensure it is initialized)
        document.getElementById('health').innerText = `Health: ${gameState.health}`;

        // Display total elapsed time from Scene1
        const totalTimeElement = document.getElementById('total-time');
        const initialElapsed = gameState.elapsedTime;
        const initialElapsedMinutes = Math.floor(initialElapsed / 60000);
        const initialElapsedSeconds = Math.floor((initialElapsed % 60000) / 1000);
        const initialElapsedMilliseconds = Math.floor((initialElapsed % 1000) / 10);
        totalTimeElement.innerText = `Total Time: ${initialElapsedMinutes}:${initialElapsedSeconds < 10 ? '0' : ''}${initialElapsedSeconds}:${initialElapsedMilliseconds < 10 ? '0' : ''}${initialElapsedMilliseconds}`;

        // Initialize total elapsed time for this scene
        gameState.totalElapsedTime = initialElapsed;

        // Create background assets using the global function
        createBackgroundAssets(this, gameState);
        gameState.active = true;

        // Create platform assets
        gameState.platforms = this.physics.add.staticGroup();
        const platPositions = [
            { x: 200, y: 875 },  // Platform 1 starting
            { x: 300, y: 875 },  // Platform 1 starting
            { x: 500, y: 875 },  // Platform 2 starting
            { x: 700, y: 875 },  // Platform 3 starting
            { x: 900, y: 875 },  // Platform 4 starting
            { x: 1150, y: 680 }, // Platform 5
            { x: 750, y: 550 },  // Platform 6
            { x: 1300, y: 975 }, // Platform 7
            { x: 1500, y: 875 }  // Platform 8
        ];
        platPositions.forEach(plat => {
            gameState.platforms.create(plat.x, plat.y, 'platform');
        });
        console.log('Platforms created.');

        // Create player assets
        gameState.player = this.physics.add.sprite(200, 700, 'codey').setScale(.7);
        this.physics.add.collider(gameState.player, gameState.platforms);
        console.log('Player created.');

        // Create player animations
        createCodeyAnimations(this);

        // Create a group for the enemies
        gameState.enemies = this.physics.add.group();

        // Create snowmen on different platforms and add them to the enemies group
        createSnowmanAnimations(this);
        gameState.enemy1 = this.addSnowman(500, 800, 400); // Snowman on Platform 1 with movement
        gameState.enemies.add(gameState.enemy1);
        gameState.enemy2 = this.addSnowman(1300, 800, 1400); // Snowman on Platform 7 with movement
        gameState.enemies.add(gameState.enemy2);
        console.log('Snowmen created.');

        // Create a group for the repellents
        gameState.repellent = this.physics.add.group({
            defaultKey: 'repellent',
            maxSize: 10,
            allowGravity: false // Ensure gravity is disabled for the repellent
        });

        // Create cursor keys for input
        gameState.cursors = this.input.keyboard.createCursorKeys();
        
        // Create additional keys for shooting in different directions
        gameState.keys = {
            shootUp: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            shootDown: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
        };

        // Create exit assets
        gameState.exit = this.physics.add.sprite(700, 130, 'exit');
        setupExitLogic(this, gameState);
        console.log('Exit created.');

        // Define coin positions
        const coinPositions = [
            { x: 300, y: 825 }, // Coin on Platform 2
            { x: 700, y: 825 }, // Coin on Platform 3
            { x: 900, y: 825 }, // Coin on Platform 4
            { x: 1150, y: 630 }, // Coin on Platform 5
            { x: 1300, y: 925 }, // Coin on Platform 7
            { x: 1500, y: 825 }  // Coin on Platform 8
        ];

        // Create and animate coins
        createCoinAnimations(this);
        createAndAnimateCoins(this, gameState, coinPositions);
        console.log('Coins created and animated.');

        // Add overlap detection between player and each coin
        this.physics.add.overlap(gameState.player, gameState.coins, (player, coin) => {
            coin.destroy();
            gameState.coinsCollected += 5;
            document.getElementById('coins-earned').innerText = `Score: ${gameState.coinsCollected}`;
        }, null, this);
        console.log('Overlap detection for coins added.');

        // Define potion positions
        const potionPositions = [
            { x: 400, y: 625 }, // Potion on Platform 1
            { x: 1100, y: 230 } // Potion on Platform 5
        ];

        // Create and animate potions
        potionPositions.forEach(pos => {
            const potion = this.physics.add.sprite(pos.x, pos.y, 'potion').setScale(0.1); // Set the scale
            this.physics.add.collider(potion, gameState.platforms);
            handlePlayerPotionOverlap(this, gameState, potion);
        });
        console.log('Potions created and animated.');

        // Define moonstone positions
        const moonstonePositions = [
            { x: 600, y: 625 }, // Moonstone on Platform 1
        ];

        // Create and animate moonstones
        moonstonePositions.forEach(pos => {
            const moonstone = this.physics.add.sprite(pos.x, pos.y, 'moonstone').setScale(0.1); // Set the scale
            this.physics.add.collider(moonstone, gameState.platforms);
            handlePlayerMoonstoneOverlap(this, gameState, moonstone);
        });
        console.log('Moonstones created and animated.');

        // Setup camera and input
        setupCamera(this, gameState);
        setupInput(this, gameState);
        console.log('Camera and input setup.');

        // Setup joystick input
        setupJoystick(this, gameState);
        console.log('Joystick setup.');

        // Setup shooter button
        setupShooterButton(this, gameState);

        // Initialize and start the countdown timer
        window.timeUtils.startCountdown(this, 1 * 60 * 1000, gameState); // 30 secs in milliseconds

        // Add collision detection between repellents and enemies
        this.physics.add.collider(gameState.repellent, gameState.enemies, (enemy, repellent) => {
            enemy.destroy(); // Destroy the enemy
            repellent.destroy(); // Destroy the repellent
        });
    }

    handlePlayerReachesExit() {
        const coinsCollected = gameState.coinsCollected; // Store the current coin count

        document.getElementById('game-alert').innerText = 'You reached the exit!\n Click to move on';
        gameAlert.classList.add('show');
        this.physics.pause();
        gameState.active = false;
        this.anims.pauseAll();
        if (gameState.enemy1.move) gameState.enemy1.move.stop();
        if (gameState.enemy2.move) gameState.enemy2.move.stop();

        // Stop the timer event
        if (gameState.timerEvent) {
            gameState.timerEvent.remove();
        }

        // Update total elapsed time
        gameState.elapsedTime = gameState.totalElapsedTime;

        // Remove previous event listeners to avoid multiple triggers
        this.input.keyboard.off('keydown');
        this.input.off('pointerup');
        this.input.off('pointerdown');
        this.input.off('pointermove');

        const moveToNextScene = () => {
            document.getElementById('game-alert').classList.remove('show');

            // Resume animations and clear user inputs
            this.anims.resumeAll();
            gameState.leftPressed = false;
            gameState.rightPressed = false;
            gameState.upPressed = false;
            gameState.coinsCollected = coinsCollected; // Restore the coin count

            // Start Scene 3 and stop Scene 2
            this.scene.start('Scene5'); // Make sure 'Scene3' is properly defined in your game
            this.scene.stop('Scene4');
        };

        // Add new event listeners for moving to the next scene
        this.input.on('pointerup', moveToNextScene);
        this.input.keyboard.on('keydown', moveToNextScene);
    }

    addSnowman(x, y, moveX) {
        const snowman = this.physics.add.sprite(x, y, 'snowman');
        this.physics.add.collider(snowman, gameState.platforms);
        snowman.anims.play('snowmanAlert', true);

        handlePlayerSnowmanOverlap(this, gameState, snowman);

        if (moveX) {
            let scaleChange = 1;
            function growSnowman() {
                if (scaleChange < 1.2) {
                    scaleChange += 0.3;
                    snowman.setScale(scaleChange);
                    snowman.y -= 15;
                }
            }

            snowman.move = this.tweens.add({
                targets: snowman,
                x: moveX,
                ease: 'Linear',
                duration: 2000,
                repeat: -1,
                yoyo: true,
                onRepeat: growSnowman
            });
        }

        return snowman;
    }

    update() {
        if (gameState.active) {
            // Handle player movement
            const isMoving = handlePlayerMovement(this, gameState);

            // Update background assets only if the player is moving
            if (isMoving) {
                updateBackgroundAssets(gameState);
            }

            // Check if the player has fallen off the page
            handlePlayerFallsOffPlatform(this, gameState);

            // Full press and release mechanism for shooting repellent
            if (gameState.cursors.space.isDown && !gameState.spacePressed) {
                gameState.spacePressed = true;
                gameState.spaceReleased = false;
            }

            if (gameState.cursors.space.isUp && gameState.spacePressed && !gameState.spaceReleased) {
                gameState.spaceReleased = true;
                gameState.spacePressed = false;
                if (!gameState.attackCooldown) {
                    gameState.attackCooldown = true;
                    const direction = gameState.player.flipX ? 'left' : 'right';
                    shootRepellent(this, direction, gameState.player, gameState.repellent, gameState);
                    this.time.delayedCall(200, () => {
                        gameState.attackCooldown = false;
                    });
                }
            }

            // Full press and release mechanism for Z key to shoot upward
            if (gameState.keys.shootUp.isDown && !gameState.shootUpPressed) {
                gameState.shootUpPressed = true;
                gameState.shootUpReleased = false;
            }

            if (gameState.keys.shootUp.isUp && gameState.shootUpPressed && !gameState.shootUpReleased) {
                gameState.shootUpReleased = true;
                gameState.shootUpPressed = false;
                if (!gameState.attackCooldown) {
                    gameState.attackCooldown = true;
                    shootRepellent(this, 'up', gameState.player, gameState.repellent, gameState);
                    this.time.delayedCall(200, () => {
                        gameState.attackCooldown = false;
                    });
                }
            }

            // Full press and release mechanism for X key to shoot downward
            if (gameState.keys.shootDown.isDown && !gameState.shootDownPressed) {
                gameState.shootDownPressed = true;
                gameState.shootDownReleased = false;
            }

            if (gameState.keys.shootDown.isUp && gameState.shootDownPressed && !gameState.shootDownReleased) {
                gameState.shootDownReleased = true;
                gameState.shootDownPressed = false;
                if (!gameState.attackCooldown) {
                    gameState.attackCooldown = true;
                    shootRepellent(this, 'down', gameState.player, gameState.repellent, gameState);
                    this.time.delayedCall(200, () => {
                        gameState.attackCooldown = false;
                    });
                }
            }
        }
    }
}