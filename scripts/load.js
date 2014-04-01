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
        GLOBALS.flags.initSpawn = false;
        var _x, _y;
        
        player_name = player_name === '' ? 'player' : player_name;
        
        // get the max players for current map : can be taken from the startingpoint length
        var max_players = GLOBALS.map.current.startingPoints.length;
        
        // build playerlist (first is the player, populate the rest with bots)
        var playerlist = [];
        var player_tank = GLOBALS.tankSelection.blueprints[GLOBALS.tankSelection.selectedIndex].name;
        
        // push the player first
        playerlist.push([player_name, player_tank, 'player']);
        
        var setup_error = MAP.setup(GLOBALS.map.current, playerlist);

        if (setup_error === 0) {
            // setup camera
            camera = new Viewport.Camera(0, 0, canvas.width, canvas.height, WORLD_WIDTH, WORLD_HEIGHT);
        
            // bind player controls
            player = tanks[0];
            camera.follow(player, canvas.width/2, canvas.height/2);
            
            GLOBALS.packedDestructibles = UTIL.packDestructibles();
            
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
            
            // Setup waves, initialize
            GLOBALS.map.wave.current = 0;
            GLOBALS.map.wave.enemyCount = 0;
            GLOBALS.map.wave.spawning = false;
            
            // load timed events
            for (i = 0; i < eventPool.length; i++) {
                (function (i) {
                    var timer = null;
                    switch (eventPool[i][1]) {
                        case 'after':
                            // occurs only once
                            timer = new Timer(function () {
                                if (compare[eventPool[i][4]](cons_a[eventPool[i][3]](), eventPool[i][5]) && compare[eventPool[i][7]](cons_a2[eventPool[i][6]](), eventPool[i][8])) {
                                    if (eventPool[i][0] === 'powerup') {
                                        MAP.spawnPowerUp();
                                    }
                                    else {
                                        MAP.spawnEnemyAtAllPoints(eventPool[i][0]);
                                    }
                                }
                            }, eventPool[i][2] * 1000);
                            break;
                        case 'every':
                            // occurs at set intervals
                            timer = new Timer(function () {
                                var looped_spawn = function () {
                                    if (compare[eventPool[i][4]](cons_a[eventPool[i][3]](), eventPool[i][5]) && compare[eventPool[i][7]](cons_a2[eventPool[i][6]](), eventPool[i][8])) {
                                        if (eventPool[i][0] === 'powerup') {
                                            MAP.spawnPowerUp();
                                        }
                                        else {
                                            MAP.spawnEnemyAtAllPoints(eventPool[i][0]);
                                        }
                                    }
                                    timer = new Timer(function () {
                                        looped_spawn();
                                    }, eventPool[i][2] * 1000);
                                }
                                
                                looped_spawn();
                            }, eventPool[i][2] * 1000);
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
        workerPool = {}; // format of each prop id: {id: id, worker: worker}
    
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
    
    my.pathFinder = function (obs, id, botId, tankSize) {
        /* Spawn a new pathFinder worker. */
        
        var pf = {};
        
        // Check if there are any free workers
        var free = LOAD.worker.getFree();
        if (free) {
            // we have a worker!
            free.free = false; // claimed!
            pf = free;
        }
        else {
            // Nope, no free worker for you. Spawn a new one!
            pf = _spawnWorker('scripts/pathfinder.js', id, false);
            
            pf.worker.addEventListener('message', function (event) {
                // Receive data from pathfinder
                var messageReceived  = JSON.parse(event.data),
                    sender           = messageReceived.sender,
                    cmd              = messageReceived.cmd;
                    
                var bot_index = -1;
                
                for (var i = 0; i < bots.length; i++) {
                    // find bot matching sender
                    if (bots[i][0].config.id === sender) {
                        bot_index = i; // save index
                        break;
                    }
                }
                
                if (bot_index !== -1) {
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
                }
                
                // Save the movement commands to the moveCmds action array
                
                
            }, false);
        }
        
        for (var i = 0; i < bots.length; i++) {
            // find bot matching sender
            if (bots[i][0].config.id === botId) {
                bots[i][5] = pf; // save index
            }
        }
        
        // start worker
        var msg = {};
        msg.cmd = 'update_obstacles';
        msg.sender = botId;
        msg.obs = obs;
        msg.worldWidth = WORLD_WIDTH;
        msg.worldHeight = WORLD_HEIGHT;
        msg.tankSize = tankSize;
        
        pf.worker.postMessage(JSON.stringify(msg));
        
        return pf;
    };
    
    my.sendMessage = function (id, msg) {
        /* Send message to worker corresponding to id. msg is an object containing the properties: cmd and data. */
        workerPool[id].worker.postMessage(JSON.stringify(msg));
        
        // if no matching id is found, fail silently.
    };
    
    my.terminateAll = function () {
        /* Terminate all workers in pool. */
        for (var key in workerPool) {
            workerPool[key].worker.terminate();
        }
        workerPool = {};
    };
    
    my.terminate = function (workerId) {
        /* Terminate a specific worker. */
        workerPool[workerId].worker.terminate();
        delete workerPool.workerId;
    };
    
    my.free = function (workerId) {
        /* Free a specific worker so that it can be recycled. */
        workerPool[workerId].free = true;
    };
    
    my.getFree = function () {
        /* Retrieves a free worker. */
        for (var key in workerPool) {
            if (workerPool[key].free) {
                return workerPool[key];
            }
        }
        return false;
    };
    
    var _spawnWorker = function (src, id, free) {
        /* Spawn a new worker. Make sure id is unique. */
        
        var worker = new Worker(src);
        
        workerPool[id] = {id: id, worker: worker, free: free};
        return workerPool[id];
    };
    
    return my;
}());