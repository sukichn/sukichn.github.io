
// Scene 1 dialogue 
const pages = [
    {
        character: 'Friend',
        page: 1,
        narrative: 'Friend: Hello?',
        options: [
            { option: 'Say Hi', nextPage: 2 },
            { option: 'Ignore', closeDialogue: true },
        ]
    },
    {
        character: 'Friend',
        page: 2,
        narrative: 'Friend: Where are you headed?',
        options: [
            { option: "I'm on an adventure", nextPage: 3 },
            { option: 'Not sure...', nextPage: 4 },
        ]
    },
    {
        character: 'Friend',
        page: 3,
        narrative: 'Friend: Visit the wizard in the forest for help!',
        options: [
            { option: 'Ok, thank you!', closeDialogue: true },
        ]
    },
    {
        character: 'Friend',
        page: 4,
        narrative: 'Friend: You have to be careful wandering about...',
        options: [
            { option: "I'll be careful.", closeDialogue: true },
        ]
    },
   
    // Add more pages as needed
];