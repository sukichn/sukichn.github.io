class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
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

        this.load.image('grassTile', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/grass-tile1.png');
        this.load.image('grassTile2', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/grass-tile2.png');
        this.load.image('longplatform', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/long-platform-green.png');
        this.load.image('shortplatform', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/short-platform-green.png');
        this.load.image('testshortplatform', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/short-platform.png');

        this.load.image('npcSprite', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/moonstone-small.png');
    }

    create() {
        console.log('Creating scene...');
        // Set the current scene instance
        gameState.scene = this;

        // Set world bounds
        this.physics.world.setBounds(0, 0, this.game.config.width, this.sys.canvas.height + 600);

        // Display level
        document.getElementById('level').innerText = `Level 1`;

        // Clear game alerts
        document.getElementById('game-alert').innerText = "";

        // Initialize coin counter
        gameState.coinsCollected = 0;
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

        // Display game alert message
        const gameAlert = document.getElementById('game-alert');

        if (window.innerWidth < 769) {
            gameAlert.innerText = "Use blue joystick to move and jump!";
        } else {
            gameAlert.innerText = "Use arrow keys to move and jump!";
        }
        gameAlert.classList.add('show');

        // Hide the alert after 2 seconds
        setTimeout(() => {
            gameAlert.classList.remove('show');
        }, 2000);

        // Create background assets using the global function
        createBackgroundAssets(this, gameState);
        gameState.active = true;

        // Create grass foreground
        gameState.grassTile = this.physics.add.staticGroup();
        const grassTilePositions = [
            { x: -2200, y: 480 },
            { x: -140, y: 480 },
        ];
        grassTilePositions.forEach(grass => {
            gameState.grassTile.create(grass.x, grass.y, 'grassTile').setDepth(16);
        });

        gameState.grassTile2 = this.physics.add.staticGroup();
        const grassTile2Positions = [
            { x: -1280, y: 480 },
            { x: 1080, y: 480 },
            { x: 2300, y: 480 },
            { x: 3500, y: 480 },
        ];
        grassTile2Positions.forEach(grass => {
            gameState.grassTile2.create(grass.x, grass.y, 'grassTile2').setDepth(15);
        });

        // Ensure sunflower is placed correctly
        gameState.sunflower.setPosition(-550, -150);

        // Create platform assets
        gameState.platforms = this.physics.add.staticGroup();
        const platPositions = [
           /* { x: 200, y: 875 },  // Platform 1 starting
            { x: 300, y: 875 },  // Platform 1 starting
            { x: 500, y: 875 },  // Platform 2 starting
            { x: 700, y: 830 },  // Platform 3 starting
            { x: 900, y: 830 },  // Platform 4 starting*/
        ];
        /*platPositions.forEach(plat => {
            gameState.platforms.create(plat.x, plat.y, 'platform');
        });
        console.log('Platforms created.');*/

        // Create long platform
        gameState.longplatform = this.physics.add.staticGroup();
        const longPlatStartX = -810;
        const longPlatStartY = 820;
        const longPlatOffsets = [
            { x: 0, y: 0 },
            { x: 200, y: 0 }, 
            { x: 2800, y: -28 },           
        ];
        longPlatOffsets.forEach(offset => {
            gameState.longplatform.create(longPlatStartX + offset.x, longPlatStartY + offset.y, 'longplatform');
        });
        console.log('Long Platforms created.');

        // Create short platforms using a loop
        gameState.shortplatform = this.physics.add.staticGroup();
        const shortPlatStartX = -255;
        const shortPlatStartY = 820;
        const shortPlatOffsets = [
            { x: 0, y: 0 },
            { x: 50, y: 0 },
            { x: 100, y: 0 },
            { x: 150, y: 0 },
            { x: 200, y: -4 },
            { x: 250, y: -8 },
            { x: 300, y: -12 },
            { x: 350, y: -16 },
            { x: 400, y: -20 },
            { x: 450, y: -24 },
            { x: 500, y: -28 },
            { x: 550, y: -32 },
            { x: 600, y: -36 },
            { x: 605, y: -40 },
            { x: 615, y: -36 },
            { x: 620, y: -32 },
            { x: 625, y: -28 },
            { x: 630, y: -24 },
            { x: 775, y: -24 },
            { x: 900, y: -20 },
            { x: 950, y: -16 },
            { x: 1000, y: -12 },
            { x: 1050, y: -8 },
            { x: 1100, y: -4 },
            { x: 1105, y: 0 },
            { x: 1195, y: -4 },
            { x: 1245, y: -8 },
            { x: 1295, y: -12 },
            { x: 1350, y: -8 },
            { x: 1450, y: -12 },
            { x: 1595, y: -12 },
            { x: 1650, y: -12 },
            { x: 1652, y: -12 },
            { x: 1654, y: -12 },
            { x: 1660, y: -12 },
            { x: 1670, y: -14 },
            { x: 1675, y: -14 },
            { x: 1680, y: -14 },
            { x: 1685, y: -16 },
            { x: 1690, y: -18 },
            { x: 1695, y: -20 },
            { x: 1700, y: -22 },
            { x: 1705, y: -26 },
            { x: 1710, y: -30 },
            { x: 1715, y: -34 },
            { x: 1720, y: -38 },
            { x: 1725, y: -40 },
            { x: 1730, y: -40 },
            { x: 1735, y: -40 },
            { x: 1740, y: -36 },
            { x: 1750, y: -32 },
            { x: 1760, y: -28 },
            { x: 1770, y: -28 },
            { x: 1790, y: -28 },
            { x: 1850, y: -28 },
        ];
        shortPlatOffsets.forEach(offset => {
            gameState.shortplatform.create(shortPlatStartX + offset.x, shortPlatStartY + offset.y, 'shortplatform');
        });
        console.log('Short Platforms created.');

        // Create player assets
        gameState.player = this.physics.add.sprite(150, 500, 'codey').setScale(1).setDepth(14);
        /*gameState.player.setCollideWorldBounds(true); */ // Enable collision with world bounds
        this.physics.add.collider(gameState.player, gameState.platforms);
        console.log('Player created.');

        // Collider with player and grass platform
        this.physics.add.collider(gameState.player, gameState.longplatform);

        // Collider with player and grass platform
        this.physics.add.collider(gameState.player, gameState.shortplatform);

        // Create player animations
        createCodeyAnimations(this);

        // Create NPC
        gameState.npc = this.physics.add.sprite(950, 500, 'npcSprite');

        // Add a collider between the player and the NPC to trigger the dialogue
        this.physics.add.overlap(gameState.player, gameState.npc, () => {
            if (!this.isDialogueActive && !this.preventDialogue) {
                fetchPage(this, 1); // Start the dialogue with the first page
                showDialogue(this);
                // Zoom the camera in
                this.cameras.main.zoomTo(1.1, 1000); // Adjust the zoom level and duration as needed
            }
        });


        this.physics.add.collider(gameState.npc, gameState.shortplatform);

        // Create a group for the enemies
        gameState.enemies = this.physics.add.group();

        // Create snowmen on different platforms and add them to the enemies group
        createSnowmanAnimations(this);
        gameState.enemy1 = this.addSnowman(1700, 800, 400); // Snowman on Platform 1 with movement
        gameState.enemies.add(gameState.enemy1);
        gameState.enemy2 = this.addSnowman(1700, 800, 1400); // Snowman on Platform 7 with movement
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
            shootDown: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
            nextScene: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N), // Add the 'N' key for next scene
            previousScene: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B) // Add the 'B' key for previous scene
        };

        // Create exit assets
        gameState.exit = this.physics.add.sprite(1780, 130, 'exit');
        setupExitLogic(this, gameState);
        this.physics.add.collider(gameState.exit, gameState.longplatform);
        this.physics.add.collider(gameState.exit, gameState.shortplatform);
        console.log('Exit created.');

        // Define coin positions
        const coinPositions = [
            /*{ x: 300, y: 425 }, // Coin on Platform 2
            { x: 430, y: 325 }, // Coin on Platform 3*/
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
            /*{ x: 400, y: 625 }, // Potion on Platform 1*/
            { x: 1100, y: 230 } // Potion on Platform 5
        ];

        // Create and animate potions
        potionPositions.forEach(pos => {
            const potion = this.physics.add.sprite(pos.x, pos.y, 'potion').setScale(0.1); // Set the scale
            this.physics.add.collider(potion, gameState.platforms);
            this.handlePlayerPotionOverlap(potion);
        });
        console.log('Potions created and animated.');

        // Define moonstone positions
        const moonstonePositions = [
            /*{ x: 600, y: 625 }, // Moonstone on Platform 1*/
        ];

        /* // Create and animate moonstones
        moonstonePositions.forEach(pos => {
            const moonstone = this.physics.add.sprite(pos.x, pos.y, 'moonstone').setScale(1); // Set the scale
            this.physics.add.collider(moonstone, gameState.platforms);
            this.handlePlayerMoonstoneOverlap(moonstone);
        });
        console.log('Moonstones created and animated.');*/

        // Setup camera and input
        setupCameraForScene1(this, gameState);
        setupInput(this, gameState);
        console.log('Camera and input setup.');

        // Setup joystick input
        setupJoystick(this, gameState);
        console.log('Joystick setup.');

        // Setup shooter button
        setupShooterButton(this, gameState);

        // Initialize and start the countdown timer
        window.timeUtils.startCountdown(this, 1 * 120 * 1000, gameState); // 120 secs in milliseconds

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

        // Stop movements of all enemies
        if (Array.isArray(gameState.enemies)) {
            gameState.enemies.children.iterate(enemy => {
                if (enemy.move) enemy.move.stop();
            });
        }

        // Pause all tweens
        this.tweens.pauseAll();

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
            this.tweens.resumeAll();
            gameState.leftPressed = false;
            gameState.rightPressed = false;
            gameState.upPressed = false;
            gameState.coinsCollected = coinsCollected; // Restore the coin count

            // Start Scene 3 and stop Scene 2
            this.scene.start('Scene2'); // Make sure 'Scene2' is properly defined in your game
            this.scene.stop('Scene1');
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
                this.scene.start('Scene2'); // Make sure 'Scene2' is properly defined
                this.scene.stop('Scene1');
            }

            // Check for the 'B' key press to go back to the previous scene
            if (gameState.keys.previousScene.isDown) {
                this.scene.start('StartScene'); // Make sure 'StartScene' is properly defined
                this.scene.stop('Scene1');
            }
        }
    }

    handlePlayerMoonstoneOverlap(moonstone) {
        this.physics.add.overlap(gameState.player, moonstone, () => {
            moonstone.destroy();
            gameState.attacks += 3; // Add 3 attacks
            document.getElementById('attacks').innerText = `Attacks: ${gameState.attacks}`;
        });
    }

    handlePlayerPotionOverlap(potion) {
        this.physics.add.overlap(gameState.player, potion, () => {
            potion.destroy();
            gameState.health += 1; // Increase health
            document.getElementById('health').innerText = `Health: ${gameState.health}`;

            // Display the game alert message if needed
            const gameAlert = document.getElementById('game-alert');
            gameAlert.innerText = "Health increased!";
            gameAlert.classList.add('show');

            // Hide the alert after 2 seconds if needed
            setTimeout(() => {
                gameAlert.classList.remove('show');
            }, 2000);
        });
    }
}

// Define the setupCamera function outside the class
function setupCameraForScene1(scene, gameState) {
    // Set the camera to follow the player on the x-axis only
    scene.cameras.main.startFollow(gameState.player, true, 1, 0);

    // Optionally, you can adjust the follow offset if needed
    scene.cameras.main.setFollowOffset(0, 300);
}