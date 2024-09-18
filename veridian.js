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
    document.getElementById("tryCountDisplay").textContent = "Number of tries: " + tryCount;
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
        if (randomIndex1 === 0) {
          fortuneMessage.innerHTML = "Congratulations! You've won Potion I!";
        } else if (randomIndex1 === 1) {
          fortuneMessage.innerHTML = "Congratulations! You've won Potion II!";
        } else if (randomIndex1 === 2) {
          fortuneMessage.innerHTML = "Congratulations! You've won Potion III!";
        } else {
            fortuneMessage.innerHTML = "Congratulations! You've won Potion IV!";
          }
    // Disable the button after winning
    fortuneButton.disabled = true;
} else {
  fortuneMessage.innerHTML = "Better luck next time! No matching potions this time.";
}
} else {
fortuneMessage.innerHTML = "You've reached the maximum number of tries.";
}
}



  // Event listener for the "Try your luck" button
  fortuneButton.addEventListener("click", generateRandomPotion);

