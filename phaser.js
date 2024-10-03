let gameState = {};

function preload() {
    this.load.image('bg', 'https://static.vecteezy.com/system/resources/previews/024/387/936/large_2x/fantasy-magical-enchanted-fairy-tale-landscape-fabulous-fairytale-garden-mysterious-background-and-glowing-in-night-magical-fantasy-fairy-tale-scenery-night-in-a-forest-generate-ai-free-photo.jpg');
  this.load.image('bug1', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png')
  this.load.image('bug2', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_2.png')
  this.load.image('bug3', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_3.png')
  this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png')
  this.load.image('codey', 'https://content.codecademy.com/courses/learn-phaser/physics/codey.png')
}

function create() {
  // Add your code below: 
  gameState.background = this.add.image(0, 0, 'bg');
  gameState.player = this.physics.add.sprite(500,10,'codey');
  gameState.background.setOrigin(0, 0);
  gameState.background.setScale(0.38);
  const platforms = this.physics.add.staticGroup();

  platforms.create(500, 580, 'platform');

  gameState.player.setCollideWorldBounds(true);

  this.physics.add.collider(gameState.player, platforms);
}

function update() {
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
