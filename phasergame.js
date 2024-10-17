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

// Ensure the DOM is fully loaded before adding event listeners
window.addEventListener('DOMContentLoaded', (event) => {
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

    canvas.addEventListener('touchend', (event) => {
        event.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchcancel', (event) => {
        event.preventDefault();
    }, { passive: false });

    // Function to prevent default touch actions
    function preventDefaultTouchActions(element) {
        element.addEventListener('touchstart', (event) => {
            event.preventDefault();
        }, { passive: false });

        element.addEventListener('touchmove', (event) => {
            event.preventDefault();
        }, { passive: false });

        element.addEventListener('touchend', (event) => {
            event.preventDefault();
        }, { passive: false });

        element.addEventListener('touchcancel', (event) => {
            event.preventDefault();
        }, { passive: false });
    }

    // Prevent default touch actions on the joystick
    const joystick = document.getElementById('joystick');
    preventDefaultTouchActions(joystick);

    // Prevent default touch actions on the shooter
    const shooter = document.getElementById('shooter');
    preventDefaultTouchActions(shooter);

    // Prevent default touch actions on the shooter
    const musicOn = document.getElementById('music-on');
    preventDefaultTouchActions(musicOn);

    // Prevent default touch actions on the shooter
    const musicOff = document.getElementById('music-off');
    preventDefaultTouchActions(musicOff);
});