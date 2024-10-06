let gameState = {};
var isClicking = false;

class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: 'StartScene' })
	}
  
    
        preload() {
                   // Load common assets
                   loadBackgroundAssets(this);
        this.load.image('startButton', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/Potion_I.png'); // Replace with the actual path to your start button image

        }
    
        create() {
    // Create background assets using the global function
    createBackgroundAssets(this, gameState);  

    // Add a title
    this.add.text(800, 250, 'Start Game', { fontSize: '58px', fill: '#ffffff', fontFamily: 'Work Sans' }).setOrigin(0.5).setDepth(1);

    // Hide coins earned
    document.getElementById('coins-earned').style.display = 'none';

    // Add a start button
    const startButton = this.add.image(800, 500, 'startButton').setInteractive().setDepth(1).setScale(0.1);
    startButton.on('pointerdown', () => {
        this.scene.stop('StartScene');
        this.scene.start('Scene1');
        document.getElementById('main-header').style.display = 'none';
        document.getElementById('coins-earned').style.display = 'block';
    });

    const startText = this.add.text(800, 750, 'Click to start!', { fontSize: '32px', fill: '#ffffff', fontFamily: 'Work Sans' }).setOrigin(0.5).setDepth(1).setInteractive();
    startText.on('pointerdown', () => {
        this.scene.stop('StartScene');
        this.scene.start('Scene1');
        document.getElementById('main-header').style.display = 'none';
        document.getElementById('coins-earned').style.display = 'block';
    });    
        }
    
        update() {
            // Update background assets using the global function
    updateBackgroundAssets(gameState);
    
        }
    }