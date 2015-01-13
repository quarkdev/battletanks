/*-------- Asset Initialization and Setup --------*/

// Blueprints
UTIL.asset.queue('blueprint', ['tanks', 'json/blueprints/tanks.json']);
UTIL.asset.queue('blueprint', ['destructibles', 'json/blueprints/destructibles.json']);
UTIL.asset.queue('blueprint', ['maps', 'json/blueprints/maps.json']);
UTIL.asset.queue('blueprint', ['upgrades', 'json/blueprints/upgrades/passive.json']);

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
UTIL.asset.queue('image', ['widower_turret', 'images/tanks/widower/turret.png', TankImages]);
UTIL.asset.queue('image', ['widower_chassis', 'images/tanks/widower/chassis.png', TankImages]);

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
UTIL.asset.queue('image', ['homing-missile', 'images/powerups/homing-missile.png', PowerUpImages]);
UTIL.asset.queue('image', ['concussive-shell', 'images/powerups/concussive-shell.png', PowerUpImages]);
UTIL.asset.queue('image', ['fireworks', 'images/powerups/fireworks.png', PowerUpImages]);
UTIL.asset.queue('image', ['chain', 'images/powerups/chain.png', PowerUpImages]);
UTIL.asset.queue('image', ['gold-coin', 'images/powerups/gold-coin.png', PowerUpImages]);
UTIL.asset.queue('image', ['increased-critical-chance', 'images/powerups/increased-critical-chance.png', PowerUpImages]);
UTIL.asset.queue('image', ['kinetic-shell', 'images/powerups/kinetic-shell.png', PowerUpImages]);
UTIL.asset.queue('image', ['time-dilation-sphere', 'images/powerups/time-dilation-sphere.png', PowerUpImages]);
UTIL.asset.queue('image', ['nuke', 'images/powerups/nuke.png', PowerUpImages]);

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
UTIL.asset.queue('image', ['grass-grid', 'images/editor/grid.png', EditorImages]);

// Minimap images
MinimapImages = new ImageLibrary();
UTIL.asset.queue('image', ['player-map-object', 'images/ui/view.png', MinimapImages]);

