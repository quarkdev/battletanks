/* pre-game asset loading */

var LOAD = (function () {
    var my = {};
    
    my.gameSettings = function (player_name) {
        /* Load game settings before game starts. */
        powerups.clear();
        tanks.clear();
        projectiles.clear();
        destructibles.clear();
        startingpoints.clear();
        
        player_name = player_name == '' ? 'player' : player_name;
        
        // get the max players for current map : can be taken from the startingpoint length
        var max_players = current_map.startingPoints.length;
        
        // build playerlist (first is the player, populate the rest with bots)
        var playerlist = [];
        
        // push the player first
        playerlist.push([player_name, 'jagdpanther']);
        
        for (var i = 1; i < max_players; i++) {
            // start on 1 so that the total bot number is 1 less than the max_players
            playerlist.push(['bot'+i, 'm4_sherman']);
        }

        if (MAP.setup(current_map, playerlist) == 0) {
        
            // temporary controls binds for rudimentary AI
            player = tanks[0];
            enemy = tanks[1];
            enemy2 = tanks[2];
        }
        
    };
    
    return my;
}());

/* Sub-module: worker
 * In-charge of spawning workers
 */
LOAD.worker = (function () {
    var my = {},
        workerPool = [];
    
    my.bot = function () {
        /* Spawn a new bot worker. */
        
        var ai = _spawnWorker('scripts/bot.js', workerPool);
        
        ai.addEventListener('message', function (event) {
            UTIL.writeToLog('worker says: ' + event.data);
            // terminate worker
            my.terminateAll();
        }, false);
        
        // start worker
        ai.postMessage(JSON.stringify(tanks[1].config));
    };
    
    my.terminateAll = function () {
        /* Terminate all workers in pool. */
        for (var i = 0; i < workerPool.length; i++) {
            workerPool[i].terminate();
        }
    };
    
    var _spawnWorker = function (src, pool) {
        /* Spawn a new worker. */
        var worker = new Worker(src);
        
        pool.push(worker);
        
        return worker;
    };
    
    return my;
}());