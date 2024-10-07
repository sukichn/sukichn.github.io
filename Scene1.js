

class Scene1 extends Phaser.Scene {
	constructor() {
		super({ key: 'Scene1' })
	}
  
    
        preload() {
                   // Load common assets
                   loadBackgroundAssets(this);

        this.load.image('cave', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/cave_background.png');
        this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/platform.png');
        this.load.spritesheet('codey', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/codey_sprite.png', { frameWidth: 72, frameHeight: 90 });
        this.load.spritesheet('snowman', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/snowman.png', { frameWidth: 50, frameHeight: 70 });
        this.load.spritesheet('exit', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/cave_exit.png', { frameWidth: 60, frameHeight: 70 });
        this.load.spritesheet('coin', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/coin-sprite.png', { frameWidth: 100, frameHeight: 170});
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
        document.getElementById('game-alert').innerText ="";
        
            // Create platforms and ensure correct positioning
            const platforms = this.physics.add.staticGroup();
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
                platforms.create(plat.x, plat.y, 'platform');
            });
        
            // Create player and ensure it collides with platforms
            gameState.player = this.physics.add.sprite(200, 700, 'codey').setScale(.8);
            this.physics.add.collider(gameState.player, platforms);
        
            // Setup cursor keys for player movement
            gameState.cursors = this.input.keyboard.createCursorKeys();
        
            // Create player animations
            this.anims.create({
                key: 'run',
                frames: this.anims.generateFrameNumbers('codey', { start: 0, end: 3 }),
                frameRate: 5,
                repeat: -1
            });
        
            this.anims.create({
                key: 'idle',
                frames: this.anims.generateFrameNumbers('codey', { start: 4, end: 5 }),
                frameRate: 5,
                repeat: -1
            });
        
            // Function to create and position a snowman
            const createSnowman = (x, y, moveX) => {
                const snowman = this.physics.add.sprite(x, y, 'snowman');
                this.physics.add.collider(snowman, platforms);
                this.anims.create({
                    key: 'snowmanAlert',
                    frames: this.anims.generateFrameNumbers('snowman', { start: 0, end: 7 }),
                    frameRate: 4,
                    repeat: -1
                });
                snowman.anims.play('snowmanAlert', true);
        
                // Add overlap detection between player and snowman
                this.physics.add.overlap(gameState.player, snowman, () => {
                    document.getElementById('game-alert').innerText = 'Game over!\n Click to play again';
                    this.physics.pause();
                    gameState.active = false;
                    this.anims.pauseAll();
                    gameState.player.setTint(0xff0000);
                    document.getElementById('coins-earned').innerText = 'Score: 0';
                    this.input.once('pointerup',  () => {
                        this.scene.restart();
                    });
                    this.input.keyboard.on('keydown',  () => {
                        this.scene.restart();
                    });
                    if (snowman.move) snowman.move.stop(); // Stop the movement of the snowman if it has a move property
                    this.input.on('pointerup', () => {
                        this.anims.resumeAll();
                        this.scene.restart();
                    });
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
            gameState.enemy1 = createSnowman(300, 800, 400); // Snowman on Platform 1 with movement
            gameState.enemy2 = createSnowman(1300, 1005, 1400); // Snowman on Platform 7 with movement
        
            // Position the exit on Platform 5
            gameState.exit = this.physics.add.sprite(700, 130, 'exit');
            this.anims.create({
                key: 'glow',
                frames: this.anims.generateFrameNumbers('exit', { start: 0, end: 5 }),
                frameRate: 4,
                repeat: -1
            });
            gameState.exit.anims.play('glow', true);
        
            this.physics.add.collider(gameState.exit, platforms);
        
            this.physics.add.overlap(gameState.player, gameState.exit, () => {
                document.getElementById('game-alert').innerText = 'You reached the exit!\n Click to play again';
                this.physics.pause();
                gameState.active = false;
                this.anims.pauseAll();
                if (gameState.enemy1.move) gameState.enemy1.move.stop();
                if (gameState.enemy2.move) gameState.enemy2.move.stop();
                this.input.on('pointerup', () => {
                    this.anims.resumeAll();
                    this.scene.restart();
                });
                this.input.keyboard.on('keydown',  () => {
                    this.scene.restart();
                });
            });
        
            // Create a group for coins
            gameState.coins = this.physics.add.staticGroup();
        
            // Positions for coins on platforms
            const coinPositions = [
                
                { x: 500, y: 825 }, // Coin on Platform 2
                { x: 700, y: 825 }, // Coin on Platform 3
                { x: 900, y: 825 }, // Coin on Platform 4
                { x: 1050, y: 630 }, // Coin on Platform 5
                { x: 1300, y: 1025 }, // Coin on Platform 7
                { x: 1500, y: 825 }, // Coin on Platform 8
            ];
        
            // Create and position coins
            coinPositions.forEach(pos => {
                const coin = this.add.sprite(pos.x, pos.y, 'coin').setScale(0.2);
                gameState.coins.add(coin);
            });
        
            this.anims.create({
                key: 'coinAlert',
                frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 1 }),
                frameRate: 4,
                repeat: -1
            });
        
            gameState.coins.getChildren().forEach(coin => {
                coin.anims.play('coinAlert', true);
            });
        
            // Add overlap detection between player and each coin
            this.physics.add.overlap(gameState.player, gameState.coins, (player, coin) => {
                coin.destroy();
                gameState.coinsCollected += 5;
                document.getElementById('coins-earned').innerText = `Score: ${gameState.coinsCollected}`;
      
            }, null, this);
        
            // Set the camera to follow the player only along the x-axis
            this.cameras.main.startFollow(gameState.player, true);
        
            // Touch input settings for left/right press detection
            this.input.on('pointerdown', function (pointer) {
                if (pointer.x < this.scale.width / 2) {
                    // Left side of the screen
                    gameState.leftPressed = true;
                    gameState.rightPressed = false;
                } else {
                    // Right side of the screen
                    gameState.rightPressed = true;
                    gameState.leftPressed = false;
                }
            }, this);
    
            this.input.on('pointerup', function (pointer) {
                gameState.leftPressed = false;
                gameState.rightPressed = false;
    
            }, this);
        }
    
        update() {
        // Update background assets using the global function
        updateBackgroundAssets(gameState);    

            if (gameState.active) {
                // Touch input settings
                
    
                this.input.on('pointermove', function (pointer) {
                    if (pointer.isDown) { // Only process if the pointer is down
                        // Horizontal movement handling
                        if (pointer.x < this.scale.width / 2) {
                            // Left side of the screen
                            gameState.leftPressed = true;
                            gameState.rightPressed = false;
                        } else {
                            // Right side of the screen
                            gameState.rightPressed = true;
                            gameState.leftPressed = false;
                        }
                
                        // Vertical movement handling
                        if (pointer.y < this.scale.height / 2) {
                            // Top half of the screen
                            gameState.upPressed = true;
                        } else {
                            // Bottom half of the screen
                            gameState.upPressed = false;
                        }
                    }
                }, this);
                
                this.input.on('pointerdown', function (pointer) {
                    // Horizontal movement handling
                    if (pointer.x < this.scale.width / 2) {
                        // Left side of the screen
                        gameState.leftPressed = true;
                        gameState.rightPressed = false;
                    } else {
                        // Right side of the screen
                        gameState.rightPressed = true;
                        gameState.leftPressed = false;
                    }
                
                    // Vertical movement handling
                    if (pointer.y < this.scale.height / 2) {
                        // Top half of the screen
                        gameState.upPressed = true;
                    }
                }, this);
                
                this.input.on('pointerup', function (pointer) {
                    gameState.leftPressed = false;
                    gameState.rightPressed = false;
                    gameState.upPressed = false;
                }, this);
            
                // Handle movement based on touch input or keyboard input
                if (gameState.cursors.left.isDown || gameState.leftPressed) {
                    gameState.player.setVelocityX(-360);
                    gameState.player.anims.play('run', true);
                } else if (gameState.cursors.right.isDown || gameState.rightPressed) {
                    gameState.player.setVelocityX(360);
                    gameState.player.anims.play('run', true);
                } else {
                    gameState.player.setVelocityX(0);
                    gameState.player.anims.play('idle', true);
                }
            
                if ((gameState.cursors.up.isDown || gameState.upPressed) && gameState.player.body.touching.down) {
                    gameState.player.setVelocityY(-800);
                }
        
                // Handle movement based on swipe gestures or keyboard input
                if (gameState.cursors.left.isDown || gameState.leftPressed) {
                    gameState.player.setVelocityX(-360);
                    gameState.player.anims.play('run', true);
                    gameState.player.flipX = true;
        
                } else if (gameState.cursors.right.isDown || gameState.rightPressed) {
                    gameState.player.setVelocityX(360);
                    gameState.player.anims.play('run', true);
                    gameState.player.flipX = false;
            
                } else {
                    gameState.player.setVelocityX(0);
                    gameState.player.anims.play('idle', true);
                }
        
    
                // Check if the player has fallen off the page
                if (gameState.player.y > 1200) {
                    document.getElementById('game-alert').innerText = 'Game over!\n Click to play again';
                    document.getElementById('coins-earned').innerText = 'Score: 0';
                    this.physics.pause();
                    gameState.active = false;
                    gameState.player.setTint(0xff0000);
                    this.input.once('pointerup', () => {
                        this.scene.restart();
                    });
                    this.input.keyboard.on('keydown',  () => {
                        this.scene.restart();
                    });
                }
            }
        
        }
    }