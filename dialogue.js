(function(global) {
    // Function to show dialogue
    global.showDialogue = function(scene) {
        if (scene.preventDialogue) {
            console.log("Dialogue is prevented."); // Debugging log
            return;
        }

        console.log("Showing dialogue."); // Debugging log
        scene.isDialogueActive = true; // Set the dialogue state to active
        scene.conversationStarted = false; // Reset conversation started flag

        // Show the dialogue container with transition
        const dialogueContainer = document.getElementById('dialogue-container');
        dialogueContainer.classList.add('show');

        // Show the dialogue elements
        document.getElementById('dialogue-container').style.display = 'block';
        document.getElementById('dialogue').style.display = 'block';

        // Reset the inactivity timer
        global.startInactivityTimer(scene);
    };

    // Function to reset dialogue
    global.resetDialogue = function(scene, forceReset = false) {
        console.log("Resetting dialogue."); // Debugging log
        // Hide the dialogue elements and reset their content
        const dialogueContainer = document.getElementById('dialogue-container');
        dialogueContainer.classList.remove('show');

        scene.isDialogueActive = false; // Reset the dialogue state

        if (forceReset) {
            console.log("Dialogue reset is forced."); // Debugging log
            scene.preventDialogue = true;
            setTimeout(() => {
                scene.preventDialogue = false;
                console.log("Dialogue can now be shown again."); // Debugging log
            }, 10000); // Delay for 10 secs
        }
    };

    // Function to start the inactivity timer
    global.startInactivityTimer = function(scene) {
        console.log("Starting inactivity timer."); // Debugging log
        clearTimeout(scene.inactivityTimer);

        scene.inactivityTimer = setTimeout(() => {
            if (scene.isDialogueActive && !scene.conversationStarted) {
                console.log("Inactivity detected. Resetting dialogue."); // Debugging log
                global.resetDialogue(scene);
            }
        }, 5000); // 5 seconds
    };

    // Main initialization function
    global.initializeDialogue = function(scene) {
        console.log("Initializing dialogue."); // Debugging log
        scene.isDialogueActive = false;
        scene.conversationStarted = false;
        scene.preventDialogue = false;

        scene.events.on('update', () => {
            const npcCurrentAnimKey = global.getNpcCurrentAnimKey();
            if (npcCurrentAnimKey !== 'talk') {
                if (scene.isDialogueActive) {
                    console.log("NPC is not talking. Resetting dialogue."); // Debugging log
                    global.resetDialogue(scene);
                }
            }
        });
    };

    // Dummy function to get NPC's current animation key (to be implemented in the animation file)
    global.getNpcCurrentAnimKey = function() {
        return 'talk'; // Placeholder return value
    };

})(window);