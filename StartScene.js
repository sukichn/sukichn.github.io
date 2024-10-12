let gameState = {};
var isClicking = false;

class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Load common assets
        loadBackgroundAssets(this);
        this.load.image('startImage', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/Enchanted_hat_I.png'); // Replace with the actual path to your start button image
        document.getElementById('timer').style.display = 'none';
        document.getElementById('health').style.display = 'none';
        document.getElementById('coins-earned').style.display = 'none';
        document.getElementById('joystick').style.display = 'none';
        document.getElementById('shooter').style.display = 'none';
    }

    create() {
        // Create background assets using the global function
        createBackgroundAssets(this, gameState);

        // Add a title
        // Function to calculate font size based on screen width
        function getResponsiveFontSize() {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 480) {
                return '27px';  // For small screens like mobiles
            } else if (screenWidth <= 768) {
                return '32px';  // For medium screens like tablets
            } else {
                return '48px';  // For larger screens like desktops
            }
        }

        const fontSize = getResponsiveFontSize();
        this.add.text(800, 250, "The Alchemist's Adventure", { fontSize: fontSize, fill: '#ffffff', fontFamily: 'Work Sans' }).setOrigin(0.5).setDepth(1);

        // Add a start button
        const startImage = this.add.image(800, 500, 'startImage').setInteractive().setDepth(1);

        const startText = this.add.text(800, 750, 'Click to begin...', { fontSize: fontSize, fill: '#ffffff', fontFamily: 'Work Sans' }).setOrigin(0.5).setDepth(1).setInteractive();
        this.input.on('pointerdown', () => {
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
        document.getElementById('timer').style.display = 'block';
        document.getElementById('health').style.display = 'block';
        document.getElementById('coins-earned').style.display = 'block';
        document.getElementById('joystick').style.display = 'block';
        document.getElementById('shooter').style.display = 'block';
    }

    update() {
        // Update background assets using the global function
        gameState.background.tilePositionX += 0.1;
       /* gameState.trees.tilePositionX += 0.14;
        gameState.foreground.tilePositionX += 0.2;
        gameState.fog.tilePositionX += 0.7;*/

        // Check for the 'N' key press to start the game
        if (gameState.keys.startGame.isDown) {
            this.startGame();
        }
    }
}