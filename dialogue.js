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
        document.getElementById('reply2').innerText = '';*/

        scene.isDialogueActive = false; // Reset the dialogue state

        // If the reset is forced (e.g., by selecting "No"), set the preventDialogue flag
        if (forceReset) {
            scene.preventDialogue = true;
            // Allow the dialogue to be shown again after a delay
            setTimeout(() => {
                scene.preventDialogue = false;
            }, 60000); // Delay for 1 minute
        }

        // Optionally, zoom the camera back out
        /*scene.cameras.main.zoomTo(1, 1000);*/ // Adjust the zoom level and duration as needed
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

    // Function to fetch and display a dialogue page
    global.fetchPage = function(scene, page) {
        // Find the page data based on the page number
        const pageData = pages.find(p => p.page === page);

        if (pageData) {
            // Update the dialogue text
            document.getElementById('dialogue').innerText = pageData.narrative;

            // Update the reply buttons
            const reply1 = document.getElementById('reply1');
            const reply2 = document.getElementById('reply2');

            // Check the number of options and update buttons accordingly
            if (pageData.options.length > 0) {
                reply1.innerText = pageData.options[0].option;
                reply1.style.display = 'inline-block'; // Show the button
                reply1.onclick = () => {
                    scene.conversationStarted = true; // Set conversation started flag
                    if (pageData.options[0].closeDialogue) {
                        global.resetDialogue(scene, true); // Force reset the dialogue
                    } else {
                        global.fetchPage(scene, pageData.options[0].nextPage);
                        clearTimeout(scene.inactivityTimer);
                        global.startInactivityTimer(scene);
                    }
                };
            } else {
                reply1.style.display = 'none'; // Hide the button if no options
            }

            if (pageData.options.length > 1) {
                reply2.innerText = pageData.options[1].option;
                reply2.style.display = 'inline-block'; // Show the button
                reply2.onclick = () => {
                    scene.conversationStarted = true; // Set conversation started flag
                    if (pageData.options[1].closeDialogue) {
                        global.resetDialogue(scene, true); // Force reset the dialogue
                    } else {
                        global.fetchPage(scene, pageData.options[1].nextPage);
                        clearTimeout(scene.inactivityTimer);
                        global.startInactivityTimer(scene);
                    }
                };
            } else {
                reply2.style.display = 'none'; // Hide the button if no options
            }
        }
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

})(window);