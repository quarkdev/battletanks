/*-------- Globals & Setup --------*/

Array.prototype.clear = function() {
  while (this.length > 0) {
    this.pop();
  }
};

powerups = [];
tanks = [];
projectiles = [];
destructibles = [];
startingpoints = [];
maps = [];

current_map = null;

mainAnimation = null;
editorAnimation = null;

ui_location = null; // menu, game, editor

mousePos = {};
mouseDownLeft = false; // left mouse
mouseDownRight = false; // right mouse
cycles = 0;
logNum = 0;
keysDown = {};
then = Date.now();


/* map editor */

// list of placeable objects in the map editor { name_string, img_path }
cs_assets = [
    ['destructible', 'brick_explosive'],
    ['destructible', 'concrete'],
    ['destructible', 'riveted_iron'],
    ['destructible', 'wall_rubber'],
    ['destructible', 'heavy_rubber'],
    ['starting-point', 'starting-point']
];


cs_placement_ok = true;
cspo_timeout = null; // timeout for cs_placement_ok

cs_asset_select_ok = true;
csas_timeout = null;

csa_max = cs_assets.length-1;
current_asset = 0; // current asset on cursor


cLog = document.getElementById('combat-log');
hNum = document.getElementById('hNum');
hp = document.getElementById('current-health');