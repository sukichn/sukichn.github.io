let gameState = {};
var isClicking = false;
var swipeDirection;
let swipeStartX = 0;
let swipeStartY = 0;

class BaseScene extends Phaser.Scene {
    constructor(key) {
        super({ key });
    }

    preload() {
        // Load common assets
        this.load.image('bg', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/background.png');      
        this.load.image('fog', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/fog.png');      
        this.load.image('trees', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/trees.png');      
        this.load.image('foreground', 'https://raw.githubusercontent.com/devshareacademy/phaser-3-typescript-games-and-examples/refs/heads/main/examples/parallax-scrolling-background/public/assets/images/foreground.png');      
    }

    createBackground() {
        gameState.background = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'bg').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);
        gameState.trees = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'trees').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);
        gameState.fog = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'fog').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);
        gameState.foreground = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'foreground').setOrigin(0, 0).setScrollFactor(0).setScale(4.5);
    }

    updateBackground() {
        gameState.background.tilePositionX += 0.1;
        gameState.trees.tilePositionX += 0.14;
        gameState.foreground.tilePositionX += 0.2;
        gameState.fog.tilePositionX += 0.7;
    }
}

class StartScene extends BaseScene {
    constructor() {
        super('StartScene');
    }

    preload() {
        super.preload();
        this.load.image('startButton', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/Potion_I.png'); // Replace with the actual path to your start button image
    }

    create() {
        super.createBackground();

        // Add a title
        this.add.text(800, 250, 'Start Game', { fontSize: '58px', fill: '#ffffff', fontFamily: 'Work Sans' }).setOrigin(0.5).setDepth(1);

        // Add a start button
        const startButton = this.add.image(800, 500, 'startButton').setInteractive().setDepth(1).setScale(0.1);
        startButton.on('pointerdown', () => {
            this.scene.stop('StartScene')
            this.scene.start('GameScene')
        });

        // Add instructions or other UI elements as needed
        this.add.text(800, 750, 'Click to start!', { fontSize: '32px', fill: '#ffffff', fontFamily: 'Work Sans' }).setOrigin(0.5).setDepth(1);
    }

    update() {
        super.updateBackground();
    }
}

// Phaser Game Scene
class GameScene extends BaseScene {
    constructor() {
        super('GameScene');
    }

