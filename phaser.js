let gameState = {};

// Phaser Start Scene
class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Load any assets required for the start scene
        this.load.image('bg', 'https://static.vecteezy.com/system/resources/previews/024/387/936/large_2x/fantasy-magical-enchanted-fairy-tale-landscape-fabulous-fairytale-garden-mysterious-background-and-glowing-in-night-magical-fantasy-fairy-tale-scenery-night-in-a-forest-generate-ai-free-photo.jpg');
        this.load.image('startButton', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/Potion_I.png'); // Replace with the actual path to your start button image
    }

    create() {
        // Add a background
        gameState.background = this.add.image(0, 0, 'bg').setOrigin(0, 0).setScale(0.5);
        gameState.background.setDepth(0); // Set the depth of the background

        // Add a title
        this.add.text(800, 250, 'Start Game', { fontSize: '58px', fill: '#ffffff', fontFamily: 'Work Sans'}).setOrigin(0.5).setDepth(1);

        // Add a start button
        const startButton = this.add.image(800, 500, 'startButton').setInteractive().setDepth(1).setScale(0.1);
        startButton.on('pointerdown', () => {
            this.startGame();
        });

        // Add instructions or other UI elements as needed
        this.add.text(800, 750, 'Click to start!', { fontSize: '32px', fill: '#ffffff', fontFamily: 'Work Sans'}).setOrigin(0.5).setDepth(1);
    }

    startGame() {
        // Start the game scene
        this.scene.start('GameScene');
    }
}

// Phaser Game Scene
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('bg', 'https://static.vecteezy.com/system/resources/previews/024/387/936/large_2x/fantasy-magical-enchanted-fairy-tale-landscape-fabulous-fairytale-garden-mysterious-background-and-glowing-in-night-magical-fantasy-fairy-tale-scenery-night-in-a-forest-generate-ai-free-photo.jpg');
        this.load.image('bug1', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png');
        this.load.image('bug2', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_2.png');
        this.load.image('bug3', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_3.png');
        this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png');
        this.load.image('codey', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/pearl.png');
    }

    create() {
        gameState.background = this.add.image(0, 0, 'bg').setOrigin(0, 0).setScale(0.5);
        gameState.player = this.physics.add.sprite(800, 10, 'codey');
        gameState.player.setScale(0.1);
        gameState.background.setDepth(0); // Set the depth of the background

        const platforms = this.physics.add.staticGroup();
        platforms.create(800, 950, 'platform');

        gameState.player.setCollideWorldBounds(true);
        this.physics.add.collider(gameState.player, platforms);
        gameState.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (gameState.cursors.left.isDown) {
            gameState.player.setVelocityX(-160);
        } else if (gameState.cursors.right.isDown) {
            gameState.player.setVelocityX(160);
        } else {
            gameState.player.setVelocityX(0);
        }

        if (gameState.cursors.up.isDown) {
            gameState.player.setVelocityY(-160);
        } else {
            gameState.player.setVelocityY(260);
        }
    }
}

// Create the Phaser game instance
const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 1000,
    scene: [StartScene, GameScene], // Include both start and game scenes
    parent: 'game-container', // Attach Phaser to the game container div
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            enableBody: true,
        },
    },
};

