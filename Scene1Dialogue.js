// Scene 1 dialogue 
const pages = [
    {
        character: 'Player',
        page: 1,
        narrative: "You: Oh! What's this?",
        options: [
            { option: 'Say Hi', nextPage: 2 },
            { option: 'Ignore', closeDialogue: true },
        ]
    },
    {
        character: 'Balu',
        page: 2,
        narrative: 'Balu: Hello there, Where are you headed?',
        options: [
            { option: "I'm on an adventure", nextPage: 3 },
            { option: 'Not sure...', nextPage: 4 },
        ]
    },
    {
        character: 'Balu',
        page: 3,
        narrative: 'Balu: Oh, how exciting! Make sure you get a map in the next village!',
        options: [
            { option: "Oh, thank you!", nextPage: 5 },
        ]
    },
    {
        character: 'Balu',
        page: 4,
        narrative: 'Balu: You have to be careful wandering about...',
        options: [
            { option: "I'll be careful.", nextPage: 5 },
        ]
    },
    // Task assignment stage
    {
        character: 'Balu',
        page: 5,
        narrative: 'Balu: I have a task for you. Can you collect 5 herbs for me?',
        options: [
            { option: 'Sure!', nextPage: 6 },
            { option: 'Not now', closeDialogue: true },
        ]
    },
    {
        character: 'Balu',
        page: 6,
        narrative: 'Balu: Great! Come back to me once you have collected 5 herbs.',
        options: [
            { option: 'Will do!', closeDialogue: true },
        ]
    },
    // Task completion stage
    {
        character: 'Balu',
        page: 7,
        narrative: 'Balu: Have you collected the herbs?',
        options: [
            { option: 'Yes, here they are.', nextPage: 8 },
            { option: 'Not yet', closeDialogue: true },
        ]
    },
    {
        character: 'Balu',
        page: 8,
        narrative: 'Balu: Thank you! Here is your reward. Do you need anything else?',
        options: [
            { option: 'Any more tasks?', nextPage: 9 },
            { option: 'No, that’s all for now.', closeDialogue: true },
        ]
    },
    // Additional tasks or dialogue
    {
        character: 'Balu',
        page: 9,
        narrative: 'Balu: Actually, yes! Could you deliver this message to the wizard?',
        options: [
            { option: 'Of course!', nextPage: 10 },
            { option: 'Maybe later', closeDialogue: true },
        ]
    },
    {
        character: 'Balu',
        page: 10,
        narrative: 'Balu: Excellent! Please hurry, it’s urgent.',
        options: [
            { option: 'I will!', closeDialogue: true },
        ]
    },
    // Add more pages as needed
];

