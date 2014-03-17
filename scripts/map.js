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

    // Map object
    function Map(name, desc) {
        "use strict";
        this.name = name;
        this.desc = desc;
        
        this.powerups = [];
        this.destructibles = []; // [destructible_blueprint_string, x, y] : this prevents shallow copy problems (reference problems)
        this.startingPoints = []; // this also dictates the max player
        this.triggers = []; // triggers (spawn, camera event, victory, etc) Triggers and their linked triggers are destroyed once proc'd and callbacks called
        this.timedEvents = []; // Timed events are setup at initial load of the map, timers are spawned including their attached callbacks/events
        this.terrain = null; // The background terrain used
    }

    // StartingPoint object
    function StartingPoint(x, y) {
        this.config = {
            oX: x,
            oY: y
        };
    }
        
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
    
    my.placeRandom = function () {
        /* Place a random number of placeables in random points in the world. */
        var total_objects_to_place = Math.floor(Math.random() * 30) + 10; // min 10, max 29
        var x, y;
        
        for (var i = 0; i < total_objects_to_place; i++) {
            x = Math.random() * WORLD_WIDTH;
            y = Math.random() * WORLD_HEIGHT;
            
            my.placeObject(x, y);
        }
    };
    
    my.placeObject = function (x, y) {
        /* Place game object at current cursor coordinates. */
        
        if (mode === 0) {
            cursor.x = mousePos.mX + camera.xView;
            cursor.y = mousePos.mY + camera.yView;
        }
        else {
            cursor.x = ccc[0];
            cursor.y = ccc[1];
        }
        
        if (typeof x !== 'undefined' && typeof y !== 'undefined') {
            cursor.x = x;
            cursor.y = y;
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
                break;
            default:
                break;

        }

        ctx.globalAlpha = 1;
        // reverse translate
        ctx.translate(-(cursor.x - xView), -(cursor.y - yView));
    };
    
    my.save = function (name, desc) {
        /* Add the map to the maplist and set as current | mapdata is taken from the newgame-ready globals: destructibles, projectiles... and so on */
        var newmap = new Map(name, desc);
        
        for (var i = 0; i < powerups.length; i++) {
            newmap.powerups.push([powerups[i].config.slug, powerups[i].config.oX, powerups[i].config.oY]);
        }
        
        for (i = 0; i < destructibles.length; i++) {
            newmap.destructibles.push([destructibles[i].config.name, destructibles[i].config.oX, destructibles[i].config.oY, destructibles[i].config.size]);
        }
        
        for (i = 0; i < startingpoints.length; i++) {
            newmap.startingPoints.push(startingpoints[i]);
        }
        
        // check and verify all timed events
        var tes = document.getElementsByClassName('timed-event');
        var eventPool = [];
        var eventData = []; // [blueprint, freq, timeout, constraint-a, eventPool[i][4], contraint-b, constraint-a2, comp2, constraint-b2]
        
        for (i = 0; i < tes.length; i++) {
            var te = tes[i];
            eventData = [];
            for (var j = 0; j < te.childNodes.length; j++) {
                var cn = te.childNodes[j];
                if (cn.className == 'te-blueprint' || cn.className == 'te-freq' || cn.className == 'te-constraint-a' || cn.className == 'te-comp' || cn.className == 'te-constraint-a2' || cn.className == 'te-comp2') {
                    eventData.push(te.childNodes[j].value);
                }
                else if (cn.className == 'te-timeout' || cn.className == 'te-constraint-b' || cn.className == 'te-constraint-b2') {
                    eventData.push(parseInt(te.childNodes[j].value));
                }
            }
            eventPool.push(eventData);
        }
        
        newmap.timedEvents = eventPool;
         
        // check map list for similarly-named map
        for (i = 0; i < maps.length; i++) {
            if (maps[i].name == newmap.name) {
                // duplicate found, inform user that map hasn't been saved
                // ...
                return;
            }
        }
        
        maps.push(newmap);
    };
    
    my.exportToJSON = function (name, desc) {
        /* Export the current map in editor to JSON format. */
        my.save(name, desc);
        
        var json_map = JSON.stringify(maps[maps.length - 1]);
        
        window.open("data:text/html," + encodeURIComponent(json_map), "_blank", "width=200, height=100");
    };
    
    my.importFromJSON = function (map_json) {
        /* Load map to map list from a JSON string. */
        var newmap = JSON.parse(map_json);
        
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
        destructibles.length = 0;
        projectiles.length = 0;
        tanks.length = 0;
        powerups.length = 0;
        visualeffects.length = 0;
        timers.length = 0;
        
        // push the powerups into the array
        for (i = 0; i < map.powerups.length; i++) {
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
        
            tanks.push(new Tank(BLUEPRINT.get(playerList[j][1]), playerList[j][0], playerList[j][2], map.startingPoints[roll].config.oX, map.startingPoints[roll].config.oY));
        }

        return 0;
    };
    
    my.spawnEnemyAtAnyPoint = function (blueprint) {
        /* Spawns an enemy tank at any of the current map's starting points. */
        GLOBALS.packedDestructibles = UTIL.packDestructibles();
        var current_map = GLOBALS.map.current;
        var i = Math.floor(Math.random() * current_map.startingPoints.length);
        var x = current_map.startingPoints[i].config.oX;
        var y = current_map.startingPoints[i].config.oY;
        
        my.spawnEnemy(blueprint, x, y);
    };
    
    my.spawnEnemyAtAllPoints = function (blueprint) {
        /* Spawns enemies at all starting points. */
        GLOBALS.packedDestructibles = UTIL.packDestructibles();
        
        var current_map = GLOBALS.map.current;
        
        for (var i = 0; i < current_map.startingPoints.length; i++) {
            my.spawnEnemy(blueprint, current_map.startingPoints[i].config.oX, current_map.startingPoints[i].config.oY);
        }
    };
    
    my.spawnEnemyAtEveryPoint = function (spawnMap) {
        GLOBALS.packedDestructibles = UTIL.packDestructibles();
        /* Spawns an enemy tank at every point in spawn map. Spawn map format: each item, [blueprint, x, y] */
        for (var i = 0; i < spawnMap.length; i++) {
            my.spawnEnemy(spawnMap[0], spawnMap[1], spawnMap[2]);
        }
    };
    
    my.spawnEnemy = function (blueprint, x, y) {
        /* Spawns an enemy tank at a target point */
        
        // don't spawn if MAX_BOTS have been reached
        if (bots.length >= MAX_BOTS) {
            return;
        }
        
        GLOBALS.botCount++;
        var enemyId = 'bot' + GLOBALS.botCount;
        
        // add the spawn vortex effect
        var vfx = new VisualEffect({
            name: 'spawn_vortex',
            oX: x,
            oY: y,
            width: 64,
            height: 64,
            scaleW: 64,
            scaleH: 64,
            maxCols: 4,
            maxRows: 4,
            framesTillUpdate: 1,
            loop: true,
            spriteSheet: 'spawn_vortex'
        });
        visualeffects.push(vfx);
        
        var timer = new Timer(function () {
            // end the spawn vortex animation
            vfx.end();
        
            // spawn enemy at starting point
            var enemy = new Tank(BLUEPRINT.get(blueprint), enemyId, 'computer', x, y);
            tanks.push(enemy);
            
            if (!GLOBALS.flags.initSpawn) {
                // set initial spawn flag to true
                GLOBALS.flags.initSpawn = true;
            }
            
            var _x = Math.floor(Math.random() * WORLD_WIDTH);
            var _y = Math.floor(Math.random() * WORLD_HEIGHT);
            
            // add to bot pool
            bots.push([enemy, [], 'waiting', 'patrol', {los: false, x: _x, y: _y}, null]);
            
            // load its pathfinder
            LOAD.worker.pathFinder(GLOBALS.packedDestructibles, enemyId, enemy.config.width);
        }, 3000);
    };
    
    my.spawnPowerUp = function () {
        /* Spawns a random powerup anywhere on the map. */
        var x = Math.random() * WORLD_WIDTH;
        var y = Math.random() * WORLD_HEIGHT;
        
        powerups.push(PUP.createRandom(x, y));
    };
    
    my.generateTerrain = function () {
        /* Randomly generates a terrain. */
        
        var maxCols = WORLD_WIDTH / 32;
        var maxRows = WORLD_HEIGHT / 32;
        var x, y;
        var bufferCanvas = document.createElement('canvas');
        bufferCanvas.width = WORLD_WIDTH;
        bufferCanvas.height = WORLD_HEIGHT;
        var bufferCtx = bufferCanvas.getContext('2d');
        
        CANVAS.setup(bufferCanvas, bufferCtx);
        
        // fill the canvas with grass
        for (var row = 0; row < maxRows; row++) {
            for (var col = 0; col < maxCols; col++) {
                x = col * 32;
                y = row * 32;
                bufferCtx.translate(x, y);
                bufferCtx.drawImage(TerrainImages.get('dirt_and_grass_13'), -16, -16);
                bufferCtx.translate(-x, -y);
            }
        }
        
        var img = new Image();
        img.onload = function () {
            terrain = img;
        };
        img.src = bufferCanvas.toDataURL();
    };
    
    return my;
}());