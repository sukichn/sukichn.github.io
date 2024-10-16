(function(global) {
    // Function to show dialogue
    global.showDialogue = function(scene) {
        scene.isDialogueActive = true; // Set the dialogue state to active

        // Show the dialogue elements
        document.getElementById('dialogue-container').style.display = 'block';
        document.getElementById('dialogue').style.display = 'block';
        document.getElementById('reply1').style.display = 'inline-block';
        document.getElementById('reply2').style.display = 'inline-block';

        // Reset the inactivity timer
        global.startInactivityTimer(scene);
    };

    // Function to reset dialogue
    global.resetDialogue = function(scene, forceReset = false) {
        // Hide the dialogue elements and reset their content
        document.getElementById('dialogue-container').style.display = 'none';
        document.getElementById('dialogue').style.display = 'none';
        document.getElementById('reply1').style.display = 'none';
        document.getElementById('reply2').style.display = 'none';

        // Optionally, reset the text content
        document.getElementById('dialogue').innerText = '';
        document.getElementById('reply1').innerText = 'Yes';
        document.getElementById('reply2').innerText = 'No';

        scene.isDialogueActive = false; // Reset the dialogue state

        // If the reset is forced (e.g., by selecting "No"), set the preventDialogue flag
        if (forceReset) {
            scene.preventDialogue = true;
            // Allow the dialogue to be shown again after a short delay
            setTimeout(() => {
                scene.preventDialogue = false;
            }, 2000); // Adjust the delay as needed
        }

        // Optionally, zoom the camera back out
        scene.cameras.main.zoomTo(1, 1000); // Adjust the zoom level and duration as needed
    };

    // Function to start the inactivity timer
    global.startInactivityTimer = function(scene) {
        // Clear any existing timer
        clearTimeout(scene.inactivityTimer);

        // Set a new timer to hide the dialogue after a period of inactivity
        scene.inactivityTimer = setTimeout(() => {
            if (scene.isDialogueActive) {
                global.resetDialogue(scene);
            }
        }, 5000); // Adjust the delay as needed (5000 ms = 5 seconds)
    };

    // Function to handle overlap between player and NPC
    global.handleOverlap = function(scene, player, npc) {
        // Check if the player is no longer overlapping with the NPC
        if (!scene.physics.overlap(player, npc)) {
            global.resetDialogue(scene);
        }
    };
})(window);