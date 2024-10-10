(function(global) {
// Repellent shooting logic
global.shootRepellent = function(scene, direction, player, repellentsGroup, gameState) {
    // Check if gameState.attacks is greater than 0
    if (gameState.attacks > 0) {
        console.log("Attacks left before shooting: " + gameState.attacks);

        const repellent = repellentsGroup.create(player.x, player.y, 'repellent');
        repellent.body.allowGravity = false; // Disable gravity for the repellent

        switch (direction) {
            case 'left':
                repellent.setVelocity(-800, 0); // Shoot left
                break;
            case 'right':
                repellent.setVelocity(800, 0); // Shoot right
                break;
            case 'up':
                const xVelocityUp = player.body.velocity.x * 0.5; // Add a fraction of the player's X velocity
                repellent.setVelocity(xVelocityUp, -800); // Shoot upward
                break;
            case 'down':
                const xVelocityDown = player.body.velocity.x * 0.5; // Add a fraction of the player's X velocity
                repellent.setVelocity(xVelocityDown, 800); // Shoot downward
                break;
        }

        // Decrease the number of attacks
        gameState.attacks--;
        console.log("Repellent shot. Attacks remaining after shooting: " + gameState.attacks);
        
        // Update the inner text of the attacks element
        document.getElementById('attacks').innerText = `Attacks: ${gameState.attacks}`;
    } else {
        // Logic when there are no attacks left
        console.log("No attacks left to shoot repellent.");
    }
};

// Setup shooting button
global.setupShooterButton = function(scene, gameState) {
    const shooterButton = document.getElementById('shooter');

    // Flags to track button press and release state
    gameState.pointerPressed = false;
    gameState.spacePressed = false;

    if (shooterButton) {
        shooterButton.addEventListener('pointerdown', () => {
            console.log('Shooter button pressed');
            gameState.pointerPressed = true;
        });

        shooterButton.addEventListener('pointerup', () => {
            console.log('Shooter button released');
            if (gameState.pointerPressed) {
                const direction = gameState.player.flipX ? 'left' : 'right';
                shootRepellent(scene, direction, gameState.player, gameState.repellent, gameState);
                gameState.pointerPressed = false; // Reset the flag
            }
        });
    }

    scene.input.keyboard.on('keydown-SPACE', () => {
        console.log('Spacebar pressed');
        gameState.spacePressed = true;
    });

    scene.input.keyboard.on('keyup-SPACE', () => {
        console.log('Spacebar released');
        if (gameState.spacePressed) {
            const direction = gameState.player.flipX ? 'left' : 'right';
            shootRepellent(scene, direction, gameState.player, gameState.repellent, gameState);
            gameState.spacePressed = false; // Reset the flag
        }
    });
};

})(window);