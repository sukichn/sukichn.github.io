//Close navigation dropdown when clicking anywhere on document except for on dropbtn and dropdown
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.dropdown-content');
    const dropbtn = document.querySelector('.dropbtn');
    
    if (dropdown.style.display === 'block' && !dropbtn.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

//Random fortunes generated in Hero Section when page is loaded
let fortunes = ['"An unexpected potion will bring excitement into your life." - Seraphina Nightingale',
    '"Brewing success is in your future. Keep stirring!" - Percy Blackthorn',
    '"A magical elixir will unlock new opportunities for you." - Esme Silverthorne',
    '"A dash of courage and a sprinkle of creativity will lead to enchanting discoveries." - Thaddeus Evergreen',
    '"Your potion-making skills will charm everyone around you." - Morgana Starling'
];

let fortune = document.getElementById('fortune');

function fortuneSelector(){
    let randomFortune = Math.floor(Math.random() * fortunes.length);
    return fortunes[randomFortune];
};

function showFortune(){
    fortune.innerHTML = fortuneSelector();
};

document.addEventListener('DOMContentLoaded', showFortune);

// Function to add touch support for scaling effect
function addTouchSupport(element) {
    const image = element.querySelector('.potion-image');

    element.addEventListener('touchstart', function() {
        element.style.transform = 'scale(1.01)'; // Apply scale effect to the container
        image.style.transform = 'scale(1.03)'; // Apply scale effect to the image
    });

    element.addEventListener('touchend', function() {
        element.style.transform = ''; // Reset scale effect on the container
        image.style.transform = ''; // Reset scale effect on the image
    });

    element.addEventListener('touchcancel', function() {
        element.style.transform = ''; // Reset scale effect on the container
        image.style.transform = ''; // Reset scale effect on the image
    });
}

// Apply the touch support to all elements with the class 'box'
document.querySelectorAll('.box').forEach(addTouchSupport);

// RANDOM POTION GENERATOR
let potionImage1 = document.getElementById("potion1");
let potionImage2 = document.getElementById("potion2");
let potionImage3 = document.getElementById("potion3");
let fortuneButton = document.getElementById("fortuneButton");
let fortuneMessage = document.getElementById("fortuneMessage");

// Array of potion images
const potionImages = [
    "Resources/css/Images/Potion_I.png",
    "Resources/css/Images/Potion_II.png",
    "Resources/css/Images/Potion_III.png",
    "Resources/css/Images/Potion_IV.png"
];

// Define a variable to keep track of the number of tries
let tryCount = 0;

// Function to generate a random potion
function generateRandomPotion() {
    // Check if the number of tries is less than 10
    if (tryCount < 10 && !fortuneButton.disabled) {
        // Increment the try count
        tryCount++;
        document.getElementById("tryCountDisplay").textContent = "Number of tries: " + tryCount + "/10";

        // Disable the button at the start of the animation
        fortuneButton.disabled = true;
        fortuneButton.style.backgroundColor = "lightgrey";

        // Start the slot machine effect
        const duration = 700; // Duration of the animation in milliseconds for each image
        const pause = 400; // Pause duration between each image start

        let startTime = Date.now();

        // Function to start the scrolling animation for an image
        function startScrolling(imageElement) {
            imageElement.classList.add('scrolling');
        }

        // Function to stop the scrolling animation and set the final image
        function stopScrolling(imageElement) {
            imageElement.classList.remove('scrolling');
            const randomIndex = Math.floor(Math.random() * potionImages.length);
            imageElement.src = potionImages[randomIndex];
            return randomIndex;
        }

        // Function to update images sequentially with a pause
        function updateImagesSequentially() {
            // Scroll and stop the first image
            startScrolling(potionImage1);
            setTimeout(() => {
                const randomIndex1 = stopScrolling(potionImage1);

                // Pause before starting the second image
                setTimeout(() => {
                    // Scroll and stop the second image
                    startScrolling(potionImage2);
                    setTimeout(() => {
                        const randomIndex2 = stopScrolling(potionImage2);

                        // Pause before starting the third image
                        setTimeout(() => {
                            // Scroll and stop the third image
                            startScrolling(potionImage3);
                            setTimeout(() => {
                                const randomIndex3 = stopScrolling(potionImage3);

                                // Display the fortune message
                                if (randomIndex1 === randomIndex2 && randomIndex2 === randomIndex3) {
                                    if (randomIndex1 === 0) {
                                        fortuneMessage.innerHTML = "Congratulations! You've won Potion I!";
                                    } else if (randomIndex1 === 1) {
                                        fortuneMessage.innerHTML = "Congratulations! You've won Potion II!";
                                    } else if (randomIndex1 === 2) {
                                        fortuneMessage.innerHTML = "Congratulations! You've won Potion III!";
                                    } else {
                                        fortuneMessage.innerHTML = "Congratulations! You've won Potion IV!";
                                    }
                                    // Keep the button disabled after winning
                                    fortuneButton.disabled = true;
                                    fortuneButton.style.backgroundColor = "lightgrey";
                                } else {
                                    fortuneMessage.innerHTML = "Better luck next time! No matching potions this time.";
                                    // Re-enable the button after the animation
                                    fortuneButton.disabled = false;
                                    fortuneButton.style.backgroundColor = "";
                                }
                            }, duration);
                        }, pause);
                    }, duration);
                }, pause);
            }, duration);
        }

        updateImagesSequentially();
    } else {
        fortuneMessage.innerHTML = "You've reached the maximum number of tries.";
        fortuneButton.disabled = true;
        fortuneButton.style.backgroundColor = "lightgrey";
    }
}

// Event listener for the "Try your luck" button
fortuneButton.addEventListener("click", generateRandomPotion);

//*Shop item Handlebars

const templateElement = document.getElementById("templateHB");
const templateSource = templateElement.innerHTML;
const template = Handlebars.compile(templateSource);

const context = {
    categories: [
        {
            class: "potions",
            title: "Potion & Tinctures",
            subtitle: "Explore the world of Herbal Alchemy and Healing Elixirs",
            items: [
                {
                    image: "Resources/css/Images/Potion_I.png",
                    name: 'Potion I',
                    description: 'Mix of lantadyme and potato cactus in a vial of water',
                },
                {
                    image: "Resources/css/Images/Potion_II.png",
                    name: 'Potion II',
                    description: 'Essence of Celestial Lotus infused with Ethereal Saffron',
                },
                {
                    image: "Resources/css/Images/Potion_III.png",
                    name: 'Potion III',
                    description: 'Imbued with the essence of Whispering Fern and Glowpetal',
                },
                {
                    image: "Resources/css/Images/Potion_IV.png",
                    name: 'Potion IV',
                    description: 'Mix of Moonlight Blossom and Rejuvenating Moss in a vial of oil',
                },
                {
                    image: "Resources/css/Images/Potion_IV.png",
                    name: 'Potion V',
                    description: 'Mix of Moonlight Blossom and Rejuvenating Moss in a vial of oil',
                }
            ]
        },
        {
            class: "magic-items",
            title: "Magical Objects",
            subtitle: "Discover our Collection of Mystical Artifacts and Arcane Relics",
            items: [
                {
                    image: "Resources/css/Images/Enchanted_hat_I.png",
                    name: 'Enchanted Hat I',
                    description: 'Magical headpiece from the Enchanted Robes set, offering mystical protection',
                },
                {
                    image: "Resources/css/Images/Enchanted_hat_II.png",
                    name: 'Enchanted Hat II',
                    description: 'A headpiece with the protective charm of Luminescent Moonweave',
                },
                {
                    image: "Resources/css/Images/Enchanted_robes_I.png",
                    name: 'Enchanted Robes I',
                    description: 'Embrace mystical elegance and arcane protection with this bewitched attire',
                },
                {
                    image: "Resources/css/Images/Enchanted_robes_II.png",
                    name: 'Enchanted Robes II',
                    description: 'Unparalleled mystic defense with this iteration of our magical robes',
                },
            ]
        }
    ]
};


const compiledHtml = template(context);
document.getElementById("information").innerHTML = compiledHtml;

// Header scrolling
const header = document.querySelector('header');

// Listen for the scroll event
window.addEventListener('scroll', () => {
  // Check if the user has scrolled beyond a certain point, for example, 100px from the top
  if (window.scrollY > 100) {
    // Add a class to the header when the user has scrolled beyond the specified point
    header.classList.add('scrolled');
    
  } else {
    // Remove the class when the user scrolls back up
    header.classList.remove('scrolled');
  
  }
});



