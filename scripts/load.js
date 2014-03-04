/* pre-game asset loading */

var LOAD = (function () {
    var my = {};
    
    my.gameSettings = function (player_name) {
        /* Load game settings before game starts. */
        powerups.length = 0;
        tanks.length = 0;
        bots.length = 0;
        projectiles.length = 0;
        destructibles.length = 0;
        startingpoints.length = 0;
        GLOBALS.botCount = 0; // reset botcount
        var _x, _y;
        
        player_name = player_name === '' ? 'player' : player_name;
        
        // get the max players for current map : can be taken from the startingpoint length
        var max_players = GLOBALS.map.current.startingPoints.length;
        
        // build playerlist (first is the player, populate the rest with bots)
        var playerlist = [];
        var player_tank = GLOBALS.tankSelection.blueprints[GLOBALS.tankSelection.selectedIndex].name;
        
        // push the player first
        playerlist.push([player_name, player_tank, 'player']);
        
        for (var i = 1; i < max_players; i++) {
            // start on 1 so that the total bot number is 1 less than the max_players
            GLOBALS.botCount++;
            playerlist.push(['bot' + GLOBALS.botCount, 'heavy', 'computer']);
        }
        
        var setup_error = MAP.setup(GLOBALS.map.current, playerlist);

        if (setup_error === 0) {
            // setup camera
            camera = new Viewport.Camera(0, 0, canvas.width, canvas.height, WORLD_WIDTH, WORLD_HEIGHT);
        
            // bind player controls
            player = tanks[0];
            camera.follow(player, canvas.width/2, canvas.height/2);
            
            // bind ai controls
            for (i = 1; i < max_players; i++) {
                _x = Math.floor(Math.random() * WORLD_WIDTH);
                _y = Math.floor(Math.random() * WORLD_HEIGHT);
            
                bots.push([tanks[i], [], 'waiting', 'patrol', {los: false, x: _x, y: _y}, null]); // [tank_ref, movequeue, move_status, state, LOS, pf_ref]
            
                // spawn pathfinders
                var pf = LOAD.worker.pathFinder(GLOBALS.map.current, tanks[i].config.id, tanks[i].config.width);
            }
            
            var eventPool = GLOBALS.map.current.timedEvents;

            // setup timed events
            var compare = {
                'less_than': function(a, b) { return a < b },
                'equals': function(a, b) { return a == b },
                'greater_than': function(a, b) { return a > b }
            };
            
            var cons_a = {
                'active_tanks': function () { return tanks.length },
                'player_health': function () { return player.config.health }
            };
            
            var cons_a2 = {
                'total_spawned': function () { return GLOBALS.botCount }
            };
            
            // load timed events
            for (i = 0; i < eventPool.length; i++) {
                (function (i) {
                    switch (eventPool[i][1]) {
                        case 'after':
                            // occurs only once
                            timers.push(new Timer(function () {
                                if (compare[eventPool[i][4]](cons_a[eventPool[i][3]](), eventPool[i][5]) && compare[eventPool[i][7]](cons_a2[eventPool[i][6]](), eventPool[i][8])) {
                                    if (eventPool[i][0] === 'powerup') {
                                        MAP.spawnPowerUp();
                                    }
                                    else {
                                        MAP.spawnEnemyAtAllPoints(eventPool[i][0]);
                                    }
                                }
                            }, eventPool[i][2] * 1000));
                            break;
                        case 'every':
                            // occurs at set intervals
                            timers.push(new Timer(function () {
                                var looped_spawn = function () {
                                    if (compare[eventPool[i][4]](cons_a[eventPool[i][3]](), eventPool[i][5]) && compare[eventPool[i][7]](cons_a2[eventPool[i][6]](), eventPool[i][8])) {
                                        if (eventPool[i][0] === 'powerup') {
                                            MAP.spawnPowerUp();
                                        }
                                        else {
                                            MAP.spawnEnemyAtAllPoints(eventPool[i][0]);
                                        }
                                    }
                                    timers.push(new Timer(function () {
                                        looped_spawn();
                                    }, eventPool[i][2] * 1000));
                                }
                                
                                looped_spawn();
                            }, eventPool[i][2] * 1000));
                            break;
                        default:
                            break;
                    }
                }(i));
            }
        }
        
        return max_players - 1;
        
    };
    
    return my;
}());

/* Sub-module: worker
 * In-charge of spawning workers
 */
LOAD.worker = (function () {
    var my = {},
        workerPool = []; // format of each item [worker, id]
    
    my.bot = function (id) {
        /* Spawn a new bot worker. */
        
        var ai = _spawnWorker('scripts/bot.js', id);
        
        ai.addEventListener('message', function (event) {
            //UTIL.writeToLog('worker says: ' + event.data);
            // terminate worker
            my.terminateAll();
        }, false);
        
        // start worker
        ai.postMessage(JSON.stringify(tanks[1].config));
    };
    
    my.pathFinder = function (map, id, tankSize) {
        /* Spawn a new pathFinder worker. */
        
        var pf = _spawnWorker('scripts/pathfinder.js', id);
        
        for (var i = 0; i < bots.length; i++) {
            // find bot matching sender
            if (bots[i][0].config.id === id) {
                bots[i][5] = pf; // save index
            }
        }
        
        pf.addEventListener('message', function (event) {
            // Receive data from pathfinder
            var messageReceived  = JSON.parse(event.data),
                sender           = messageReceived.sender,
                cmd              = messageReceived.cmd;
                
            var bot_index = null;
            
            for (var i = 0; i < bots.length; i++) {
                // find bot matching sender
                if (bots[i][0].config.id === sender) {
                    bot_index = i; // save index
                }
            }
                
            switch (cmd) {
                case 'update_ok':
                    bots[bot_index][2] = 'ready';
                    break;
                case 'waypoint_ok':
                    bots[bot_index][1] = messageReceived.waypoint;
                    bots[bot_index][2] = 'ready';
                    break;
                case 'get_los_ok':
                    bots[bot_index][4] = messageReceived.lkl;
                    break;
                default:
                    break;
            }
            
            // Save the movement commands to the moveCmds action array
            
            
        }, false);
        
        // start worker
        var msg = {};
        msg.cmd = 'update_obstacles';
        msg.sender = id;
        msg.data = map.destructibles;
        msg.worldWidth = WORLD_WIDTH;
        msg.worldHeight = WORLD_HEIGHT;
        msg.tankSize = tankSize;
        
        pf.postMessage(JSON.stringify(msg));
        
        return pf;
    };
    
    my.sendMessage = function (id, msg) {
        /* Send message to worker corresponding to id. msg is an object containing the properties: cmd and data. */
        for (var i = 0; i < workerPool.length; i++) {
            if (id === workerPool[i][1]) {
                workerPool[i][0].postMessage(JSON.stringify(msg));
                break;
            }
        }
        
        // if no matching id is found, fail silently.
    };
    
    my.terminateAll = function () {
        /* Terminate all workers in pool. */
        while (workerPool.length > 0) {
            workerPool[0][0].terminate();
            workerPool.splice(0, 1);
        }
    };
    
    my.terminate = function (workerId) {
        /* Terminate a specific worker. */
        for (var i = 0; i < workerPool.length; i++) {
            if (workerPool[i][1] === workerId) {
                workerPool[i][0].terminate();
            }
        }
    };
    
    var _spawnWorker = function (src, id) {
        /* Spawn a new worker. */
        
        var worker = new Worker(src);
        
        workerPool.push([worker, id]);
        
        return worker;
    };
    
    return my;
}());