(function(global) {
    // Load spritesheet
 global.loadBugAssets = function(scene) {
     scene.load.spritesheet('bug', 'https://raw.githubusercontent.com/sukichn/sukichn.github.io/refs/heads/main/Resources/css/Images/bug-sprite.png', {
         frameWidth: 257,
         frameHeight: 176,
     });
 };

 // Create codey animations
 global.createBugAnimations = function(scene) {
     scene.anims.create({
         key: 'burrow',
         frames: scene.anims.generateFrameNumbers('bug', { start: 0, end: 11 }),
         frameRate: 7,
         repeat: -1,
         yoyo: true,
     });

// Play animation

         
 };


})(window);