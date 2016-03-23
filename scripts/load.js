/* pre-game asset loading */

var LOAD = (function () {
    var my = {};
    
    my.gameSettings = function () {
        /* Load game settings before game starts. */
        powerups.length = 0;
        tanks.length = 0;
        bots.length = 0;
        projectiles.length = 0;
        destructibles.length = 0;
        startingpoints.length = 0;
        visualeffects.length = 0;
        lights.length = 0;
        dummies.length = 0;
        
        // make sure there are no active timers
        UTIL.timer.killAll();
        
        GLOBALS.botCount = 0; // reset botcount
        GLOBALS.flags.initSpawn = false;
        var _x, _y;
        
        // get the max players for current map : can be taken from the startingpoint length
        var max_players = GLOBALS.map.current.startingPoints.length;
        
        // build playerlist (first is the player, populate the rest with bots)
        var playerlist = [];
        var player_tank = GLOBALS.tankSelection.blueprints[GLOBALS.tankSelection.selectedIndex].name;
        
        // push the player first
        playerlist.push([GLOBALS.player.name, player_tank, 'player']);
        
        var setup_error = MAP.setup(GLOBALS.map.current, playerlist);

        if (setup_error === 0) {
            // setup camera
            camera = new Viewport.Camera(0, 0, canvas.width, canvas.height, WORLD_WIDTH, WORLD_HEIGHT);
        
            // bind player controls
            player = tanks[0];
            camera.follow(dummy_camera, canvas.width/2, canvas.height/2);
            tank_to_chase = player;

            // set player gold to 5000
            tanks[0].config.coins = 50000;
            
            GLOBALS.packedDestructibles = UTIL.packDestructibles();
            
            // Setup waves, initialize
            GLOBALS.map.wave.current = 0;
            GLOBALS.map.wave.current_ = 0;
            GLOBALS.map.wave.enemyCount = 0;
            GLOBALS.map.wave.spawning = false;
            GLOBALS.map.postgame = false;
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
        
        // Check if there are any available workers
        var available = LOAD.worker.getAvailable();
        if (available) {
            // we have a worker!
            available.clients.active += 1; // claimed!
            pf = available;
        }
        else {
            // Nope, no available worker for you. Spawn a new one!
            pf = _spawnWorker('scripts/pathfinder.js', id, 1, 5); // max of 5 active clients for each pathfinder
            
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

    my.getAvailable = function () {
        /* Retrieves returns the worker with the least active clients. */
        var availableWorker = false;
        var freeSlots = 0;

        for (var key in workerPool) {
            freeSlots = workerPool[key].clients.max - workerPool[key].clients.active;

            if (freeSlots > 0) {
                if (!availableWorker) {
                    // There are no saved workers yet, this is the first one.
                    availableWorker = workerPool[key];
                }
                else {
                    if (freeSlots > (availableWorker.clients.max - availableWorker.clients.active)) {
                        availableWorker = workerPool[key]; // Replace current worker chosen with one with more free slots.
                    }
                }
            }
        }

        return availableWorker;
    };
    
    var _spawnWorker = function (src, id, active, max) {
        /* Spawn a new worker. Make sure id is unique. */
        
        active = active || 0;
        max    = max    || 1;

        var worker = new Worker(src);
        
        workerPool[id] = {
            id: id,
            worker: worker,
            clients: {
                active: active, // current number of active clients
                max: max // max number of active clients
            }
        };
        return workerPool[id];
    };
    
    return my;
}());