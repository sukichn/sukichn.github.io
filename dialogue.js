(function(global) {
    // Function to show dialogue
    global.showDialogue = function(scene) {
        if (scene.preventDialogue) {
            return;
        }

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
        // Hide the dialogue elements and reset their content
        const dialogueContainer = document.getElementById('dialogue-container');
        dialogueContainer.classList.remove('show');

        // Optionally, reset the text content
        /* document.getElementById('dialogue').innerText = '';
        document.getElementById('reply1').innerText = '';
        document.getElementById('reply2').innerText = ''; */

        scene.isDialogueActive = false; // Reset the dialogue state

        // If the reset is forced (e.g., by selecting "No"), set the preventDialogue flag
        if (forceReset) {
            scene.preventDialogue = true;
            // Allow the dialogue to be shown again after a delay
            setTimeout(() => {
                scene.preventDialogue = false;
            }, 10000); // Delay for 10 secs
        }
    };

    // Function to start the inactivity timer
    global.startInactivityTimer = function(scene) {
        // Clear any existing timer
        clearTimeout(scene.inactivityTimer);

        // Set a new timer to hide the dialogue after a period of inactivity
        scene.inactivityTimer = setTimeout(() => {
            if (scene.isDialogueActive && !scene.conversationStarted) {
                global.resetDialogue(scene);
            }
        }, 5000); // 5 seconds
    };

    // Main initialization function
    global.initializeDialogue = function(scene) {
        // State flags
        scene.isDialogueActive = false;
        scene.conversationStarted = false;
        scene.preventDialogue = false;

        // Function to check NPC's animation state and reset dialogue if necessary
        scene.events.on('update', () => {
            const npcCurrentAnimKey = global.getNpcCurrentAnimKey();
            if (npcCurrentAnimKey !== 'talk') {
                if (scene.isDialogueActive) {
                    global.resetDialogue(scene);
                }
            }
        });
    };

    // Dummy function to get NPC's current animation key (to be implemented in the animation file)
    global.getNpcCurrentAnimKey = function() {
        // This should return the current animation key of the NPC
        // For example: return gameState.npc.anims.currentAnim.key;
        return 'talk'; // Placeholder return value
    };

})(window);