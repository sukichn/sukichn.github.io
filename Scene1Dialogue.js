
// Scene 1 dialogue 
const pages = [
    {
        character: 'Balu',
        page: 1,
        narrative: 'Balu: Hello?',
        options: [
            { option: 'Say Hi', nextPage: 2 },
            { option: 'Ignore', closeDialogue: true },
        ]
    },
    {
        character: 'Balu',
        page: 2,
        narrative: 'Balu: Where are you headed?',
        options: [
            { option: "I'm on an adventure", nextPage: 3 },
            { option: 'Not sure...', nextPage: 4 },
        ]
    },
    {
        character: 'Balu',
        page: 3,
        narrative: 'Balu: Visit the wizard in the forest for help!',
        options: [
            { option: 'Ok, thank you!', closeDialogue: true },
        ]
    },
    {
        character: 'Balu',
        page: 4,
        narrative: 'Balu: You have to be careful wandering about...',
        options: [
            { option: "I'll be careful.", closeDialogue: true },
        ]
    },
   
    // Add more pages as needed
];