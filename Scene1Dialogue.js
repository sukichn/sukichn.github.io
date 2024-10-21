const pages = [
    {
        character: 'Balu',
        page: 1,
        narrative: "Balu: Hello there!",
        redirectOnTaskComplete: 10, // Redirect to page 10 if task is completed
        redirectOnTaskInProgress: 11, // Redirect to page 11 if task is in progress
        options: [
            { option: 'Say hi', nextPage: 2 },
            { option: 'Ignore', closeDialogue: true, forceReset: true }, // Force reset on this option
        ]
    },
    {
        character: 'Balu',
        page: 2,
        narrative: "Balu: Have you seen any butterflies around?",
        options: [
            { option: "I found some here.", nextPage: 4, checkTask: true },
            { option: "Are they difficult to find?", nextPage: 3 },
        ]
    },
    {
        character: 'Balu',
        page: 3,
        narrative: "Balu: They can be a bit elusive.",
        options: [
            { option: "I'll help you find some.", nextPage: 5, startTask: true },
            { option: 'Tell me more.', nextPage: 4 },
        ]
    },
    {
        character: 'Balu',
        page: 4,
        narrative: "Balu: They're usually drawn to dandelions.",
        options: [
            { option: "I'll help you find some.", nextPage: 5, startTask: true },
            { option: 'Not now', closeDialogue: true, forceReset: true }, // Force reset on this option
        ]
    },
    // Task assignment stage
    {
        character: 'Balu',
        page: 5,
        narrative: "Balu: Four should do it!",
        options: [
            { option: 'Got it!', closeDialogue: true, forceReset: true },
        ]
    },
    // Task completion stage
    {
        character: 'Balu',
        page: 6,
        narrative: "Balu: You found them! Here's something for your help.",
        options: [
            { option: 'Any more tasks?', nextPage: 7 },
            { option: 'No, that’s all for now.', closeDialogue: true, forceReset: true }, // Force reset on this option
        ]
    },
    // Additional tasks or dialogue
    {
        character: 'Balu',
        page: 7,
        narrative: 'Balu: Actually, yes! Can you find the ancient scroll hidden in the forest?',
        options: [
            { option: 'Of course!', nextPage: 8, startTask: true },
            { option: 'Maybe later', closeDialogue: true, forceReset: true }, // Force reset on this option
        ]
    },
    {
        character: 'Balu',
        page: 8,
        narrative: 'Balu: Excellent! The scroll holds secrets that could change everything.',
        options: [
            { option: 'I will find it!', closeDialogue: true, forceReset: true },
        ]
    },
    {
        character: 'Balu',
        page: 9,
        narrative: "Balu: Hm, I need a few more.",
        options: [
            { option: "Where can I find them?", nextPage: 4},
        ]
    },
    {
        character: 'Balu',
        page: 10,
        narrative: "Thanks again for helping! Do you need anything else?",
        options: [
            { option: 'Any more tasks?', nextPage: 7 },
            { option: 'No, that’s all for now.', closeDialogue: true, forceReset: true },
        ]
    },
    {
        character: 'Balu',
        page: 11,
        narrative: "Have you found the butterflies?",
        options: [
            { option: "Here you go.", nextPage: 6, checkTask: true },
            { option: 'Not yet.', closeDialogue: true, forceReset: true },
        ]
    },
];

(function(global) {
    global.fetchPage = function(scene, page, checkTask = false) {
        // Find the page data based on the page number
        let pageData = pages.find(p => p.page === page);

        if (!pageData) {
            console.error(`Page ${page} not found.`);
            return;
        }

        // Redirect to the specified page if the task is completed and the current page has redirectOnTaskComplete property
        if (gameState.taskCompleted && pageData.redirectOnTaskComplete) {
            console.log(`Task already completed. Redirecting to page ${pageData.redirectOnTaskComplete}.`);
            page = pageData.redirectOnTaskComplete;
            pageData = pages.find(p => p.page === page);
        }

        // Redirect to the specified page if the task is in progress and the current page has redirectOnTaskInProgress property
        if (gameState.taskInProgress && pageData.redirectOnTaskInProgress) {
            console.log(`Task in progress. Redirecting to page ${pageData.redirectOnTaskInProgress}.`);
            page = pageData.redirectOnTaskInProgress;
            pageData = pages.find(p => p.page === page);
        }

        // Handle task-specific logic before rendering the page
        if (checkTask || pageData.taskCheck) {
            console.log(`Task check triggered for page: ${page}`);
            console.log(`Current game state:`, gameState);

            // If the task is already completed, redirect to a specific page
            if (gameState.taskCompleted) {
                console.log(`Task already completed. Redirecting to page 10.`);
                page = 10; // Redirect to page 10 if the task is already completed
                pageData = pages.find(p => p.page === page);
            } 
            // If the player has enough coins, complete the task and update the state
            else if (gameState.coinsCollected >= 4) {
                console.log(`Player has enough coins. Completing task.`);
                gameState.coinsCollected -= 4;

                // Remove butterfly images from inventory
                for (let i = 0; i < 2; i++) {
                    const removedElement = gameState.inventoryElements.pop();
                    if (removedElement) {
                        removedElement.parentNode.removeChild(removedElement);
                    }
                }

                document.getElementById('coins-earned').innerText = `Butterflies: ${gameState.coinsCollected}`;
                gameState.rewardsCollected += 10; // Increment rewards by 10
                document.getElementById('rewards-earned').innerText = `Gold: ${gameState.rewardsCollected}`; // Update the DOM element
                gameState.taskCompleted = true; // Set the task as completed
                gameState.taskInProgress = false; // Set task in progress to false
                page = 6; // Redirect to page 6 after updating the game state
                pageData = pages.find(p => p.page === page);
            } 
            // If the player doesn't have enough items, redirect to a specific page
            else {
                console.log(`Player does not have enough coins. Redirecting to page 9.`);
                page = 9; // Redirect to page 9 if the player hasn't collected enough
                pageData = pages.find(p => p.page === page);
            }

            console.log(`New page after task check: ${page}`);
        }

        if (pageData) {
            console.log(`Rendering page: ${page}`); // Debugging log
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
                    console.log(`Option 1 selected: ${pageData.options[0].option}`); // Debugging log
                    scene.conversationStarted = true; // Set conversation started flag
                    if (pageData.options[0].closeDialogue) {
                        global.resetDialogue(scene, pageData.options[0].forceReset); // Force reset if specified
                    } else {
                        if (pageData.options[0].startTask) {
                            gameState.taskInProgress = true; // Set task in progress if the option has startTask
                        }
                        global.fetchPage(scene, pageData.options[0].nextPage, pageData.options[0].checkTask);
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
                    console.log(`Option 2 selected: ${pageData.options[1].option}`); // Debugging log
                    scene.conversationStarted = true; // Set conversation started flag
                    if (pageData.options[1].closeDialogue) {
                        global.resetDialogue(scene, pageData.options[1].forceReset); // Force reset if specified
                    } else {
                        if (pageData.options[1].startTask) {
                            gameState.taskInProgress = true; // Set task in progress if the option has startTask
                        }
                        global.fetchPage(scene, pageData.options[1].nextPage, pageData.options[1].checkTask);
                        clearTimeout(scene.inactivityTimer);
                        global.startInactivityTimer(scene);
                    }
                };
            } else {
                reply2.style.display = 'none'; // Hide the button if no options
            }
        }
    };
})(window);