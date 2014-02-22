/*-------- Asset Initialization and Setup --------*/

// Blueprints
BLUEPRINT.addMulti('json/blueprints/tanks.json');
BLUEPRINT.addMulti('json/blueprints/destructibles.json');

// Terrain images
TerrainImages = new ImageLibrary();
TerrainImages.add('testmap', 'images/testmap.png');
TerrainImages.add('dirt_and_grass_02', 'images/terrain/dirt_and_grass/dirt_and_grass_02.png');
TerrainImages.add('dirt_and_grass_03', 'images/terrain/dirt_and_grass/dirt_and_grass_03.png');
TerrainImages.add('dirt_and_grass_04', 'images/terrain/dirt_and_grass/dirt_and_grass_04.png');
TerrainImages.add('dirt_and_grass_06', 'images/terrain/dirt_and_grass/dirt_and_grass_06.png');
TerrainImages.add('dirt_and_grass_07', 'images/terrain/dirt_and_grass/dirt_and_grass_07.png');
TerrainImages.add('dirt_and_grass_08', 'images/terrain/dirt_and_grass/dirt_and_grass_08.png');
TerrainImages.add('dirt_and_grass_09', 'images/terrain/dirt_and_grass/dirt_and_grass_09.png');
TerrainImages.add('dirt_and_grass_10', 'images/terrain/dirt_and_grass/dirt_and_grass_10.png');
TerrainImages.add('dirt_and_grass_11', 'images/terrain/dirt_and_grass/dirt_and_grass_11.png');
TerrainImages.add('dirt_and_grass_13', 'images/terrain/dirt_and_grass/dirt_and_grass_13.png');
TerrainImages.add('dirt_and_grass_14', 'images/terrain/dirt_and_grass/dirt_and_grass_14.png');
TerrainImages.add('dirt_and_grass_15', 'images/terrain/dirt_and_grass/dirt_and_grass_15.png');
TerrainImages.add('dirt_and_grass_16', 'images/terrain/dirt_and_grass/dirt_and_grass_16.png');
TerrainImages.add('dirt_and_grass_17', 'images/terrain/dirt_and_grass/dirt_and_grass_17.png');
TerrainImages.add('dirt_and_grass_18', 'images/terrain/dirt_and_grass/dirt_and_grass_18.png');
TerrainImages.add('dirt_and_grass_19', 'images/terrain/dirt_and_grass/dirt_and_grass_19.png');
TerrainImages.add('dirt_and_grass_20', 'images/terrain/dirt_and_grass/dirt_and_grass_20.png');

// Tank images
TankImages = new ImageLibrary();
TankImages.add('light-turret-blue', 'images/tanks/light-turret-blue.png');
TankImages.add('light-turret-red', 'images/tanks/light-turret-red.png');
TankImages.add('light-chassis', 'images/tanks/light-chassis.png');
TankImages.add('jagdpanther_turret', 'images/tanks/jagdpanther/turret.png');
TankImages.add('jagdpanther_chassis', 'images/tanks/jagdpanther/chassis.png');
TankImages.add('m4_sherman_turret', 'images/tanks/m4_sherman/turret.png');
TankImages.add('m4_sherman_chassis', 'images/tanks/m4_sherman/chassis.png');
TankImages.add('m4_sherman_turret_blue', 'images/tanks/m4_sherman/turret_blue.png');
TankImages.add('m4_sherman_chassis_blue', 'images/tanks/m4_sherman/chassis_blue.png');
TankImages.add('heavy_turret', 'images/tanks/heavy/turret.png');
TankImages.add('heavy_chassis', 'images/tanks/heavy/chassis.png');

// Projectile images
ProjectileImages = new ImageLibrary();
ProjectileImages.add('default', 'images/projectiles/default.png');

// Powerup images
PowerUpImages = new ImageLibrary();
PowerUpImages.add('random', 'images/powerups/random.png');
PowerUpImages.add('rapid-fire', 'images/powerups/rapid-fire.png');
PowerUpImages.add('haste', 'images/powerups/haste.png');
PowerUpImages.add('faster-projectile', 'images/powerups/faster-projectile.png');
PowerUpImages.add('increased-armor', 'images/powerups/increased-armor.png');
PowerUpImages.add('increased-damage', 'images/powerups/increased-damage.png');
PowerUpImages.add('aphotic-shield', 'images/powerups/aphotic-shield.png');
PowerUpImages.add('reactive-armor', 'images/powerups/reactive-armor.png');
PowerUpImages.add('regeneration', 'images/powerups/regeneration.png');
PowerUpImages.add('ammo', 'images/powerups/ammo.png');
PowerUpImages.add('projectile-barrier', 'images/powerups/projectile-barrier.png');
PowerUpImages.add('return', 'images/powerups/return.png');
PowerUpImages.add('multi-shot', 'images/powerups/multi-shot.png');

// Destructible images
DestructibleImages = new ImageLibrary();
DestructibleImages.add('brick_explosive', 'images/destructibles/brick-explosive.png');
DestructibleImages.add('wall_rubber', 'images/destructibles/wall-rubber.png');
DestructibleImages.add('heavy_rubber', 'images/destructibles/heavy-rubber.png');
DestructibleImages.add('concrete', 'images/destructibles/concrete.png');
DestructibleImages.add('riveted_iron', 'images/destructibles/riveted-iron.png');

// Attachment images
AttachmentImages = new ImageLibrary();
AttachmentImages.add('increased-damage', 'images/attachments/turret/increased-damage.png');
AttachmentImages.add('increased-armor', 'images/attachments/chassis/increased-armor.png');

// Editor images
EditorImages = new ImageLibrary();
EditorImages.add('starting-point', 'images/editor/starting-point.png');

// Spritesheet images
SpriteSheetImages = new ImageLibrary();
SpriteSheetImages.add('explosion', 'images/spritesheets/explosion.png');
SpriteSheetImages.add('volumetric_explosion', 'images/spritesheets/volumetric_explosion.png');
SpriteSheetImages.add('volumetric_explosion_2', 'images/spritesheets/volumetric_explosion_2.png');
SpriteSheetImages.add('aphotic_shield', 'images/spritesheets/aphotic_shield.png');

// BGM
backgroundMusic = new Audio('sounds/bgm.wav');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.15;
backgroundMusic.load();

// Sound effects
fireSound         = new SoundPool('sounds/turret_fire.wav', 0.12, 20);
explodeSound      = new SoundPool('sounds/explosion.wav', 0.1, 20);
d_explodeSound    = new SoundPool('sounds/destructible_hit.wav', 0.1, 20);
d_destroyedSound  = new SoundPool('sounds/destructible_destroyed.wav', 0.2, 10);
t_destroyedSound  = new SoundPool('sounds/tank_destroyed.wav', 0.2, 10);
t_destroyedSound2 = new SoundPool('sounds/tank_destroyed2.wav', 0.2, 10);
t_destroyedSound3 = new SoundPool('sounds/tank_destroyed3.wav', 0.2, 10);
pick_powerupSound = new SoundPool('sounds/pick-powerup.wav', 0.2, 20);

fireSound.init();
explodeSound.init();
d_explodeSound.init();
d_destroyedSound.init();
t_destroyedSound.init();
t_destroyedSound2.init();
t_destroyedSound3.init();
pick_powerupSound.init();

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
current_map = maps[0];
terrain = TerrainImages.get('testmap');