class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
    }

    preload() {
        // Load common assets
        loadBackgroundAssets(this);
        loadCoinAssets(this);
        loadCodeyAssets(this);
        loadSnowmanAssets(this);
        loadPlatformAssets(this);
        loadExitAssets(this);

        this.load.image('cave', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/cave_background.png');
        this.load.image('leftButton', 'Resources/css/Images/.png'); // Replace with the actual path to your start button image
        this.load.image('upButton', 'Resources/css/Images/.png'); // Replace with the actual path to your start button image
        this.load.image('rightButton', 'Resources/css/Images/.png'); // Replace with the actual path to your start button image
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
            { x: 1050, y: 680 }, // Platform 5
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
        gameState.enemy1 = createSnowman(300, 800, 400); // Snowman on Platform 1 with movement
        gameState.enemy2 = createSnowman(1300, 1005, 1400); // Snowman on Platform 7 with movement

        // Create exit assets
        gameState.exit = this.physics.add.sprite(700, 130, 'exit');
        setupExitLogic(this, gameState);

        // Create coin assets
        gameState.coins = this.physics.add.staticGroup();
        const coinPositions = [
            { x: 500, y: 825 }, // Coin on Platform 2
            { x: 700, y: 825 }, // Coin on Platform 3
            { x: 900, y: 825 }, // Coin on Platform 4
            { x: 1050, y: 630 }, // Coin on Platform 5
            { x: 1300, y: 1025 }, // Coin on Platform 7
            { x: 1500, y: 825 }, // Coin on Platform 8
        ];
        coinPositions.forEach(pos => {
            const coin = this.add.sprite(pos.x, pos.y, 'coin').setScale(0.8);
            gameState.coins.add(coin);
        });
        createCoinAnimations(this);
        gameState.coins.getChildren().forEach(coin => {
            coin.anims.play('coinAlert', true);
        });

        // Add overlap detection between player and each coin
        this.physics.add.overlap(gameState.player, gameState.coins, (player, coin) => {
            coin.destroy();
            gameState.coinsCollected += 5;
            document.getElementById('coins-earned').innerText = `Score: ${gameState.coinsCollected}`;
        }, null, this);

        // Setup camera and input
        setupCamera(this, gameState);
        setupInput(this, gameState);
    }

    update() {
        // Update background assets using the global function
        updateBackgroundAssets(gameState);

        if (gameState.active) {
            // Handle player movement
            handlePlayerMovement(this, gameState);

            // Check if the player has fallen off the page
            handlePlayerFallsOffPlatform(this, gameState);
        }
    }
}
