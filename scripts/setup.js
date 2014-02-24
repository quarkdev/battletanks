/*-------- Asset Initialization and Setup --------*/

// Blueprints
UTIL.asset.queue('blueprint', ['tanks', 'json/blueprints/tanks.json']);
UTIL.asset.queue('blueprint', ['destructibles', 'json/blueprints/destructibles.json']);

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
UTIL.asset.queue('image', ['tree', 'images/destructibles/tree.png', DestructibleImages]);

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
MAP.addPlaceable('destructible', 'tree');
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
MAP.importFromJSON('{"name":"map with trees","powerups":[],"destructibles":[["tree",848,704],["tree",832,720],["tree",776,736],["tree",704,712],["tree",656,744],["tree",712,808],["tree",760,856],["tree",816,856],["tree",968,704],["tree",984,688],["tree",1000,640],["tree",1000,632],["tree",960,592],["tree",960,576],["tree",960,552],["tree",960,472],["tree",952,456],["tree",912,416],["tree",880,384],["tree",864,368],["tree",864,320],["tree",864,304],["tree",904,264],["tree",912,264],["tree",968,232],["tree",1032,184],["tree",1080,200],["tree",1264,440],["tree",1272,456],["tree",1312,496],["tree",1320,504],["tree",1384,536],["tree",1448,480],["tree",1432,480],["tree",1424,480],["tree",1384,472],["tree",1344,432],["tree",1344,416],["tree",1376,376],["tree",1416,336],["tree",1392,288],["tree",1376,272],["tree",1384,224],["tree",1432,160],["tree",1496,176],["tree",1440,208],["tree",1400,176],["tree",1376,192],["tree",1416,232],["tree",1432,256],["tree",1400,296],["tree",1424,336],["tree",1408,368],["tree",1392,384],["tree",1368,408],["tree",1320,456],["tree",1280,464],["tree",1248,448],["tree",1016,216],["tree",992,216],["tree",952,192],["tree",936,208],["tree",968,248],["tree",944,256],["tree",888,272],["tree",896,312],["tree",896,344],["tree",880,344],["tree",856,344],["tree",880,400],["tree",896,416],["tree",912,440],["tree",888,480],["tree",904,512],["tree",912,512],["tree",944,480],["tree",872,456],["tree",912,560],["tree",928,536],["tree",960,640],["tree",968,648],["tree",952,680],["tree",920,696],["tree",864,736],["tree",840,744],["tree",800,712],["tree",768,704],["tree",720,736],["tree",696,728],["tree",672,752],["tree",512,840],["tree",464,824],["tree",440,848],["tree",424,848],["tree",400,840],["tree",368,808],["tree",304,744],["tree",192,632],["tree",120,560],["tree",160,520],["tree",152,480],["tree",112,440],["tree",144,400],["tree",128,376],["tree",168,392],["tree",168,432],["tree",168,448],["tree",144,472],["tree",144,520],["tree",160,576],["tree",192,616],["tree",208,656],["tree",224,680],["tree",328,784],["tree",360,816],["tree",368,856],["tree",376,896],["tree",400,920],["tree",560,1080],["tree",600,1136],["tree",568,1168],["tree",552,1184],["tree",576,1208],["tree",616,1248],["tree",640,1272],["tree",624,1296],["tree",608,1312],["tree",584,1320],["tree",536,1296],["tree",512,1280]],"startingPoints":[{"config":{"oX":408,"oY":296}},{"config":{"oX":528,"oY":472}},{"config":{"oX":736,"oY":568}},{"config":{"oX":416,"oY":1400}},{"config":{"oX":640,"oY":1520}},{"config":{"oX":816,"oY":1352}},{"config":{"oX":952,"oY":1120}}]}');

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
