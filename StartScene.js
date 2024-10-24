let gameState = {};
var isClicking = false;

class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Load assets specific to the start scene
        this.load.image('largeCloud', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/cloud-background.png');
        this.load.image('bg', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/grass-bg.png');
        this.load.image('mist', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/mist.png');
        this.load.image('sunflower1', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/sunflower1.png');
        this.load.image('sunflower2', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/sunflower2.png');
        this.load.image('startImage', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/Enchanted_hat_I.png'); // Replace with the actual path to your start button image

        this.load.audio('backgroundMusic', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Audio/colorful-flowers.mp3');

        document.getElementById('game-text').style.display = 'none';
        
        document.getElementById('inventory-control').style.display = 'none';
        document.getElementById('inventory').style.display = 'none';

        document.getElementById('shooter').style.display = 'none';
        document.getElementById('joystick').style.display = 'none';
    }

    create() {
        // Create background assets
        this.createBackgroundAssets();

        // Add a title
        // Function to calculate font size based on screen width
        function getResponsiveFontSize() {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 480) {
                return '27px';  // For small screens like mobiles
            } else if (screenWidth <= 768) {
                return '32px';  // For medium screens like tablets
            } else {
                return '45px';  // For larger screens like desktops
            }
        }

        const fontSize = getResponsiveFontSize();
        this.add.text(800, 250, "Nola's Adventure", { fontSize: fontSize, fill: '#000050', fontFamily: 'Work Sans' }).setOrigin(0.5).setDepth(1);

        // Add a start image
        const startText = this.add.text(800, 750, 'Click to begin...', { fontSize: fontSize, fill: '#000050', fontFamily: 'Work Sans' }).setOrigin(0.5).setDepth(1).setInteractive();

        // Create a transparent rectangle to cover the clickable area (excluding the top 20 pixels)
        const clickableArea = this.add.rectangle(0, 140, this.cameras.main.width, this.cameras.main.height - 140, 0x000000, 0).setOrigin(0, 0).setInteractive();

        // Listen for pointerdown events on the clickable area
        clickableArea.on('pointerdown', () => {
            this.startGame();
        });

        // Create a key binding for the 'N' key to start the game
        gameState.keys = {
            startGame: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N)
        };

    }

    startGame() {
        this.scene.stop('StartScene');
        this.scene.start('Scene1');
        document.getElementById('main-header').style.display = 'none';

        document.getElementById('game-text').style.display = 'block';
        document.getElementById('inventory-control').style.display = 'block';

        document.getElementById('shooter').style.display = 'block';
        document.getElementById('joystick').style.display = 'block';
        
    }

    update() {
        // Update background assets
        gameState.backgroundCloud.tilePositionX += 0.12;
        gameState.background.tilePositionX += 0.1;
        gameState.mist.tilePositionX += 0.16;
        
        // Update the sunflower position
        this.updateSunflowerPosition();

        // Check for the 'N' key press to start the game
        if (gameState.keys.startGame.isDown) {
            this.startGame();
        }
    }

    createBackgroundAssets() {
        gameState.backgroundCloud = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'largeCloud')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setScale(1);
        gameState.background = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'bg')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setScale(1);
        gameState.mist = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'mist')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setScale(1)
            .setDepth(10)

        // Define the sunflower animation
        this.anims.create({
            key: 'sunflowerAnimation',
            frames: [
                { key: 'sunflower1' },
                { key: 'sunflower2' }
            ],
            frameRate: 2, // Set the frame rate (adjust as needed)
            repeat: -1 // Repeat indefinitely
        });

        // Add sunflower sprite and play the animation
        gameState.sunflower = this.add.sprite(this.cameras.main.width - 800, this.cameras.main.height / 2, 'sunflower1') // Start off-screen to the right
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0)
            .setScale(1)
            .setDepth(10); // Set depth to a high value to appear in front of other elements

        gameState.sunflower.play('sunflowerAnimation');

        // Debugging output
        console.log('Sunflower created at:', gameState.sunflower.x, gameState.sunflower.y);
    }

    updateSunflowerPosition() {
        gameState.sunflower.x -= 0.3;

        // Loop the sunflower when it goes off-screen
        if (gameState.sunflower.x < -gameState.sunflower.width + 1200) {
            gameState.sunflower.x = this.cameras.main.width + 400;
        }

        // Debugging output
        console.log('Sunflower position:', gameState.sunflower.x);
    }
}