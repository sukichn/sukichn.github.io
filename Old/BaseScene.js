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
