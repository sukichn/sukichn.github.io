class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
        gameState.joystick = { isMoving: false, direction: null };
        gameState.lastDamageTime = 0; // Initialize last damage time
        if (typeof gameState.health !== 'number') {
            gameState.health = 3; // Initialize health if it is not already set
        }
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
        loadPotionAssets(this);  // Load potion assets
    }

    create() {
        console.log('Creating scene...');
        // Set the current scene instance
        gameState.scene = this;

        // Create background assets using the global function
        createBackgroundAssets(this, gameState);
        gameState.active = true;

        // Initialize coin counter
        gameState.coinsCollected = 0;

        // Display initial health (ensure it is initialized)
        document.getElementById('health').innerText = `Health: ${gameState.health}`;

        // Initialize timer
        gameState.startTime = this.time.now; // Correctly initialize startTime
        console.log('Timer initialized:', gameState.startTime);

        // Clear game alerts
        document.getElementById('game-alert').innerText = "";

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

        // Create snowmen on different platforms
        createSnowmanAnimations(this);
        gameState.enemy1 = this.addSnowman(500, 800, 400); // Snowman on Platform 1 with movement
        gameState.enemy2 = this.addSnowman(1300, 800, 1400); // Snowman on Platform 7 with movement
        console.log('Snowmen created.');

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

        // Setup camera and input
        setupCamera(this, gameState);
        setupInput(this, gameState);
        console.log('Camera and input setup.');

        // Setup joystick input
        setupJoystick(this, gameState);
        console.log('Joystick setup.');

        // Setup timer event to update every frame
        gameState.timerEvent = this.time.addEvent({
            delay: 10, // Update every 10 milliseconds
            callback: () => {
                updateTimer(gameState);
            },
            loop: true
        });
        console.log('Timer setup.');
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

        // Stop and store the elapsed time of the timer
        if (gameState.timerEvent) {
            gameState.elapsedTime = this.time.now - gameState.startTime;
            gameState.timerEvent.remove();
        }

        // Store the current time when the game ends
        gameState.endTime = this.time.now;
        console.log('Game ended at:', this.formatTime(gameState.endTime - gameState.startTime));

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

            // Start Scene 2 and stop Scene 1
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

            // Update background assets only if the player is moving
            if (isMoving) {
                updateBackgroundAssets(gameState);
            }

            // Check if the player has fallen off the page
            handlePlayerFallsOffPlatform(this, gameState);
        }
    }

    formatTime(milliseconds) {
        let totalMilliseconds = milliseconds;
        let totalSeconds = Math.floor(totalMilliseconds / 1000);
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        let millis = totalMilliseconds % 1000;

        // Pad the minutes and seconds with leading zeros if needed
        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');
        millis = String(millis).padStart(3, '0');

        return `${minutes}:${seconds}:${millis}`;
    }
}