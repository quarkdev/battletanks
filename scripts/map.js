/* Module: MAP */

var MAP = (function () {
    var my = {};
    
    var cursor = {
        x: 16,
        y: 16
    };
    
    var cpi = 0, // the current placeable index
        ups = 8, // units per step. The number of units the cursor is moved per step.
        ccc = [16, 16], // current cursor coordinates
        placeables = [],
        mode = 1; // edit mode, 1 = manhattan, 0 = freeform
    
    my.getCursor = function () {
        return cursor;
    };
    
    my.addPlaceable = function (type, name) {
        /* Add a new placeable string pair to the placeable array (e.g. 'destructible', 'concrete') */
        placeables.push([type, name]);
    };
    
    my.nextPlaceable = function () {
        /* Cycles through the placeable index. */
        cpi = (cpi + 1) % placeables.length;
    };
    
    my.loadPlaceablesToUI = function () {
        /* Loads all placeables to editor-ui. */
        var ui_div = document.getElementById('editor-ui');
        
        ui_div.style.display = 'block';
        
        ui_div.innerHTML = '';
        
        for (var i = 0; i < placeables.length; i++) {
            var placeable_img_src = '';
            
            switch (placeables[i][0]) {
                case 'destructible':
                    placeable_img_src = DestructibleImages.get(placeables[i][1]).src;
                    break;
                case 'starting-point':
                    placeable_img_src = EditorImages.get('starting-point').src;
                    break;
                case 'powerup':
                    placeable_img_src = PowerUpImages.get(placeables[i][1]).src;
                    break;
            }
            var icon = '<img data-index="' + i + '" class="placeable-icon flip-vertical" src="' + placeable_img_src + '" height="32" width="32" onclick="MAP.updateCPI(' + i + ')" />';
            ui_div.innerHTML += icon; // append icon to div innerHTML
        }
    };
    
    my.updateCPI = function (value) {
        /* Change the value of the placeable index. */
        cpi = value;
    };
    
    my.placeObject = function () {
        /* Place game object at current cursor coordinates. */
        
        var x, y;
        
        if (mode === 0) {
            cursor.x = mousePos.mX + camera.xView;
            cursor.y = mousePos.mY + camera.yView;
        }
        else {
            cursor.x = ccc[0];
            cursor.y = ccc[1];
        }
        
        var asset_type = placeables[cpi][0];
        
        switch (asset_type) {
            case 'destructible':
                destructibles.push(new Destructible(BLUEPRINT.get(placeables[cpi][1]), cursor.x, cursor.y));
                break;
            case 'starting-point':
                var last = startingpoints.length-1;
                if (last === -1) {
                    startingpoints.push(new StartingPoint(cursor.x, cursor.y));
                }
                else {
                    for (var i = 0; i < startingpoints.length; i++) {
                        if (UTIL.geometry.pointLiesInsidePointSquare([cursor.x, cursor.y], [startingpoints[i].config.oX, startingpoints[i].config.oY], 32)) {
                            return;
                        }
                    }
                    startingpoints.push(new StartingPoint(cursor.x, cursor.y));
                }
                break;
            case 'powerup':
                powerups.push(PUP.create(placeables[cpi][1], cursor.x, cursor.y));
            default:
                break;
        }
    };
    
    my.removeObject = function () {
        /* Remove object at cursor. */
        
        var x, y;
        
        if (mode === 0) {
            x = mousePos.mX;
            y = mousePos.mY;
        }
        else {
            x = ccc[0];
            y = ccc[1];
        }
        
        // first lets check the destructibles, start from the topmost
        MAP._removeDestructibles(x, y);
        
        // second, the starting points
        MAP._removeStartingPoints(x, y);
        
        // third, the powerups
        MAP._removePowerUps(x, y);
        
    };
    
    my._removeDestructibles = function (x, y) {
        for (var i = destructibles.length-1; i != -1; i--) {
        
            if (x < destructibles[i].config.oX + 32 &&
                x > destructibles[i].config.oX - 32 &&
                y < destructibles[i].config.oY + 32 &&
                y > destructibles[i].config.oY - 32) {
                // if mouse lies inside a destructible...
                destructibles.splice(i, 1);
                break;
            }
            
        }
    };
    
    my._removeStartingPoints = function (x, y) {
        for (i = startingpoints.length-1; i != -1; i--) {
            
            if (x < startingpoints[i].config.oX + 32 &&
                x > startingpoints[i].config.oX - 32 &&
                y < startingpoints[i].config.oY + 32 &&
                y > startingpoints[i].config.oY - 32) {
                // if mouse lies inside a starting point...
                startingpoints.splice(i, 1);
                break;
            }
        }
    };
    
    my._removePowerUps = function (x, y) {
        for (i = powerups.length-1; i != -1; i--) {
            
            if (x < powerups[i].config.oX + 32 &&
                x > powerups[i].config.oX - 32 &&
                y < powerups[i].config.oY + 32 &&
                y > powerups[i].config.oY - 32) {
                // if mouse lies inside a starting point...
                powerups.splice(i, 1);
                break;
            }
        }
    };
    
    my.moveCursor = function (direction) {
        /* Move cursor to specified direction. */
        
        if (mode === 0) { return; } // do nothing when in manhattan mode
        
        switch (direction) {
            case 'L':
                if (ccc[0] > 16) {
                    ccc[0] -= ups;
                }
                break;
            case 'R':
                if (ccc[0] + 16 < WORLD_WIDTH) {
                    ccc[0] += ups;
                }
                break;
            case 'U':
                if (ccc[1] + 16 < WORLD_HEIGHT) {
                    ccc[1] += ups;
                }
                break;
            case 'D':
                if (ccc[1] > 16) {
                    ccc[1] -= ups;
                }
                break;
            default:
                break;
        }
    };
    
    my.toggleMode = function () {
        /* Change the mode of the editor into: freeform or manhattan */
        mode = mode === 0 ? 1 : 0;
    };
    
    my.drawPlaceableGhost = function (ctx, xView, yView) {
        /* Draw current placeable at cursor, at 50% opacity. */
        
        if (mode === 0) {
            cursor.x = mousePos.mX + xView;
            cursor.y = mousePos.mY + yView;
        }
        else {
            cursor.x = ccc[0];
            cursor.y = ccc[1];
        }
        
        ctx.translate(cursor.x - xView, cursor.y - yView);
        ctx.globalAlpha = 0.5;

        var asset_type = placeables[cpi][0];

        switch (asset_type) {

            case 'destructible':
                ctx.drawImage(DestructibleImages.get(placeables[cpi][1]), -16, -16);
                break;
            case 'starting-point':
                ctx.drawImage(EditorImages.get(placeables[cpi][1]), -16, -16);
                break;
            case 'powerup':
                ctx.drawImage(PowerUpImages.get(placeables[cpi][1]), -16, -16);
            default:
                break;

        }

        ctx.globalAlpha = 1;
        // reverse translate
        ctx.translate(-(cursor.x - xView), -(cursor.y - yView));
    };
    
    my.save = function (name) {
        /* Add the map to the maplist and set as current | mapdata is taken from the newgame-ready globals: destructibles, projectiles... and so on */
        var newmap = new Map(name);
        
        for (var i = 0; i < powerups.length; i++) {
            newmap.powerups.push([powerups[i].config.slug, powerups[i].config.oX, powerups[i].config.oY]);
        }
        
        for (i = 0; i < destructibles.length; i++) {
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
    };
    
    my.exportToString = function (name) {
        /* Export the current map in the editor in the form of a custom-delimited string. */
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
        
        map += '|';
        
        for (i = 0; i < powerups.length; i++) {
            if (i !== 0) map += ',';
            map += powerups[i].config.slug + ':';
            map += powerups[i].config.oX + ':';
            map += powerups[i].config.oY;
        }
        
        wdw = window.open("data:text/html," + encodeURIComponent(map), "_blank", "width=200, height=100");
    };
    
    my.importFromString = function (mapStr) {
        /* load map to map list from string | error_codes: 0 = success, 1 = map already exists. */
        
        var name_sp_dt     = mapStr.split('|'),
            name           = name_sp_dt[0],
            startingPoints = name_sp_dt[1].split(','),
            destructibles  = name_sp_dt[2].split(','),
            powerups       = name_sp_dt[3].split(','),
            newmap         = new Map(name),
            coords         = [],
            type_coords    = [];
        
        for (var i = 0; i < startingPoints.length; i++) {
            coords = startingPoints[i].split(':'); // x:y
            newmap.startingPoints.push([coords[0], coords[1]]);
        }
        
        for (i = 0; i < destructibles.length; i++) {
            type_coords = destructibles[i].split(':'); // type:x:y
            newmap.destructibles.push([type_coords[0], type_coords[1], type_coords[2]]);
        }
        
        for (i = 0; i < powerups.length; i++) {
            type_coords = powerups[i].split(':'); // type:x:y
            newmap.powerups.push([type_coords[0], type_coords[1], type_coords[2]]);
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
    };
    
    my.getIndex = function (name) {
        /* Retrieve the index from maps. Returns the map index if found, otherwise -1. */
        for (var i = 0; i < maps.length; i++) {
            if (maps[i].name == name) {
                return i;
            }
        }
        return -1;
    };
    
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
        visualeffects.clear();
        timers.clear();
        
        // push the powerups into the array
        for (var i = 0; i < map.powerups.length; i++) {
            powerups.push(PUP.create(map.powerups[i][0], map.powerups[i][1], map.powerups[i][2]));
        }

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
        
            tanks.push(new Tank(BLUEPRINT.get(playerList[j][1]), playerList[j][0], playerList[j][2], map.startingPoints[roll].config.oX, map.startingPoints[roll].config.oY, playerList[j][3]));
        }

        return 0;
    };
    
    my.generateTerrain = function (canvas, ctx) {
        /* Randomly generates a terrain. */
        
        var maxCols = WORLD_WIDTH / 32;
        var maxRows = WORLD_HEIGHT / 32;
        var x, y;
        
        // fill the canvas with grass
        for (var row = 0; row < maxRows; row++) {
            for (var col = 0; col < maxCols; col++) {
                x = col + 16;
                y = row + 16;
                ctx.translate(x, y);
                ctx.drawImage(TerrainImages.get('dirt_and_grass_13'), -16, -16);
                ctx.translate(-x, -y);
            }
        }
        
        return canvas.toDataURL();
    };
    
    return my;
}());

// Map object
function Map(name) {
    "use strict";
    this.name = name;
    
    this.powerups = [];
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