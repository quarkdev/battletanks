/* Module: MAP */

var MAP = (function () {
    var my = {};
    
    var cpi = 0, // the current placeable index
        ups = 16, // units per step. The number of units the cursor is moved per step.
        ccc = [ups, ups], // current cursor coordinates
        placeables = [],
        mode = 1; // edit mode, 1 = manhattan, 0 = freeform
    
    my.addPlaceable = function (type, name) {
        /* Add a new placeable string pair to the placeable array (e.g. 'destructible', 'concrete') */
        placeables.push([type, name]);
    };
    
    my.nextPlaceable = function () {
        /* Cycles through the placeable index. */
        cpi = (cpi + 1) % placeables.length;
    };
    
    my.placeObject = function () {
        /* Place game object at current cursor coordinates. */
        
        var x, y;
        
        if (mode === 0) {
            x = mousePos.mX;
            y = mousePos.mY;
        }
        else {
            x = ccc[0];
            y = ccc[1];
        }
        
        var asset_type = placeables[cpi][0];
        
        switch (asset_type) {
            case 'destructible':
                destructibles.push(new Destructible(BLUEPRINT.get(placeables[cpi][1]), x, y));
                break;
            case 'starting-point':
                startingpoints.push(new StartingPoint(x, y));
                break;
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
        for (var i = destructibles.length-1; i != -1; i--) {
        
            if (x < destructibles[i].config.oX + 16 &&
                x > destructibles[i].config.oX - 16 &&
                y < destructibles[i].config.oY + 16 &&
                y > destructibles[i].config.oY - 16) {
                // if mouse lies inside a destructible...
                destructibles.splice(i, 1);
                break;
            }
            
        }
        
        // second, the starting points
        for (i = startingpoints.length-1; i != -1; i--) {
            
            if (x < startingpoints[i].config.oX + 16 &&
                x > startingpoints[i].config.oX - 16 &&
                y < startingpoints[i].config.oY + 16 &&
                y > startingpoints[i].config.oY - 16) {
                // if mouse lies inside a starting point...
                startingpoints.splice(i, 1);
                break;
            }
        }
        
    };
    
    my.moveCursor = function (direction) {
        /* Move cursor to specified direction. */
        
        if (mode === 0) { return; } // do nothing when in manhattan mode
        
        switch (direction) {
            case 'L':
                if (ccc[0] > ups) {
                    ccc[0] -= ups;
                }
                break;
            case 'R':
                if (ccc[0] + ups < canvas.width) {
                    ccc[0] += ups;
                }
                break;
            case 'U':
                if (ccc[1] + ups < canvas.height) {
                    ccc[1] += ups;
                }
                break;
            case 'D':
                if (ccc[1] > ups) {
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
    
    my.drawPlaceableGhost = function (ctx) {
        /* Draw current placeable at cursor, at 50% opacity. */
        
        var x, y;
        
        if (mode === 0) {
            x = mousePos.mX;
            y = mousePos.mY;
        }
        else {
            x = ccc[0];
            y = ccc[1];
        }
        
        ctx.translate(x, y);
        ctx.globalAlpha = 0.5;

        var asset_type = placeables[cpi][0];

        switch (asset_type) {

            case 'destructible':
                ctx.drawImage(DestructibleImages.get(placeables[cpi][1]), -16, -16);
                break;
            case 'starting-point':
                ctx.drawImage(EditorImages.get(placeables[cpi][1]), -16, -16);
                break;
            default:
                break;

        }

        ctx.globalAlpha = 1;
        // reverse translate
        ctx.translate(-x, -y);
    };
    
    my.save = function (name) {
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
    };
    
    my.exportAsString = function (name) {
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
        
        wdw = window.open("data:text/html," + encodeURIComponent(map), "_blank", "width=200, height=100");
    };
    
    my.importFromString = function (mapStr) {
        /* load map to map list from string | error_codes: 0 = success, 1 = map already exists. */
        
        var name_sp_dt     = mapStr.split('|'),
            name           = name_sp_dt[0],
            startingPoints = name_sp_dt[1].split(','),
            destructibles  = name_sp_dt[2].split(','),
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