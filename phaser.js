let gameState = {};

function preload() {
    this.load.image('bg', 'https://static.vecteezy.com/system/resources/previews/024/387/936/large_2x/fantasy-magical-enchanted-fairy-tale-landscape-fabulous-fairytale-garden-mysterious-background-and-glowing-in-night-magical-fantasy-fairy-tale-scenery-night-in-a-forest-generate-ai-free-photo.jpg');
  this.load.image('bug1', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png')
  this.load.image('bug2', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_2.png')
  this.load.image('bug3', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_3.png')
  this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png')
  this.load.image('codey', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/pearl.png')
}

function create() {
  // Add your code below: 
  gameState.background = this.add.image(0, 0, 'bg');
  gameState.player = this.physics.add.sprite(500,10,'codey');
  gameState.player.setScale(0.1);
  gameState.background.setOrigin(0, 0);
  gameState.background.setScale(0.38);
  const platforms = this.physics.add.staticGroup();

  platforms.create(500, 580, 'platform');

  gameState.player.setCollideWorldBounds(true);

  this.physics.add.collider(gameState.player, platforms);
  gameState.cursors=this.input.keyboard.createCursorKeys();
}

function update() {
    if (gameState.cursors.left.isDown){
        gameState.player.setVelocityX(-160)
      }
      else if (gameState.cursors.right.isDown){
        gameState.player.setVelocityX(160)
      }
      else{
        gameState.player.setVelocityX(0);
      };
      if (gameState.cursors.up.isDown){
        gameState.player.setVelocityY(-160)
      }
      else{
        gameState.player.setVelocityY(260);
      };
}

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 1000,
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
}

const game = new Phaser.Game(config)

/* Bug game
function preload() {
  this.load.image('bug1', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png')
  this.load.image('bug2', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_2.png')
  this.load.image('bug3', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_3.png')
  this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png')
  this.load.image('codey', 'https://content.codecademy.com/courses/learn-phaser/physics/codey.png')
}

const gameState = {
  score: 0
};

function create() {
  gameState.player = this.physics.add.sprite(225, 450, 'codey').setScale(.5);
  
  const platforms = this.physics.add.staticGroup();

  platforms.create(225, 510, 'platform');

  gameState.scoreText = this.add.text(195, 485, 'Score: 0', { fontSize: '15px', fill: '#000000' })

  gameState.player.setCollideWorldBounds(true);

  this.physics.add.collider(gameState.player, platforms);
  
	gameState.cursors = this.input.keyboard.createCursorKeys();

  const bugs = this.physics.add.group();

  function bugGen () {
    const xCoord = Math.random() * 450;
    bugs.create(xCoord, 10, 'bug1');
  }

  const bugGenLoop = this.time.addEvent({
    delay: 100,
    callback: bugGen,
    callbackScope: this,
    loop: true,
  });

  this.physics.add.collider(bugs, platforms, function (bug) {
    bug.destroy();
    gameState.score += 10;
    gameState.scoreText.setText(`Score: ${gameState.score}`)
  });
  
  this.physics.add.collider(gameState.player, bugs, () => {
    bugGenLoop.destroy();
    this.physics.pause();
    this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });
    this.add.text(152, 270, 'Click to Restart', { fontSize: '15px', fill: '#000000' });
    
		// Add your code below:
		this.input.on('pointerup', () => {
      gameState.score = 0;
      this.scene.restart();
    });
  });
}

function update() {
    if (gameState.cursors.left.isDown){
        gameState.player.setVelocityX(-160)
      }
      else if (gameState.cursors.right.isDown){
        gameState.player.setVelocityX(160)
      }
      else{
        gameState.player.setVelocityX(0);
      };
      if (gameState.cursors.up.isDown){
        gameState.player.setVelocityY(-160)
      }
      else if (gameState.cursors.down.isDown){
        gameState.player.setVelocityY(160)
      }
      else{
        gameState.player.setVelocityY(0);
      };
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