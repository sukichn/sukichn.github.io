class Scene3 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene3' });
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
    }

    create() {
        document.getElementById('level').style.display = 'block';
        document.getElementById('timer').style.display = 'block';
        document.getElementById('countdown').style.display = 'block';
        document.getElementById('total-time').style.display = 'block';
        document.getElementById('health').style.display = 'block';
        document.getElementById('attacks').style.display = 'block';
        document.getElementById('coins-earned').style.display = 'block';
        document.getElementById('mushrooms-earned').style.display = 'block';

        console.log('Creating scene...');
        // Set the current scene instance
        gameState.scene = this;

        // Display level
        document.getElementById('level').innerText = `Level 3`;

        // Clear game alerts
        document.getElementById('game-alert').innerText = "";

        // Initialize coin counter
        document.getElementById('coins-earned').innerText = `Butterflies: ${gameState.coinsCollected}`;

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
        
        // Ensure sunflower is placed correctly
        gameState.sunflower.setPosition(-500, 50); // Adjust the x and y coordinates as needed
        
        gameState.active = true;

        // Create platform assets
        gameState.platforms = this.physics.add.staticGroup();
        const platPositions = [
            { x: 100, y: 575 },  // Platform 1 starting
            { x: 500, y: 575 },  // Platform 2 starting
            { x: 900, y: 575 },  // Platform 3 starting
            { x: 900, y: 875 },  // Platform below 3
            { x: 1150, y: 680 }, // Platform 4
            { x: 1300, y: 390 },  // Exit platform
        ];
        platPositions.forEach(plat => {
            gameState.platforms.create(plat.x, plat.y, 'platform');
        });
        console.log('Platforms created.');

        // Create player assets
        gameState.player = this.physics.add.sprite(140, 100, 'codey').setScale(.7);
        this.physics.add.collider(gameState.player, gameState.platforms);
        console.log('Player created.');

        // Create player animations
        createCodeyAnimations(this);

        // Create a group for the enemies
        gameState.enemies = this.physics.add.group();

        // Create snowmen on different platforms and add them to the enemies group
        createSnowmanAnimations(this);
        gameState.enemy1 = this.addSnowman(580, 300, 400); // Snowman on Platform 1 with movement
        gameState.enemies.add(gameState.enemy1);
        gameState.enemy2 = this.addSnowman(850, 550, 950); // Snowman on Platform 7 with movement
        gameState.enemies.add(gameState.enemy2);
        console.log('Snowmen created.');

        // Add enemy3 on the platform located at { x: 1150, y: 680 }
        gameState.enemy3 = this.addSnowman(1100, 350, 1200); // Snowman on Platform { x: 1150, y: 680 } with movement
        gameState.enemies.add(gameState.enemy3);

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
            shootDown: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
            nextScene: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N), // Add the 'N' key for next scene
            previousScene: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B) // Add the 'B' key for previous scene
        };

        // Create exit assets
        gameState.exit = this.physics.add.sprite(1350, 130, 'exit');
        setupExitLogic(this, gameState);
        console.log('Exit created.');

        // Define moonstone positions
        const moonstonePositions = [
            { x: 900, y: 800 }, // moonstone on Platform below Platform 3
        ];

        // Create and animate moonstones
        createAndAnimatemoonstones(this, gameState, moonstonePositions);
        console.log('moonstones created and animated.');

        // Add overlap detection between player and each moonstone
        this.physics.add.overlap(gameState.player, gameState.moonstones, (player, moonstone) => {
            moonstone.destroy();
            gameState.attacks += 3; // Increase attacks by 3
            document.getElementById('attacks').innerText = `Attacks: ${gameState.attacks}`;

            // Display the game alert message if needed
            const gameAlert = document.getElementById('game-alert');
            gameAlert.innerText = "Attacks increased!";
            gameAlert.classList.add('show');

            // Hide the alert after 2 seconds if needed
            setTimeout(() => {
                gameAlert.classList.remove('show');
            }, 2000);
        }, null, this);
        console.log('Overlap detection for moonstones added.');

        // Define coin positions
        const coinPositions = [
            { x: 300, y: 400 }, // Coin on between platform 1 and 2
            { x: 700, y: 400 },
            { x: 1100, y: 200 },
        ];

        // Create and animate coins
        createCoinAnimations(this);
        createAndAnimateCoins(this, gameState, coinPositions);
        console.log('Coins created and animated.');

        // Add overlap detection between player and each coin
        this.physics.add.overlap(gameState.player, gameState.coins, (player, coin) => {
            coin.destroy();
            gameState.coinsCollected += 2;
            document.getElementById('coins-earned').innerText = `Butterflies: ${gameState.coinsCollected}`;
        }, null, this);
        console.log('Overlap detection for coins added.');

        // Setup camera and input
        setupCameraForScene3(this, gameState);
        setupInput(this, gameState);
        console.log('Camera and input setup.');

        // Setup joystick input
        setupJoystick(this, gameState);
        console.log('Joystick setup.');

        // Setup shooter button
        setupShooterButton(this, gameState);

        // Initialize and start the countdown timer
        window.timeUtils.startCountdown(this, 1 * 60 * 1000, gameState); // 60 secs in milliseconds

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
        if (gameState.enemy3.move) gameState.enemy3.move.stop();

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

            // Start Scene 4 and stop Scene 3
            this.scene.start('Scene4'); // Make sure 'Scene4' is properly defined in your game
            this.scene.stop('Scene3');
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

            // Update background assets continuously
            updateBackgroundAssets(gameState);

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

            // Check for the 'N' key press to move to the next scene
            if (gameState.keys.nextScene.isDown) {
                this.scene.start('Scene4'); // Make sure 'Scene4' is properly defined
                this.scene.stop('Scene3');
            }

            // Check for the 'B' key press to go back to the previous scene
            if (gameState.keys.previousScene.isDown) {
                this.scene.start('Scene2'); // Make sure 'Scene2' is properly defined
                this.scene.stop('Scene3');
            }
        }
    }
}

// Define the setupCamera function for Scene3 outside the class
function setupCameraForScene3(scene, gameState) {
    scene.cameras.main.startFollow(gameState.player, true, 0.2, 0.2);
}