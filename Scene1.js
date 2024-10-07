class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
        gameState.joystick = { isMoving: false, direction: null };
    }

    preload() {
        // Load common assets
        loadBackgroundAssets(this);
        loadCoinAssets(this);
        loadCodeyAssets(this);
        loadSnowmanAssets(this);
        loadPlatformAssets(this);
        loadExitAssets(this);
    }

    create() {
        // Create background assets using the global function
        createBackgroundAssets(this, gameState);
        gameState.active = true;

        // Initialize coin counter
        gameState.coinsCollected = 0;

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
            { x: 1300, y: 1075 }, // Platform 7
            { x: 1500, y: 875 },  // Platform 8
        ];
        platPositions.forEach(plat => {
            gameState.platforms.create(plat.x, plat.y, 'platform');
        });

        // Create player assets
        gameState.player = this.physics.add.sprite(200, 700, 'codey').setScale(.7);
        this.physics.add.collider(gameState.player, gameState.platforms);

        // Create player animations
        createCodeyAnimations(this);

        // Create snowman assets
        const createSnowman = (x, y, moveX) => {
            const snowman = this.physics.add.sprite(x, y, 'snowman');
            this.physics.add.collider(snowman, gameState.platforms);
            snowman.anims.play('snowmanAlert', true);

            // Add overlap detection between player and snowman
            this.physics.add.overlap(gameState.player, snowman, () => {
                handleGameOver(this, gameState);
            });

            // Add movement and growSnowman callback for the snowman if moveX is provided
            if (moveX) {
                let scaleChange = 1;
                function growSnowman() {
                    if (scaleChange < 1.5) {
                        scaleChange += .3;
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
        };

        // Create snowmen on different platforms
        createSnowmanAnimations(this);
        gameState.enemy1 = createSnowman(500, 800, 400); // Snowman on Platform 1 with movement
        /*gameState.enemy2 = createSnowman(1300, 1005, 1400); // Snowman on Platform 7 with movement*/

        // Create exit assets
        gameState.exit = this.physics.add.sprite(700, 130, 'exit');
        setupExitLogic(this, gameState);

        // Create and animate coins
        
        createCoinAnimations(this);
        createAndAnimateCoins(this, gameState);

        // Add overlap detection between player and each coin
        this.physics.add.overlap(gameState.player, gameState.coins, (player, coin) => {
            coin.destroy();
            gameState.coinsCollected += 5;
            document.getElementById('coins-earned').innerText = `Score: ${gameState.coinsCollected}`;
        }, null, this);

        // Setup camera and input
        setupCamera(this, gameState);
        setupInput(this, gameState);

        // Setup joystick input
        setupJoystick(this, gameState);
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
}