    preload() {
        super.preload();
        this.load.image('cave', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/cave_background.png');
        this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/platform.png');
        this.load.spritesheet('codey', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/codey_sprite.png', { frameWidth: 72, frameHeight: 90 });
        this.load.spritesheet('snowman', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/snowman.png', { frameWidth: 50, frameHeight: 70 });
        this.load.spritesheet('exit', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/cave_exit.png', { frameWidth: 60, frameHeight: 70 });
        this.load.image('leftButton', 'Resources/css/Images/.png'); // Replace with the actual path to your start button image
        this.load.image('upButton', 'Resources/css/Images/.png'); // Replace with the actual path to your start button image
        this.load.image('rightButton', 'Resources/css/Images/.png'); // Replace with the actual path to your start button image
    }

    create() {
        super.createBackground();
        gameState.active = true;
    
        const platforms = this.physics.add.staticGroup();
        const platPositions = [
            { x: -150, y: 575 },{ x: 50, y: 575 }, { x: 250, y: 575 }, { x: 450, y: 575 }, { x: 400, y: 380 }, { x: 100, y: 200 },
            { x: 650, y: 775 }
        ];
        platPositions.forEach(plat => {
          platforms.create(plat.x, plat.y, 'platform')
        });
    
        gameState.player = this.physics.add.sprite(50, 500, 'codey').setScale(.8);
        this.physics.add.collider(gameState.player, platforms);
        gameState.player.setCollideWorldBounds(true);
    
        gameState.cursors = this.input.keyboard.createCursorKeys();
    
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
    
        gameState.enemy = this.physics.add.sprite(480, 300, 'snowman');
        this.physics.add.collider(gameState.enemy, platforms);
    
        this.anims.create({
          key: 'snowmanAlert',
          frames: this.anims.generateFrameNumbers('snowman', { start: 0, end: 3 }),
          frameRate: 4,
          repeat: -1
        });
    
        gameState.enemy.anims.play('snowmanAlert', true);
    
        this.physics.add.overlap(gameState.player, gameState.enemy, () => {
          this.add.text(150, 50, '      Game Over...\n  Click to play again.', { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
          this.physics.pause();
          gameState.active = false;
          this.anims.pauseAll();
          gameState.enemy.move.stop();
          this.input.on('pointerup', () => {
            this.anims.resumeAll();
            this.scene.restart();
          });
        });
    
        gameState.exit = this.physics.add.sprite(50, 142, 'exit');
        this.anims.create({
          key: 'glow',
          frames: this.anims.generateFrameNumbers('exit', { start: 0, end: 5 }),
          frameRate: 4,
          repeat: -1
        });
        this.physics.add.collider(gameState.exit, platforms);
        gameState.exit.anims.play('glow', true);
    
        this.physics.add.overlap(gameState.player, gameState.exit, () => {
          this.add.text(150, 50, 'You reached the exit!\n  Click to play again.', { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
          this.physics.pause();
          gameState.active = false;
          this.anims.pauseAll();
          gameState.enemy.move.stop();
          this.input.on('pointerup', () => {
            this.anims.resumeAll();
            this.scene.restart();
          });
        });
    
        gameState.enemy.move = this.tweens.add({
          targets: gameState.enemy,
          x: 320,
          ease: 'Linear',
          duration: 1800,
          repeat: -1,
          yoyo: true,
          onRepeat: growSnowman
        });
        
        let scaleChange = 1.1;
        function growSnowman() {
          if (scaleChange < 4) {
            scaleChange += .3;
            gameState.enemy.setScale(scaleChange);
            gameState.enemy.y -= 15;
          }
        }

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

            // Store the starting positions for swipe detection
            isClicking = true;
            swipeStartY = pointer.y;
        }, this);

        this.input.on('pointerup', function (pointer) {
            gameState.leftPressed = false;
            gameState.rightPressed = false;

            // Capture the end position of the swipe
            if (isClicking) {
                let swipeEndY = pointer.y;
                let deltaY = swipeEndY - swipeStartY;

                if (Math.abs(deltaY) >= 50 && deltaY < 0) {
                    swipeDirection = 'up';
                }

                isClicking = false;
            }
        }, this);
    }

    update() {
        // Update background positions for parallax effect
        gameState.background.tilePositionX += 0.1;
        gameState.trees.tilePositionX += 0.14;
        gameState.foreground.tilePositionX += 0.2;
        gameState.fog.tilePositionX += 0.7;

        if (gameState.active) {
            // Touch input settings
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
        
            this.input.on('pointerdown', function (pointer) {
                if (pointer.y < this.scale.height / 2) {
                    // Top half of the screen
                    gameState.upPressed = true;
                }
            }, this);
        
            this.input.on('pointerup', function (pointer) {
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
                swipeDirection = '';  // Reset swipe direction after handling
            } else if (gameState.cursors.right.isDown || gameState.rightPressed) {
                gameState.player.setVelocityX(360);
                gameState.player.anims.play('run', true);
                gameState.player.flipX = false;
                swipeDirection = '';  // Reset swipe direction after handling
            } else {
                gameState.player.setVelocityX(0);
                gameState.player.anims.play('idle', true);
            }
    
            if ((gameState.cursors.up.isDown || swipeDirection === 'up') && gameState.player.body.touching.down) {
                gameState.player.setVelocityY(-800);
                swipeDirection = '';  // Reset swipe direction after handling
            }

            // Check if the player has fallen off the page
            if (gameState.player.y > 950) {
                this.add.text(900, 500, '      Game over!\nClick to play again.', {
                    fontFamily: 'Arial',
                    fontSize: '36px',
                    color: '#ffffff'
                }).setOrigin(0.5);

                this.physics.pause();
                gameState.active = false;
                gameState.player.setTint(0xff0000);
                this.input.once('pointerup', () => {
                    this.scene.restart();
                });
            }
        }
    }
}

// Create the Phaser game instance
const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 1000,
    scene: [StartScene, GameScene], // Include both start and game scenes
    parent: 'body', // Attach Phaser to the game container div
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1500 },
            enableBody: true,
        },
    },
};

const game = new Phaser.Game(config);