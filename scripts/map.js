/* Module: MAP */

var MAP = (function () {
    var my = {};
    
    my.setup = function (map, playerList) {
        /* Prepare the battlefield according to a map object's settings.
           map - is the map object
           playerNames - array of playernames/id
           
           error_code:
           0 - success
           1 - map can't accomodate the number of players
        */
        "use strict";
        var playerNum = playerList.length,
            coords_taken = [],
            i, j;


        // Determine if selected map can accomodate the number of players.
        if (playerNum > map.startingPoints.length) {
            return 1; // nope, can't accomodate..
        }

        // Clear the destructible, projectile, tank, and powerup arrays.
        destructibles.clear();
        projectiles.clear();
        tanks.clear();
        powerups.clear();

        // push the destructibles into the array
        for (i = 0; i < map.destructibles.length; i++) {
            destructibles.push(new Destructible(BLUEPRINT.get(map.destructibles[i][0]), map.destructibles[i][1], map.destructibles[i][2]));
        }

        // push the tanks into the array
        for (j = 0; j < playerNum; j++) {
            // select random coordinates
            var roll = 0;
            do {
                roll = Math.floor(Math.random() * (map.startingPoints.length)) + 0;
            } while (coords_taken.indexOf(roll) != -1);
            coords_taken.push(roll);
        
            tanks.push(new Tank(BLUEPRINT.get(playerList[j][1]), playerList[j][0], map.startingPoints[roll].config.oX, map.startingPoints[roll].config.oY));
        }

        return 0;
    };
    
    return my;
}());

// Map object
function Map(name) {
    "use strict";
    this.name = name;
    
    this.destructibles = []; // [destructible_blueprint_string, x, y] : this prevents shallow copy problems (reference problems)
    this.startingPoints = []; // this also dictates the max player
}

// StartingPoint object
function StartingPoint(x, y) {
    this.config = {
        oX: x,
        oY: y
    };
}

var drawAssetOnCursor = function () {
    // draw current asset on cursor
    ctx.translate(mousePos.mX, mousePos.mY);
    ctx.globalAlpha = 0.5;

    var asset_type = cs_assets[current_asset][0];

    switch (asset_type) {

        case 'destructible':
            ctx.drawImage(DestructibleImages.get(cs_assets[current_asset][1]), -16, -16);
            break;
        case 'starting-point':
            ctx.drawImage(EditorImages.get(cs_assets[current_asset][1]), -16, -16);
            break;
        default:
            break;

    }

    ctx.globalAlpha = 1;
    // reverse translate
    ctx.translate(-mousePos.mX, -mousePos.mY);
};

var deleteAssetOnCursor = function () {
    // remove asset on cursor
    ctx.translate(mousePos.mX, mousePos.mY);
    
    // first lets check the destructibles, start from the topmost
    for (var i = destructibles.length-1; i != -1; i--) {
    
        if (mousePos.mX < destructibles[i].config.oX + 16 &&
            mousePos.mX > destructibles[i].config.oX - 16 &&
            mousePos.mY < destructibles[i].config.oY + 16 &&
            mousePos.mY > destructibles[i].config.oY - 16) {
            // if mouse lies inside a destructible...
            destructibles.splice(i, 1);
            break;
        }
        
    }
    
    // second, the starting points
    for (i = startingpoints.length-1; i != -1; i--) {
        
        if (mousePos.mX < startingpoints[i].config.oX + 16 &&
            mousePos.mX > startingpoints[i].config.oX - 16 &&
            mousePos.mY < startingpoints[i].config.oY + 16 &&
            mousePos.mY > startingpoints[i].config.oY - 16) {
            // if mouse lies inside a starting point...
            startingpoints.splice(i, 1);
            break;
        }
        
    }
    
    ctx.translate(-mousePos.mX, -mousePos.mY);
};

function writeMapAsString(name) {
    /* Save the current map in the editor in the form of a custom-delimited string. */
    name = name === '' ? 'newmap' : name;
    
    var map = '';
    map += name + '|';
    
    for (var i = 0; i < startingpoints.length; i++) {
        if (i !== 0) map += ',';
        map += startingpoints[i].config.oX + ':' + startingpoints[i].config.oY;
    }
    
    map += '|';
    
    for (i = 0; i < destructibles.length; i++) {
        if (i !== 0) map += ',';
        map += destructibles[i].config.name + ':';
        map += destructibles[i].config.oX + ':';
        map += destructibles[i].config.oY;
    }
    
    wdw = window.open("data:text/html," + encodeURIComponent(map), "_blank", "width=200, height=100");
    wdw.focus();
    
}

function loadMapFromString(mapStr) {
    /* load map to map list from string | error_codes: 0 = success, 1 = map already exists. */
    
    var name_sp_dt = mapStr.split('|');
    
    var name = name_sp_dt[0];
    var startingPoints = name_sp_dt[1].split(',');
    var destructibles = name_sp_dt[2].split(',');
    
    var newmap = new Map(name);
    
    var coords = [],
        type_coords = [];
    
    for (var i = 0; i < startingPoints.length; i++) {
        coords = startingPoints[i].split(':'); // x:y
        newmap.startingPoints.push([coords[0], coords[1]]);
    }
    
    for (i = 0; i < destructibles.length; i++) {
        type_coords = destructibles[i].split(':'); // type:x:y
        newmap.destructibles.push([type_coords[0], type_coords[1], type_coords[2]]);
    }
    
    // check map list if it contains a similar map
    for (i = 0; i < maps.length; i++) {
        if (maps[i].name == newmap.name) {
            return 1;
        }
    }
    
    // add new map to maps
    maps.push(newmap);
    
    return 0;
}

function saveMap(name) {
    /* Add the map to the maplist and set as current | mapdata is taken from the newgame-ready globals: destructibles, projectiles... and so on */
    var newmap = new Map(name);
    
    for (var i = 0; i < destructibles.length; i++) {
        newmap.destructibles.push([destructibles[i].config.name, destructibles[i].config.oX, destructibles[i].config.oY]);
    }
    
    for (i = 0; i < startingpoints.length; i++) {
        newmap.startingPoints.push(startingpoints[i]);
    }
     
    // check map list for similarly-named map
    for (i = 0; i < maps.length; i++) {
        if (maps[i].name == newmap.name) {
            // duplicate found, inform user that map hasn't been saved
            // ...
            return;
        }
    }
    
    maps.push(newmap);
    current_map = newmap;
}

function getMapIndex(name) {
    /* Retrieve the index from maps. Returns the map index if found, otherwise -1. */
    for (var i = 0; i < maps.length; i++) {
        if (maps[i].name == name) {
            return i;
        }
    }
    return -1;
}