/*-------- Globals & Setup --------*/

var GLOBALS = (function () {
    return {
        flags : {
            clean : {
                threshold     : 20, // the max number of inactive objects (e.g. destructibles) before filter-based cleaning is done
                destructibles : 0,  // the current inactive object count (in this case, the current inactive destructibles) 
                visualeffects : 0,
                projectiles   : 0,
                tanks         : 0
            }
        },
        tankSelection: {
            blueprints : [],
            selectedIndex: 0
        },
        player : {
            name : 'player1'
        },
        map : {
            current : null
        },
        botCount : 0, // the number of bots currently active
        rdd : 0 // number of recently destroyed destructibles (that the pathfinders are not aware of)
    };
}());

Array.prototype.clear = function () {
  while (this.length > 0) {
    this.pop();
  }
};

var LOG_ENABLED = false;

var terrain = null;
var powerups = [];
var tanks = [];
var projectiles = [];
var destructibles = [];
var startingpoints = [];
var visualeffects = [];
var timers = [];
var maps = [];
var bots = []; // [tank, movequeue, movelist_status, state] where movelist_status pertains to readiness to execute the movelist, state refers to bot state 'patrolling', 'chasing', 'running'

var mainAnimation = null;
var editorAnimation = null;

var camera = null;

var ui_location = null; // menu, game, editor

var mousePos = {};
var mouseDownLeft = false; // left mouse
var mouseDownRight = false; // right mouse
var cycles = 0;
var logNum = 0;
var keysDown = {};
var then = performance.now();

/* map editor */
var cs_placement_ok = true;
var cspo_timeout = null; // timeout for cs_placement_ok

var cs_asset_select_ok = true;
var csas_timeout = null;

var cs_movement_ok = true;
var csmv_timeout = null;

var cLog = document.getElementById('combat-log');
var hNum = document.getElementById('hNum');
var hp = document.getElementById('current-health');