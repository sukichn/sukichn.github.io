// timeUtils.js

(function(global) {
    global.timeUtils = {
        startCountdown: function(scene, duration, gameState) {
            let timer = duration;
            const countdownElement = document.getElementById('countdown');
            const timerElement = document.getElementById('timer');
            const initialDuration = duration;
            const totalTimeElement = document.getElementById('total-time');

            gameState.timerEvent = scene.time.addEvent({
                delay: 10, // Update every 10 milliseconds
                callback: () => {
                    const minutes = Math.floor(timer / 60000);
                    const seconds = Math.floor((timer % 60000) / 1000);
                    const milliseconds = Math.floor((timer % 1000) / 10); // Get two digits for milliseconds
                    countdownElement.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}:${milliseconds < 10 ? '0' : ''}${milliseconds}`;

                    const elapsed = initialDuration - timer;
                    const elapsedMinutes = Math.floor(elapsed / 60000);
                    const elapsedSeconds = Math.floor((elapsed % 60000) / 1000);
                    const elapsedMilliseconds = Math.floor((elapsed % 1000) / 10);
                    timerElement.innerText = `Time: ${elapsedMinutes}:${elapsedSeconds < 10 ? '0' : ''}${elapsedSeconds}:${elapsedMilliseconds < 10 ? '0' : ''}${elapsedMilliseconds}`;

                    // Calculate and display the total elapsed time
                    const totalElapsed = gameState.elapsedTime + elapsed;
                    gameState.totalElapsedTime = totalElapsed; // Update total elapsed time
                    const totalElapsedMinutes = Math.floor(totalElapsed / 60000);
                    const totalElapsedSeconds = Math.floor((totalElapsed % 60000) / 1000);
                    const totalElapsedMilliseconds = Math.floor((totalElapsed % 1000) / 10);
                    totalTimeElement.innerText = `Total Time: ${totalElapsedMinutes}:${totalElapsedSeconds < 10 ? '0' : ''}${totalElapsedSeconds}:${totalElapsedMilliseconds < 10 ? '0' : ''}${totalElapsedMilliseconds}`;

                    if ((timer -= 10) < 0) {
                        global.timeUtils.handleTimeOut(scene, gameState);
                    }
                },
                loop: true
            });
        },

        handleTimeOut: function(scene, gameState) {
            document.getElementById('game-alert').innerText = 'Time is up!';
            gameAlert.classList.add('show');
            scene.physics.pause();
            gameState.active = false;
            scene.anims.pauseAll();
            if (gameState.enemy1.move) gameState.enemy1.move.stop();
            if (gameState.enemy2.move) gameState.enemy2.move.stop();

            // Stop the timer event
            if (gameState.timerEvent) {
                gameState.timerEvent.remove();
            }

            // Update total elapsed time
            gameState.elapsedTime = gameState.totalElapsedTime;

            // Remove previous event listeners to avoid multiple triggers
            scene.input.keyboard.off('keydown');
            scene.input.off('pointerup');
            scene.input.off('pointerdown');
            scene.input.off('pointermove');

            const restartScene = () => {
                document.getElementById('game-alert').classList.remove('show');

                // Resume animations and clear user inputs
                scene.anims.resumeAll();
                gameState.leftPressed = false;
                gameState.rightPressed = false;
                gameState.upPressed = false;

                // Restart the current scene
                scene.scene.restart();
            };

            // Add new event listeners for restarting the scene
            scene.input.on('pointerup', restartScene);
            scene.input.keyboard.on('keydown', restartScene);
        }
    };
})(window);