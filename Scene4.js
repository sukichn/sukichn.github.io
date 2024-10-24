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
        loadPotionAssets(this);  
        loadAttackAssets(this);  

        this.load.spritesheet('exit', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/cave_exit.png', {
            frameWidth: 60,
            frameHeight: 70
        });
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
        document.getElementById('level').innerText = `Level 4`;

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
        gameState.active = true;

        // Ensure sunflower is placed correctly
        gameState.sunflower.setPosition(-500, 50); // Adjust the x and y coordinates as needed

        // Create platform assets
        gameState.platforms = this.physics.add.staticGroup();
        const platPositions = [
            { x: 100, y: 575 },  // Platform 1 starting
            { x: 600, y: 675 },  // Platform 2 starting
            /*{ x: 900, y: 575 },  // Platform 3 starting*/
            /*{ x: 900, y: 875 },  // Platform below 3*/
            /*{ x: 1150, y: 680 }, // Platform 4*/
            { x: 1600, y: 375 },  // Exit platform
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
        gameState.enemy1 = this.addSnowman(565, 300, 685); // Snowman on Platform 1 with movement
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
        gameState.exit = this.physics.add.sprite(1650, 130, 'exit');
        this.physics.add.collider(gameState.exit, gameState.platforms);

        this.physics.add.overlap(gameState.player, gameState.exit, () => {
            const gameAlert = document.getElementById('game-alert');
            gameAlert.innerText = 'You reached the exit!\n Click to move on';
            gameAlert.classList.add('show');
        
            // Force a reflow to ensure the alert is displayed
            void gameAlert.offsetWidth;
        
            this.physics.pause();
            this.anims.pauseAll();
            this.tweens.pauseAll();
            gameState.active = false;
        
            // Stop the timer event
            if (gameState.timerEvent) {
                gameState.timerEvent.remove();
            }
        
            // Update total elapsed time
            gameState.elapsedTime = gameState.totalElapsedTime;
        
            // Set a flag to indicate the player has reached the exit
            gameState.reachedExit = true;
        
            // Disable all pointer inputs
            this.input.enabled = false;
        
            // Create a transparent overlay that covers the entire screen
            const overlay = this.add.graphics();
            overlay.fillStyle(0x000000, 0); // Transparent fill
            overlay.fillRect(0, 0, this.sys.canvas.width, this.sys.canvas.height);
            overlay.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.sys.canvas.width, this.sys.canvas.height), Phaser.Geom.Rectangle.Contains);
        
            // Bring the overlay to the top
            overlay.setDepth(100);
        
            // Re-enable inputs and handle transition after a delay or on next click
            setTimeout(() => {
                this.input.enabled = true;
        
                overlay.once('pointerup', moveToNextScene);
                this.input.keyboard.once('keydown', moveToNextScene);
            }, 500); // 500ms delay to ensure the alert is visible before re-enabling inputs
        });
        
        const moveToNextScene = () => {
            if (gameState.reachedExit) {
                const gameAlert = document.getElementById('game-alert');
                gameAlert.classList.remove('show');
        
                // Resume animations, tweens, and physics before starting the next scene
                this.physics.resume();
                this.anims.resumeAll();
                this.tweens.resumeAll();
                gameState.active = true;
        
                // Clear user inputs
                gameState.leftPressed = false;
                gameState.rightPressed = false;
                gameState.upPressed = false;
        
                // Start next scene
                this.scene.start('Scene5');
                this.scene.stop('Scene4');
        
                // Reset the flag
                gameState.reachedExit = false;
            }
        };
        
        console.log('Exit created.');

        // Define potion positions
        const potionPositions = [
            /*{ x: 400, y: 625 }, // Potion on Platform 1*/
            { x: 1600, y: 230 } // Potion on Platform 5
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
            { x: 550, y: 575 },
            { x: 1000, y: 300 }, // Moonstone on Platform below Platform 3
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
                if (!gameState.reachedExit) {
                    gameAlert.classList.remove('show');
                }
            }, 2000);
        }, null, this);
        console.log('Overlap detection for moonstones added.');

        // Define mushroom positions
        const mushroomPositions = [
            { x: 400, y: 500 },
            { x: 900, y: 400 }, // Mushroom on Platform below Platform 3
        ];

        // Create and animate mushrooms
        createAndAnimateMushrooms(this, gameState, mushroomPositions);
        console.log('Mushrooms created and animated.');

        // Variable to track the remaining flight time
        gameState.remainingFlightTime = 0;

        // Function to handle flight time and display alerts
        const manageFlightTime = () => {
            if (gameState.remainingFlightTime > 0) {
                const interval = Math.min(1000, gameState.remainingFlightTime);
                gameState.remainingFlightTime -= interval;

                this.time.delayedCall(interval, () => {
                    if (gameState.remainingFlightTime <= 3000 && gameState.remainingFlightTime > 0) {
                        // Display the game alert message if needed
                        const gameAlert = document.getElementById('game-alert');
                        gameAlert.innerText = `You have ${Math.ceil(gameState.remainingFlightTime / 1000)} seconds of flight left!`;
                        gameAlert.classList.add('show');

                        // Hide the alert after 1 second
                        setTimeout(() => {
                            if (!gameState.reachedExit) {
                                gameAlert.classList.remove('show');
                            }
                        }, 1000);
                    }

                    if (gameState.remainingFlightTime <= 0) {
                        gameState.canFly = false; // Disable flying
                    } else {
                        // Continue managing the flight time
                        manageFlightTime();
                    }
                });
            } else {
                gameState.canFly = false; // Disable flying
            }
        };

        // Add overlap detection between player and each mushroom
        this.physics.add.overlap(gameState.player, gameState.mushrooms, (player, mushroom) => {
            mushroom.destroy();

            // Add 10000 ms to the remaining flight time
            gameState.remainingFlightTime += 10000;

            // Set flying state and tint
            gameState.canFly = true;

            // Start managing the flight time
            if (gameState.remainingFlightTime === 10000) {
                manageFlightTime();
            }

            // Display the game alert message if needed
            const gameAlert = document.getElementById('game-alert');
            gameAlert.innerText = "Hooray! You can fly for 10 seconds!";
            gameAlert.classList.add('show');

            // Hide the alert after 2 seconds if needed
            setTimeout(() => {
                if (!gameState.reachedExit) {
                    gameAlert.classList.remove('show');
                }
            }, 2000);
        }, null, this);

        console.log('Overlap detection for mushrooms added.');

        // Define coin positions
        const coinPositions = [
            { x: 200, y: 500 },
            { x: 300, y: 400 }, // Coin on between platform 1 and 2
            { x: 750, y: 500 },
            { x: 1100, y: 200 },
            { x: 1200, y: 300 },
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
        setupCameraForScene4(this, gameState);
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
                this.scene.start('Scene5'); // Make sure 'Scene4' is properly defined
                this.scene.stop('Scene4');
            }

            // Check for the 'B' key press to go back to the previous scene
            if (gameState.keys.previousScene.isDown) {
                this.scene.start('Scene3'); // Make sure 'Scene2' is properly defined
                this.scene.stop('Scene4');
            }

            // Handle flying behavior
            if (gameState.canFly) {
                gameState.player.body.allowGravity = false;
                if (gameState.cursors.up.isDown || (gameState.joystick.isMoving && (gameState.joystick.direction === 'up' || gameState.joystick.direction === 'upLeft' || gameState.joystick.direction === 'upRight'))) {
                    gameState.player.setVelocityY(-360);
                } else if (gameState.cursors.down.isDown || (gameState.joystick.isMoving && (gameState.joystick.direction === 'down' || gameState.joystick.direction === 'downLeft' || gameState.joystick.direction === 'downRight'))) {
                    gameState.player.setVelocityY(360);
                } else {
                    gameState.player.setVelocityY(0); // Stop vertical movement when no key is pressed
                }
            } else {
                gameState.player.body.allowGravity = true;
            }
        }
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

// Define the setupCamera function for Scene3 outside the class
function setupCameraForScene4(scene, gameState) {
   
        scene.cameras.main.startFollow(gameState.player, true, 0.2, 0.2);
    
}