/*-------- Asset Initialization and Setup --------*/

// Blueprints
UTIL.asset.queue('blueprint', 'json/blueprints/tanks.json');
UTIL.asset.queue('blueprint', 'json/blueprints/destructibles.json');

// Terrain images
TerrainImages = new ImageLibrary();
UTIL.asset.queue('image', ['testmap', 'images/testmap.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_02', 'images/terrain/dirt_and_grass/dirt_and_grass_02.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_03', 'images/terrain/dirt_and_grass/dirt_and_grass_03.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_04', 'images/terrain/dirt_and_grass/dirt_and_grass_04.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_06', 'images/terrain/dirt_and_grass/dirt_and_grass_06.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_07', 'images/terrain/dirt_and_grass/dirt_and_grass_07.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_08', 'images/terrain/dirt_and_grass/dirt_and_grass_08.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_09', 'images/terrain/dirt_and_grass/dirt_and_grass_09.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_10', 'images/terrain/dirt_and_grass/dirt_and_grass_10.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_11', 'images/terrain/dirt_and_grass/dirt_and_grass_11.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_13', 'images/terrain/dirt_and_grass/dirt_and_grass_13.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_14', 'images/terrain/dirt_and_grass/dirt_and_grass_14.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_15', 'images/terrain/dirt_and_grass/dirt_and_grass_15.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_16', 'images/terrain/dirt_and_grass/dirt_and_grass_16.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_17', 'images/terrain/dirt_and_grass/dirt_and_grass_17.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_18', 'images/terrain/dirt_and_grass/dirt_and_grass_18.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_19', 'images/terrain/dirt_and_grass/dirt_and_grass_19.png', TerrainImages]);
UTIL.asset.queue('image', ['dirt_and_grass_20', 'images/terrain/dirt_and_grass/dirt_and_grass_20.png', TerrainImages]);

// Tank images
TankImages = new ImageLibrary();
UTIL.asset.queue('image', ['jagdpanther_turret', 'images/tanks/jagdpanther/turret.png', TankImages]);
UTIL.asset.queue('image', ['jagdpanther_chassis', 'images/tanks/jagdpanther/chassis.png', TankImages]);
UTIL.asset.queue('image', ['m4_sherman_turret', 'images/tanks/m4_sherman/turret.png', TankImages]);
UTIL.asset.queue('image', ['m4_sherman_chassis', 'images/tanks/m4_sherman/chassis.png', TankImages]);
UTIL.asset.queue('image', ['m4_sherman_turret_blue', 'images/tanks/m4_sherman_blue/turret.png', TankImages]);
UTIL.asset.queue('image', ['m4_sherman_chassis_blue', 'images/tanks/m4_sherman_blue/chassis.png', TankImages]);
UTIL.asset.queue('image', ['heavy_turret', 'images/tanks/heavy/turret.png', TankImages]);
UTIL.asset.queue('image', ['heavy_chassis', 'images/tanks/heavy/chassis.png', TankImages]);

// Projectile images
ProjectileImages = new ImageLibrary();
UTIL.asset.queue('image', ['default', 'images/projectiles/default.png', ProjectileImages]);

// Powerup images
PowerUpImages = new ImageLibrary();
UTIL.asset.queue('image', ['random', 'images/powerups/random.png', PowerUpImages]);
UTIL.asset.queue('image', ['rapid-fire', 'images/powerups/rapid-fire.png', PowerUpImages]);
UTIL.asset.queue('image', ['haste', 'images/powerups/haste.png', PowerUpImages]);
UTIL.asset.queue('image', ['faster-projectile', 'images/powerups/faster-projectile.png', PowerUpImages]);
UTIL.asset.queue('image', ['increased-armor', 'images/powerups/increased-armor.png', PowerUpImages]);
UTIL.asset.queue('image', ['increased-damage', 'images/powerups/increased-damage.png', PowerUpImages]);
UTIL.asset.queue('image', ['aphotic-shield', 'images/powerups/aphotic-shield.png', PowerUpImages]);
UTIL.asset.queue('image', ['reactive-armor', 'images/powerups/reactive-armor.png', PowerUpImages]);
UTIL.asset.queue('image', ['regeneration', 'images/powerups/regeneration.png', PowerUpImages]);
UTIL.asset.queue('image', ['ammo', 'images/powerups/ammo.png', PowerUpImages]);
UTIL.asset.queue('image', ['projectile-barrier', 'images/powerups/projectile-barrier.png', PowerUpImages]);
UTIL.asset.queue('image', ['return', 'images/powerups/return.png', PowerUpImages]);
UTIL.asset.queue('image', ['multi-shot', 'images/powerups/multi-shot.png', PowerUpImages]);

