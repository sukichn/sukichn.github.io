// Scene 1 dialogue 
const pages = [
    {
        character: 'Balu',
        page: 1,
        narrative: "Balu: Hello there!",
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
            { option: "I have what you asked for.", nextPage: 3 },
            { option: 'Not sure...', nextPage: 4 },
        ]
    },
    {
        character: 'Balu',
        page: 3,
        narrative: "Balu: Oh great! Have you collected the herbs?",
        options: [
            { option: 'Yes, here they are.', nextPage: 6 },
            { option: 'Not yet', closeDialogue: true },
        ]
    },
    {
        character: 'Balu',
        page: 4,
        narrative: 'Balu: Can you help me?',
        options: [
            { option: "Sure!", nextPage: 5 },
            { option: 'Not now', closeDialogue: true },
        ]
    },
    // Task assignment stage
    {
        character: 'Balu',
        page: 5,
        narrative: 'Balu: Great! Come back to me once you have collected 5 herbs.',
        options: [
            { option: 'Will do!', closeDialogue: true },
        ]
    },
    // Task completion stage
    {
        character: 'Balu',
        page: 6,
        narrative: 'Balu: Thank you! Here is your reward. Do you need anything else?',
        options: [
            { option: 'Any more tasks?', nextPage: 7 },
            { option: 'No, that’s all for now.', closeDialogue: true },
        ]
    },
    // Additional tasks or dialogue
    {
        character: 'Balu',
        page: 7,
        narrative: 'Balu: Actually, yes! Could you deliver this message to the wizard?',
        options: [
            { option: 'Of course!', nextPage: 8 },
            { option: 'Maybe later', closeDialogue: true },
        ]
    },
    {
        character: 'Balu',
        page: 8,
        narrative: 'Balu: Excellent! Please hurry, it’s urgent.',
        options: [
            { option: 'I will!', closeDialogue: true },
        ]
    },
    // Add more pages as needed
];

