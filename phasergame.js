const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 1000,
    scene: [StartScene, Scene1, Scene2, Scene3, Scene4], // Include both start and game scenes
    
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1500 },
            enableBody: true,
        },
    },
};

const game = new Phaser.Game(config);