// Destructible images
DestructibleImages = new ImageLibrary();
UTIL.asset.queue('image', ['brick_explosive', 'images/destructibles/brick-explosive.png', DestructibleImages]);
UTIL.asset.queue('image', ['wall_rubber', 'images/destructibles/wall-rubber.png', DestructibleImages]);
UTIL.asset.queue('image', ['heavy_rubber', 'images/destructibles/heavy-rubber.png', DestructibleImages]);
UTIL.asset.queue('image', ['concrete', 'images/destructibles/concrete.png', DestructibleImages]);
UTIL.asset.queue('image', ['riveted_iron', 'images/destructibles/riveted-iron.png', DestructibleImages]);

// Attachment images
AttachmentImages = new ImageLibrary();
UTIL.asset.queue('image', ['increased-damage', 'images/attachments/turret/increased-damage.png', AttachmentImages]);
UTIL.asset.queue('image', ['increased-armor', 'images/attachments/chassis/increased-armor.png', AttachmentImages]);

// Editor images
EditorImages = new ImageLibrary();
UTIL.asset.queue('image', ['starting-point', 'images/editor/starting-point.png', EditorImages]);

// Spritesheet images
SpriteSheetImages = new ImageLibrary();
UTIL.asset.queue('image', ['explosion', 'images/spritesheets/explosion.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['volumetric_explosion', 'images/spritesheets/volumetric_explosion.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['volumetric_explosion_2', 'images/spritesheets/volumetric_explosion_2.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['aphotic_shield', 'images/spritesheets/aphotic_shield.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['heavy_recoil', 'images/tanks/heavy/recoil.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['jagdpanther_recoil', 'images/tanks/jagdpanther/recoil.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['m4_sherman_recoil', 'images/tanks/m4_sherman/recoil.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['m4_sherman_blue_recoil', 'images/tanks/m4_sherman_blue/recoil.png', SpriteSheetImages]);

// BGM
var backgroundMusic = new Audio();
UTIL.asset.queue('audio', ['sounds/bgm.wav', true, 0.15, backgroundMusic]);

// Sound effects
fireSound         = new SoundPool('sounds/turret_fire.wav', 0.12, 20);
explodeSound      = new SoundPool('sounds/explosion.wav', 0.1, 20);
d_explodeSound    = new SoundPool('sounds/destructible_hit.wav', 0.1, 20);
d_destroyedSound  = new SoundPool('sounds/destructible_destroyed.wav', 0.2, 10);
t_destroyedSound  = new SoundPool('sounds/tank_destroyed.wav', 0.2, 10);
t_destroyedSound2 = new SoundPool('sounds/tank_destroyed2.wav', 0.2, 10);
t_destroyedSound3 = new SoundPool('sounds/tank_destroyed3.wav', 0.2, 10);
pick_powerupSound = new SoundPool('sounds/pick-powerup.wav', 0.2, 20);
    
UTIL.asset.queue('soundpool', fireSound);
UTIL.asset.queue('soundpool', explodeSound);
UTIL.asset.queue('soundpool', d_explodeSound);
UTIL.asset.queue('soundpool', d_destroyedSound);
UTIL.asset.queue('soundpool', t_destroyedSound);
UTIL.asset.queue('soundpool', t_destroyedSound2);
UTIL.asset.queue('soundpool', t_destroyedSound3);
UTIL.asset.queue('soundpool', pick_powerupSound);

// Init stat fields
STAT.add('total_shots_fired');
STAT.add('total_hits');
STAT.add('total_damage_dealt');
STAT.add('total_damage_taken');

// Map editor initiatlization
MAP.addPlaceable('destructible', 'brick_explosive');
MAP.addPlaceable('destructible', 'concrete');
MAP.addPlaceable('destructible', 'riveted_iron');
MAP.addPlaceable('destructible', 'wall_rubber');
MAP.addPlaceable('destructible', 'heavy_rubber');
MAP.addPlaceable('starting-point', 'starting-point');
MAP.addPlaceable('powerup', 'random');
MAP.addPlaceable('powerup', 'haste');
MAP.addPlaceable('powerup', 'ammo');
MAP.addPlaceable('powerup', 'projectile-barrier');
MAP.addPlaceable('powerup', 'aphotic-shield');
MAP.addPlaceable('powerup', 'increased-armor');
MAP.addPlaceable('powerup', 'reactive-armor');
MAP.addPlaceable('powerup', 'regeneration');
MAP.addPlaceable('powerup', 'rapid-fire');
MAP.addPlaceable('powerup', 'faster-projectile');
MAP.addPlaceable('powerup', 'increased-damage');
MAP.addPlaceable('powerup', 'return');
MAP.addPlaceable('powerup', 'multi-shot');

// the default map
testmap = new Map('default');
testmap.destructibles.push(['brick_explosive', 320, 240]);
testmap.destructibles.push(['wall_rubber', 352, 240]);
testmap.destructibles.push(['wall_rubber', 384, 240]);
testmap.destructibles.push(['concrete', 416, 240]);
testmap.destructibles.push(['riveted_iron', 448, 240]);
testmap.startingPoints.push(new StartingPoint(100, 100));
testmap.startingPoints.push(new StartingPoint(400, 300));
testmap.startingPoints.push(new StartingPoint(500, 300));
testmap.startingPoints.push(new StartingPoint(720, 362));

maps.push(testmap);
MAP.importFromString('testmap2|312:240,448:456,344:704,488:896,352:1032,512:1216,360:1376,536:1552,776:1736,976:1552,928:1208,1152:920|heavy_rubber:1368:608,heavy_rubber:1384:624,heavy_rubber:1456:744,heavy_rubber:1440:760,heavy_rubber:1440:840,heavy_rubber:1488:896,heavy_rubber:1408:976,heavy_rubber:1344:1040,heavy_rubber:1264:1120,heavy_rubber:1192:1192,heavy_rubber:1128:1256,heavy_rubber:1040:1232,heavy_rubber:1000:1144,heavy_rubber:920:1088,heavy_rubber:832:1048,heavy_rubber:784:1000|multi-shot:888:800,multi-shot:808:720,multi-shot:704:784,multi-shot:648:864,multi-shot:624:952,multi-shot:536:1040,multi-shot:464:1112,multi-shot:352:1144,multi-shot:240:1248,multi-shot:216:1352,multi-shot:216:1368,multi-shot:288:1456,multi-shot:384:1552,multi-shot:496:1664,rapid-fire:680:1640,rapid-fire:720:1600,rapid-fire:736:1584,rapid-fire:800:1520');

current_map = maps[0];

// show progress bar
$('.overlay').hide();
$('#progress').show();
var progressText = document.getElementById('progress-text');
var progressBar = document.getElementById('progress-bar');

var totalAssets = UTIL.asset.getTotalQueued();
var totalLoaded = UTIL.asset.getTotalLoaded();
var totalFailed = UTIL.asset.getTotalFailed();

// start loading assets
UTIL.asset.loadAll(function (item) {
    // everytime a queued item is loaded, updated the progressbar
    totalLoaded = UTIL.asset.getTotalLoaded();
    progressText.innerHTML = item;
    progressBar.value = (totalAssets / totalLoaded) * 100;
}, function (error) {
    // if we encountered an error while loading, log it
    totalFailed = UTIL.asset.getTotalFailed();
    console.log(error);
}, function () {
    // if everything has been loaded, go to main menu
    terrain = TerrainImages.get('testmap'); // default terrain
    $('#progress').hide();
    menu();
});