const game = new Phaser.Game(config);
/* Bug game
function preload() {
  this.load.image('bug1', 'https://content.codecademy.com/courses/learn-phaser/Bug%20Invaders/bug_1.png');
  this.load.image('bug2', 'https://content.codecademy.com/courses/learn-phaser/Bug%20Invaders/bug_2.png');
  this.load.image('bug3', 'https://content.codecademy.com/courses/learn-phaser/Bug%20Invaders/bug_3.png');
  this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png');
  this.load.image('codey', 'https://content.codecademy.com/courses/learn-phaser/Bug%20Invaders/codey.png');
  this.load.image('bugPellet', 'https://content.codecademy.com/courses/learn-phaser/Bug%20Invaders/bugPellet.png');
  this.load.image('bugRepellent', 'https://content.codecademy.com/courses/learn-phaser/Bug%20Invaders/bugRepellent.png');
}

// Helper Methods below:
// sortedEnemies() returns an array of enemy sprites sorted by their x coordinate
function sortedEnemies(){
  const orderedByXCoord = gameState.enemies.getChildren().sort((a, b) => a.x - b.x);
  return orderedByXCoord;
}
// numOfTotalEnemies() returns the number of total enemies 
function numOfTotalEnemies() {
	const totalEnemies = gameState.enemies.getChildren().length;
  return totalEnemies;
}

const gameState = {
  enemyVelocity: 1
};

function create() {
  // When gameState.active is true, the game is being played and not over. When gameState.active is false, then it's game over
  gameState.active = true;

  // Initialize score and high score
  gameState.score = 0;
  gameState.highScore = localStorage.getItem('highScore') || 0;

  // Display high score
  gameState.highScoreText = this.add.text(15, 15, `High Score: ${gameState.highScore}`, { fontSize: '15px', fill: '#000000' });

  // When gameState.active is false, the game will listen for a pointerup event and restart when the event happens
  this.input.on('pointerup', () => {
    if (gameState.active === false) {
      this.scene.restart();
    }
  });

  // Creating static platforms
  const platforms = this.physics.add.staticGroup();
  platforms.create(225, 490, 'platform').setScale(1, .3).refreshBody();

  // Displays the initial number of bugs, this value is initially hardcoded as 24 
  gameState.scoreText = this.add.text(175, 482, 'Bugs Left: 24', { fontSize: '15px', fill: '#000000' });

  // Uses the physics plugin to create Codey
  gameState.player = this.physics.add.sprite(225, 450, 'codey').setScale(.5);

  // Create Collider objects
  gameState.player.setCollideWorldBounds(true);
  this.physics.add.collider(gameState.player, platforms);
  
  // Creates cursor objects to be used in update()
  gameState.cursors = this.input.keyboard.createCursorKeys();

  // Add new code below:
  gameState.enemies = this.physics.add.group();
  const bugTypes = ['bug1', 'bug2', 'bug3'];
  for(let yVal = 1; yVal < 4; yVal++){
    for(let xVal = 1; xVal < 9; xVal++){
      const bugType = Phaser.Utils.Array.GetRandom(bugTypes);
      gameState.enemies.create(50*xVal, 50*yVal, bugType).setScale(.6).setGravityY(-200)
    }
  }

  const pellets = this.physics.add.group();
  function genPellet() {
    const randomBug = Phaser.Utils.Array.GetRandom(gameState.enemies.getChildren());
    pellets.create(randomBug.x, randomBug.y, 'bugPellet');
  }

  gameState.pelletsLoop = this.time.addEvent({
    delay: 300,
    callback: genPellet,
    callbackScope: this,
    loop: true,
  });

  function destroyPellet(pellet) {
    pellet.destroy();
  }

  this.physics.add.collider(pellets, platforms, destroyPellet);

  this.physics.add.collider(pellets, gameState.player, () => {
    gameState.enemyVelocity = 1;
    gameState.active = false;
    gameState.pelletsLoop.destroy();
    this.physics.pause();
    this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });
    this.add.text(152, 270, 'Click to Restart', { fontSize: '15px', fill: '#000000' });

    // Update high score if current score is higher
    if (gameState.score > gameState.highScore) {
      gameState.highScore = gameState.score;
      localStorage.setItem('highScore', gameState.highScore);
      gameState.highScoreText.setText(`High Score: ${gameState.highScore}`);
    }
  });

  gameState.bugRepellent = this.physics.add.group();

  this.physics.add.collider(gameState.enemies, gameState.bugRepellent, (bug, repellent) => {
    bug.destroy();
    repellent.destroy();
    gameState.score += 10; // Increment score
    gameState.scoreText.setText(`Bugs Left: ${numOfTotalEnemies()}`);
  });

  this.physics.add.collider(gameState.enemies, gameState.player, () => {
    gameState.active = false;
    gameState.enemyVelocity = 1;
    this.physics.pause();
    this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });

    // Update high score if current score is higher
    if (gameState.score > gameState.highScore) {
      gameState.highScore = gameState.score;
      localStorage.setItem('highScore', gameState.highScore);
      gameState.highScoreText.setText(`High Score: ${gameState.highScore}`);
    }
  });
}

function update() {
  if (gameState.active) {
    // If the game is active, then players can control Codey
    if (gameState.cursors.left.isDown) {
      gameState.player.setVelocityX(-160);
    } else if (gameState.cursors.right.isDown) {
      gameState.player.setVelocityX(160);
    } else {
      gameState.player.setVelocityX(0);
    }

    // Execute code if the spacebar key is pressed
    if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space)) {
      gameState.bugRepellent.create(gameState.player.x, gameState.player.y, 'bugRepellent').setGravityY(-400);
    }

    // Add logic for winning condition and enemy movements below:
    if (numOfTotalEnemies() === 0) {
      gameState.enemyVelocity = 1;
      gameState.active = false;
      this.physics.pause();
      this.add.text(152, 290, 'You won!', { fontSize: '15px', fill: '#000000' });

      // Update high score if current score is higher
      if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('highScore', gameState.highScore);
        gameState.highScoreText.setText(`High Score: ${gameState.highScore}`);
      }
    } else {
      gameState.enemies.getChildren().forEach(bug => {
        bug.x += gameState.enemyVelocity;
      });

      // Update leftMostBug and rightMostBug
      gameState.leftMostBug = sortedEnemies()[0];
      gameState.rightMostBug = sortedEnemies()[sortedEnemies().length - 1];

      // Check for boundary collision and reverse direction
      if (gameState.leftMostBug.x < 10 || gameState.rightMostBug.x > 440) {
        gameState.enemyVelocity *= -1;
        gameState.enemies.getChildren().forEach(enemy => {
          enemy.y += 10;
        });
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 450,
  height: 500,
  backgroundColor: "b9eaff",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      enableBody: true,
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);
*/