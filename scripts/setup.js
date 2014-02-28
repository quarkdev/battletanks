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
MAP.importFromJSON('{"name":"test3","powerups":[],"destructibles":[["tree",416,312,32],["tree",464,360,32],["tree",472,400,32],["tree",448,448,32],["tree",488,488,32],["tree",544,544,32],["tree",528,568,32],["tree",512,584,32],["tree",512,616,32],["tree",560,664,32],["tree",592,664,32],["tree",632,680,32],["tree",664,712,32],["tree",720,768,32],["tree",760,808,32],["tree",808,832,32],["tree",864,856,32],["tree",776,1024,32],["tree",752,1048,32],["tree",736,1064,32],["tree",768,1096,32],["tree",792,1104,32],["tree",808,1120,32],["tree",840,1128,32],["tree",848,1128,32],["tree",896,1120,32],["tree",936,1080,32],["tree",1024,992,32],["tree",1064,952,32],["tree",1104,904,32],["tree",1072,840,32],["tree",1104,808,32],["tree",1096,792,32],["tree",1072,768,32],["tree",1008,704,32],["tree",1024,680,32],["tree",1040,664,32],["tree",1072,656,32],["tree",1088,680,32],["tree",1088,696,32],["tree",1112,704,32],["tree",1136,680,32],["tree",1112,648,32],["tree",1072,608,32],["tree",1040,576,32],["tree",1008,568,32],["tree",1000,568,32],["tree",952,536,32],["tree",920,504,32],["tree",920,496,32],["tree",952,464,32],["tree",968,448,32],["tree",992,440,32],["tree",1040,472,32],["tree",1064,488,32],["tree",1096,472,32],["tree",1128,440,32],["tree",1120,424,32],["tree",1096,400,32],["tree",1088,368,32],["tree",1136,400,32],["tree",1072,416,32],["tree",992,480,32],["tree",816,336,32],["tree",832,312,32],["tree",864,280,32],["tree",840,240,32],["tree",824,208,32],["tree",872,176,32],["tree",904,192,32],["tree",896,216,32],["tree",912,232,32],["tree",928,232,32],["tree",952,232,32],["tree",984,200,32],["tree",1032,200,32],["tree",1104,248,32],["tree",1328,416,32],["tree",1360,416,32],["tree",1432,344,32],["tree",1440,312,32],["tree",1408,280,32],["tree",1368,240,32],["tree",1360,200,32],["tree",1360,176,32],["tree",1360,144,32],["tree",1376,104,32],["tree",1408,72,32],["tree",1424,32,32],["tree",1392,16,32],["tree",1376,16,32],["tree",1464,264,32],["tree",1472,344,32],["tree",1432,392,32],["tree",1392,528,32],["tree",1384,536,32],["tree",1352,568,32],["tree",1384,600,32],["tree",1416,624,32],["tree",1424,624,32],["tree",1456,656,32],["tree",1504,704,32],["tree",1544,744,32],["tree",1552,792,32],["tree",1528,816,32],["tree",1528,848,32],["tree",1536,864,32],["tree",1504,896,32],["tree",1496,920,32],["tree",1512,936,32],["tree",1544,968,32],["tree",1584,1008,32],["tree",1624,1056,32],["tree",1592,1088,32],["tree",424,1064,32],["tree",352,1040,32],["tree",296,1016,32],["tree",256,1024,32],["tree",208,1072,32],["tree",136,1128,32],["tree",104,1144,32],["tree",72,1144,32],["tree",32,1104,32],["tree",16,1088,32],["tree",16,1056,32],["tree",48,1048,32],["tree",64,1056,32],["tree",88,1072,32],["tree",120,1056,32],["tree",120,1024,32],["tree",88,992,32],["tree",48,952,32],["tree",16,920,32],["tree",32,888,32],["tree",72,848,32],["tree",128,792,32],["tree",232,688,32],["tree",256,680,32],["tree",304,680,32],["tree",328,680,32],["tree",480,760,32],["tree",496,768,32],["tree",520,768,32],["tree",544,752,32],["tree",560,736,32],["tree",592,728,32],["tree",624,760,32],["tree",648,784,32],["tree",688,824,32],["tree",1064,952,32],["tree",1096,976,32],["tree",1128,976,32],["tree",1168,960,32],["tree",1192,984,32],["tree",1184,1008,32],["tree",1192,1040,32],["tree",1224,1072,32],["tree",1376,1104,32],["tree",1408,1072,32],["tree",1416,1064,32],["tree",1448,1040,32],["tree",1472,1048,32],["tree",1520,1088,32],["tree",1544,1080,32],["tree",1576,1048,32],["tree",1608,1032,32],["tree",1640,1032,32],["tree",1656,1040,32],["tree",1680,1064,32],["tree",1760,1192,32],["tree",1776,1216,32],["tree",1792,1232,32],["tree",1792,1264,32],["tree",1768,1288,32],["tree",1768,1320,32],["tree",1760,1400,32],["tree",1720,1400,32],["tree",1680,1368,32],["tree",1640,1352,32],["tree",1608,1360,32],["tree",1584,1384,32]],"startingPoints":[{"config":{"oX":1224,"oY":1456}},{"config":{"oX":1040,"oY":1304}},{"config":{"oX":856,"oY":672}},{"config":{"oX":656,"oY":368}},{"config":{"oX":248,"oY":512}},{"config":{"oX":432,"oY":952}}],"triggers":[],"timedEvents":[]}');

GLOBALS.map.current = maps[0];

// test spawn, unlimited spawning (only spawns if total tanks in map is less than 30)
GLOBALS.map.current.timedEvents.push([function () {
    var looped_spawn = function() {
        if (tanks.length < 30) {
            MAP.spawnEnemyAtAllPoints('m4_sherman');
        }
        timers.push(new Timer(function () {
            looped_spawn();
        }, 12000));
    };
    
    looped_spawn();
}, 12000]);

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
    // everytime a queued item is loaded, update the progressbar
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
