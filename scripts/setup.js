/*-------- Asset Initialization and Setup --------*/

// Blueprints
UTIL.asset.queue('blueprint', ['tanks', 'json/blueprints/tanks.json']);
UTIL.asset.queue('blueprint', ['destructibles', 'json/blueprints/destructibles.json']);

// Terrain images
TerrainImages = new ImageLibrary();
UTIL.asset.queue('image', ['default', 'images/testmap.png', TerrainImages]);
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
UTIL.asset.queue('image', ['spawn_vortex', 'images/spritesheets/spawn_vortex.png', SpriteSheetImages]);
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
STAT.add('total_tanks_destroyed');

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
MAP.importFromJSON('{"name":"timed_events_testmap","powerups":[],"destructibles":[],"startingPoints":[{"config":{"oX":200,"oY":192}},{"config":{"oX":256,"oY":248}},{"config":{"oX":328,"oY":320}},{"config":{"oX":512,"oY":312}},{"config":{"oX":608,"oY":216}}],"triggers":[],"timedEvents":[["heavy","after",30,"active_tanks","less_than",30,"total_spawned","less_than",100],["m4_sherman","every",15,"player_health","greater_than",30,"total_spawned","less_than",100],["m4_sherman_blue","every",5,"player_health","less_than",15,"total_spawned","less_than",100]]}');
MAP.importFromJSON('{"name":"survival","powerups":[],"destructibles":[["tree",128,104,32],["tree",144,120,32],["tree",144,136,32],["tree",144,144,32],["tree",136,160,32],["tree",120,176,32],["tree",112,192,32],["tree",120,200,32],["tree",136,216,32],["tree",144,224,32],["tree",160,240,32],["tree",152,296,32],["tree",176,320,32],["tree",208,352,32],["tree",216,392,32],["tree",192,416,32],["tree",240,408,32],["tree",224,360,32],["tree",216,352,32],["tree",224,320,32],["tree",232,312,32],["tree",224,280,32],["tree",232,272,32],["tree",272,280,32],["tree",304,312,32],["tree",312,320,32],["tree",344,328,32],["tree",368,304,32],["tree",384,304,32],["tree",408,320,32],["tree",440,352,32],["tree",480,376,32],["tree",504,376,32],["tree",520,368,32],["tree",544,368,32],["tree",568,384,32],["tree",560,416,32],["tree",536,440,32],["tree",528,464,32],["tree",544,480,32],["tree",536,488,32],["tree",504,480,32],["tree",496,472,32],["tree",464,440,32],["tree",472,432,32],["tree",504,424,32],["tree",528,448,32],["tree",536,456,32],["tree",560,480,32],["tree",576,496,32],["tree",600,520,32],["tree",600,568,32],["tree",560,608,32],["tree",488,672,32],["tree",432,656,32],["tree",392,648,32],["tree",352,680,32],["tree",360,704,32],["tree",376,720,32],["tree",400,720,32],["tree",400,704,32],["tree",360,672,32],["tree",336,672,32],["tree",320,672,32],["tree",296,688,32],["tree",264,720,32],["tree",256,728,32],["tree",232,736,32],["tree",216,736,32],["tree",192,720,32],["tree",184,696,32],["tree",216,696,32],["tree",224,696,32],["tree",232,720,32],["tree",208,744,32],["tree",152,744,32],["tree",128,760,32],["tree",112,776,32],["tree",88,800,32],["tree",104,816,32],["tree",120,840,32],["tree",80,880,32],["tree",48,904,32],["tree",48,912,32],["tree",72,936,32],["tree",80,968,32],["tree",48,1000,32],["tree",72,1000,32],["tree",96,976,32],["tree",112,960,32],["tree",136,936,32],["tree",208,864,32],["tree",208,856,32],["tree",176,824,32],["tree",168,816,32],["tree",184,792,32],["tree",216,760,32],["tree",176,872,32],["tree",184,896,32],["tree",200,912,32],["tree",200,936,32],["tree",176,960,32],["tree",160,992,32],["tree",168,1000,32],["tree",200,1032,32],["tree",232,1072,32],["tree",208,1096,32],["tree",72,1232,32],["tree",64,1240,32],["tree",32,1272,32],["tree",40,1296,32],["tree",48,1304,32],["tree",80,1320,32],["tree",104,1320,32],["tree",96,1344,32],["tree",72,1360,32],["tree",32,1336,32],["tree",64,1312,32],["tree",104,1312,32],["tree",128,1352,32],["tree",128,1368,32],["tree",104,1392,32],["tree",64,1432,32],["tree",40,1456,32],["tree",24,1472,32],["tree",48,1496,32],["tree",80,1528,32],["tree",96,1536,32],["tree",120,1528,32],["tree",144,1504,32],["tree",160,1496,32],["tree",184,1496,32],["tree",216,1528,32],["tree",240,1536,32],["tree",272,1520,32],["tree",264,1512,32],["tree",240,1512,32],["tree",216,1512,32],["tree",232,1552,32],["tree",248,1568,32],["tree",272,1568,32],["tree",304,1552,32],["tree",312,1544,32],["tree",336,1520,32],["tree",376,1528,32],["tree",408,1560,32],["tree",432,1560,32],["tree",448,1544,32],["tree",472,1520,32],["tree",512,1480,32],["tree",536,1456,32],["tree",576,1432,32],["tree",600,1440,32],["tree",616,1456,32],["tree",608,1480,32],["tree",576,1512,32],["tree",568,1520,32],["tree",536,1552,32],["tree",560,1576,32],["tree",560,1592,32],["tree",536,1616,32],["tree",520,1632,32],["tree",488,1664,32],["tree",456,1680,32],["tree",416,1648,32],["tree",392,1624,32],["tree",376,1616,32],["tree",352,1616,32],["tree",328,1624,32],["tree",312,1640,32],["tree",328,1672,32],["tree",352,1672,32],["tree",384,1696,32],["tree",416,1704,32],["tree",464,1752,32],["tree",488,1752,32],["tree",504,1752,32],["tree",544,1776,32],["tree",568,1784,32],["tree",768,1600,32],["tree",848,1520,32],["tree",872,1496,32],["tree",896,1464,32],["tree",888,1456,32],["tree",872,1424,32],["tree",896,1400,32],["tree",904,1376,32],["tree",888,1360,32],["tree",888,1328,32],["tree",912,1304,32],["tree",912,1288,32],["tree",888,1264,32],["tree",864,1240,32],["tree",816,1216,32],["tree",792,1224,32],["tree",752,1248,32],["tree",728,1240,32],["tree",712,1224,32],["tree",688,1200,32],["tree",656,1168,32],["tree",640,1152,32],["tree",616,1152,32],["tree",592,1152,32],["tree",576,1160,32],["tree",552,1176,32],["tree",472,1280,32],["tree",456,1264,32],["tree",424,1232,32],["tree",416,1224,32],["tree",392,1200,32],["tree",368,1168,32],["tree",376,1160,32],["tree",392,1144,32],["tree",400,1128,32],["tree",384,1104,32],["tree",392,1080,32],["tree",408,1064,32],["tree",424,1040,32],["tree",424,1024,32],["tree",440,1000,32],["tree",480,976,32],["tree",512,944,32],["tree",536,928,32],["tree",552,928,32],["tree",576,928,32],["tree",608,904,32],["tree",616,896,32],["tree",648,864,32],["tree",656,856,32],["tree",672,856,32],["tree",696,864,32],["tree",712,880,32],["tree",728,896,32],["tree",736,904,32],["tree",752,920,32],["tree",768,936,32],["tree",832,1064,32],["tree",856,1072,32],["tree",896,1048,32],["tree",928,1016,32],["tree",960,984,32],["tree",992,952,32],["tree",984,912,32],["tree",952,880,32],["tree",960,856,32],["tree",992,824,32],["tree",960,792,32],["tree",936,768,32],["tree",920,752,32],["tree",896,728,32],["tree",920,696,32],["tree",936,680,32],["tree",912,656,32],["tree",888,632,32],["tree",904,616,32],["tree",928,592,32],["tree",952,584,32],["tree",984,608,32],["tree",992,616,32],["tree",1024,608,32],["tree",1176,456,32],["tree",1200,456,32],["tree",1224,480,32],["tree",1240,496,32],["tree",1264,520,32],["tree",1296,552,32],["tree",1312,576,32],["tree",1312,592,32],["tree",1312,616,32],["tree",1288,640,32],["tree",1296,656,32],["tree",1320,680,32],["tree",1336,696,32],["tree",1352,712,32],["tree",1360,720,32],["tree",1368,792,32],["tree",1336,824,32],["tree",1312,848,32]],"startingPoints":[{"config":{"oX":1080,"oY":672}},{"config":{"oX":832,"oY":480}},{"config":{"oX":640,"oY":288}},{"config":{"oX":456,"oY":184}},{"config":{"oX":352,"oY":480}},{"config":{"oX":144,"oY":560}},{"config":{"oX":320,"oY":848}},{"config":{"oX":528,"oY":1056}}],"triggers":[],"timedEvents":[["heavy","every",20,"player_health","greater_than",50,"total_spawned","less_than",100],["m4_sherman","after",16,"active_tanks","less_than",30,"total_spawned","less_than",100],["m4_sherman_blue","every",12,"player_health","less_than",20,"total_spawned","less_than",100]]}');

GLOBALS.map.current = maps[0];


// show progress bar
$('#progress').show();
var progressText = document.getElementById('progress-text');
var progressBar = document.getElementById('progress-bar');

var totalAssets = UTIL.asset.getTotalQueued();
var totalLoaded = UTIL.asset.getTotalLoaded();
var totalFailed = UTIL.asset.getTotalFailed();

// start loading assets
UTIL.asset.loadAll(function (item) {
    // everytime a queued item is loaded, update the progressbar
    totalLoaded = UTIL.asset.getTotalLoaded();
    progressText.innerHTML = item;
    progressBar.value = (totalLoaded / totalAssets) * 100;
}, function (error) {
    // if we encountered an error while loading, log it
    totalFailed = UTIL.asset.getTotalFailed();
    console.log(error);
}, function () {
    // if everything has been loaded, go to main menu
    terrain = TerrainImages.get('default'); // default terrain
    $('#progress').hide();
    menu();
});
