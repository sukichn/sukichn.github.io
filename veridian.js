//Random fortunes generated in Hero Section when page is loaded
let fortunes = ['"An unexpected potion will bring excitement into your life."',
    '"Brewing success is in your future. Keep stirring!"',
    '"A magical elixir will unlock new opportunities for you."',
    '"A dash of courage and a sprinkle of creativity will lead to enchanting discoveries."',
    '"Your potion-making skills will charm everyone around you."'
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

//Win a potion
let potionImage1 = document.getElementById("potion1");
let potionImage2 = document.getElementById("potion2");
let potionImage3 = document.getElementById("potion3");
let fortuneButton = document.getElementById("fortuneButton");
let fortuneMessage = document.getElementById("fortuneMessage");

// Array of potion images
const potionImages = [
    "Resources/css/Images/Potion_I.png",
    "Resources/css/Images/Potion_II.png",
    "Resources/css/Images/Potion_III.png"
  ];
  
  // Function to generate a random potion
  function generateRandomPotion() {
    // Generate random potion indices
    const randomIndex1 = Math.floor(Math.random() * potionImages.length);
    const randomIndex2 = Math.floor(Math.random() * potionImages.length);
    const randomIndex3 = Math.floor(Math.random() * potionImages.length);
  
    // Set the potion images based on the random indices
    potionImage1.src = potionImages[randomIndex1];
    potionImage2.src = potionImages[randomIndex2];
    potionImage3.src = potionImages[randomIndex3];
  
    // Check if all potion images match
    if (randomIndex1 === randomIndex2 && randomIndex2 === randomIndex3) {
      fortuneMessage.innerHTML="Congratulations! You've won a potion!";
    } else {
    fortuneMessage.innerHTML="Better luck next time! No matching potions this time.";
    }
  }
  
  // Event listener for the "Try your luck" button
  fortuneButton.addEventListener("click", generateRandomPotion);

