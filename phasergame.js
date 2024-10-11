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

// Prevent default touch actions on the canvas
const canvas = document.querySelector('canvas');
canvas.addEventListener('touchstart', (event) => {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

canvas.addEventListener('touchmove', (event) => {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

// Prevent default touch actions on the joystick
const joystick = document.getElementById('joystick');
joystick.addEventListener('touchstart', (event) => {
    event.preventDefault();
}, { passive: false });

joystick.addEventListener('touchmove', (event) => {
    event.preventDefault();
}, { passive: false });

// Prevent default touch actions on the shooter
const shooter = document.getElementById('shooter');
shooter.addEventListener('touchstart', (event) => {
    event.preventDefault();
}, { passive: false });

shooter.addEventListener('touchmove', (event) => {
    event.preventDefault();
}, { passive: false });