// Spritesheet images
SpriteSheetImages = new ImageLibrary();
UTIL.asset.queue('image', ['explosion', 'images/spritesheets/explosion.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['time-dilation', 'images/spritesheets/time-dilation.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['time-dilation-on', 'images/spritesheets/time-dilation-on.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['time-dilation-off', 'images/spritesheets/time-dilation-off.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['blue_explosion', 'images/spritesheets/blue_explosion.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['volumetric_explosion', 'images/spritesheets/volumetric_explosion.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['volumetric_explosion_2', 'images/spritesheets/volumetric_explosion_2.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['aphotic_shield', 'images/spritesheets/aphotic_shield.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['spawn_vortex', 'images/spritesheets/spawn_vortex.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['heavy_recoil', 'images/tanks/heavy/recoil.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['jagdpanther_recoil', 'images/tanks/jagdpanther/recoil.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['m4_sherman_recoil', 'images/tanks/m4_sherman/recoil.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['m4_sherman_blue_recoil', 'images/tanks/m4_sherman_blue/recoil.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['widower_recoil', 'images/tanks/widower/recoil.png', SpriteSheetImages]);
UTIL.asset.queue('image', ['calldown', 'images/spritesheets/calldown.png', SpriteSheetImages]);

// BGM
var backgroundMusic = new Audio();
UTIL.asset.queue('audio', ['sounds/bgm/6.mp3', true, 0.15, backgroundMusic]);

// Sound effects
fireSound         = new SoundPool('sounds/turret_fire.wav', 0.12, 20);
explodeSound      = new SoundPool('sounds/explosion.wav', 0.1, 20);
d_explodeSound    = new SoundPool('sounds/destructible_hit.wav', 0.1, 20);
d_destroyedSound  = new SoundPool('sounds/destructible_destroyed.wav', 0.2, 10);
t_destroyedSound  = new SoundPool('sounds/tank_destroyed.wav', 0.2, 10);
t_destroyedSound2 = new SoundPool('sounds/tank_destroyed2.wav', 0.2, 10);
t_destroyedSound3 = new SoundPool('sounds/tank_destroyed3.wav', 0.2, 10);
pick_powerupSound = new SoundPool('sounds/pick-powerup.wav', 0.2, 20);
tick_sound        = new SoundPool('sounds/tick.mp3', 1.0, 60);
wave_cleared_sound = new SoundPool('sounds/wave_cleared.wav', 0.3, 3);
wave_start_sound   = new SoundPool('sounds/wave_start.wav', 0.3, 3);
gameover_sound     = new SoundPool('sounds/gameover.wav', 0.5, 3);
gold_pick_sound    = new SoundPool('sounds/gold-pick.wav', 0.1, 20);
button_hover_sound = new SoundPool('sounds/button_hover.mp3', 0.5, 8);
button_click_sound = new SoundPool('sounds/button_click.mp3', 0.5, 8);
pup_tds_sound = new SoundPool('sounds/chronosphere.wav', 0.5, 8);
nuke_siren_sound = new SoundPool('sounds/nuke_siren.wav', 0.5, 5);
nuke_explosion_sound = new SoundPool('sounds/nuke_explosion.wav', 1.0, 5);
    
UTIL.asset.queue('soundpool', ['fire', fireSound]);
UTIL.asset.queue('soundpool', ['explode', explodeSound]);
UTIL.asset.queue('soundpool', ['explode_destructible', d_explodeSound]);
UTIL.asset.queue('soundpool', ['destroyed_destructible', d_destroyedSound]);
UTIL.asset.queue('soundpool', ['destroyed_tank', t_destroyedSound]);
UTIL.asset.queue('soundpool', ['destroyed_tank2', t_destroyedSound2]);
UTIL.asset.queue('soundpool', ['destroyed_tank3', t_destroyedSound3]);
UTIL.asset.queue('soundpool', ['pick_powerup', pick_powerupSound]);
UTIL.asset.queue('soundpool', ['tick', tick_sound]);
UTIL.asset.queue('soundpool', ['wave_cleared', wave_cleared_sound]);
UTIL.asset.queue('soundpool', ['wave_start', wave_start_sound]);
UTIL.asset.queue('soundpool', ['gameover', gameover_sound]);
UTIL.asset.queue('soundpool', ['gold_pick', gold_pick_sound]);
UTIL.asset.queue('soundpool', ['button_hover', button_hover_sound]);
UTIL.asset.queue('soundpool', ['button_click', button_click_sound]);
UTIL.asset.queue('soundpool', ['time_dilation_sphere_use', pup_tds_sound]);
UTIL.asset.queue('soundpool', ['nuke_siren', nuke_siren_sound]);
UTIL.asset.queue('soundpool', ['nuke_explosion', nuke_explosion_sound]);

// Init stat fields
var STAT = new Stat();
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
MAP.addPlaceable('powerup', 'homing-missile');
MAP.addPlaceable('powerup', 'concussive-shell');
MAP.addPlaceable('powerup', 'fireworks');
MAP.addPlaceable('powerup', 'chain');
MAP.addPlaceable('powerup', 'gold-coin');
MAP.addPlaceable('powerup', 'increased-critical-chance');
MAP.addPlaceable('powerup', 'kinetic-shell');
MAP.addPlaceable('powerup', 'time-dilation-sphere');
MAP.addPlaceable('powerup', 'nuke');

GLOBALS.map.index = 0;

// show progress bar
$('#progress').show();
var progressText = document.getElementById('progress-text');
var progressBar = document.getElementById('progress-bar');
var progressTextDone = document.getElementById('progress-text-done');
progressTextDone.style.display = "block";
progressText.innerHTML = 'Loading Game Assets...';

var totalAssets = UTIL.asset.getTotalQueued();
var totalLoaded = UTIL.asset.getTotalLoaded();
var totalFailed = UTIL.asset.getTotalFailed();

$(document).ready(function () {
    // start loading assets
    UTIL.asset.loadAll(function (item) {
        // everytime a queued item is loaded, update the progressbar
        totalLoaded = UTIL.asset.getTotalLoaded();
        progressTextDone.innerHTML = item + ' loaded';
        progressBar.value = (totalLoaded / totalAssets) * 100;
    }, function (error) {
        // if we encountered an error while loading, log it
        totalFailed = UTIL.asset.getTotalFailed();
        console.log(error);
    }, function () {
        // If everything has been loaded, Add statfields for all the tanks
        GLOBALS.tankSelection.blueprints = BLUEPRINT.getByType('tanks');
        for (var i = 0; i < GLOBALS.tankSelection.blueprints.length; i++) {
            STAT.add('td_' + GLOBALS.tankSelection.blueprints[i].name);
        }
        
        // Load best scores to global
        var bst = localStorage.getItem('best_scores');
        if (bst !== null) {
            GLOBALS.player.bestScores = JSON.parse(bst);
        }

        // Then import all maps from blueprint
        MAP.importFromBlueprint();
        
        // Attach menu sfx
        $('.menu-btn').mouseenter(function () {button_hover_sound.get(); }).click(function() { button_click_sound.get(); });

        // Initialize upgrades
        TANK.upgrade.init();

        // Load pedia contents
        UTIL.gui.loadPediaContents();
        
        // then finally go to main menu
        progressTextDone.innerHTML = '';
        terrain = TerrainImages.get('default'); // default terrain
        //MAP.generateTerrain(); // generate random terrain
        $('#progress').hide();
        progressTextDone.style.display = 'none';
        menu();
    });
});
