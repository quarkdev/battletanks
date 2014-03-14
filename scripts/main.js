
/* ------------------------ MAIN ------------------- */ 
var menu = function() {

    ui_location = 'menu';
    
    $('#external-hud').hide();
    $('#editor-ui').hide();

    // show menu overlay
    $('#main-menu').show();
};

var pause = function () {
    // stop the main interval
    if (ui_location === 'game') {
        cancelAnimationFrame(mainAnimation);
        // remove all dead timers
        UTIL.cleanTimers();
        
        // pause all timers
        UTIL.pauseTimers();
    }
    else if (ui_location === 'editor') {
        cancelAnimationFrame(editorAnimation);
    }
    else if (ui_location === 'post_game') {
        return;
    }

    // show pause menu
    if (ui_location == 'game') $('#pause-menu').show();
    else if (ui_location == 'editor') $('#editor-menu').show();
    
    UTIL.pauseMusic(backgroundMusic);
};

// NEW GAME
var reset = function() {
    alert('done');
};


// UPDATE SCENE
var update = function(modifier) {
    
    /* turn tank body to direction */
    if (37 in keysDown) { // left arrow pressed
        player.turnBody(modifier, 'ccw');
    }
    
    if (39 in keysDown) { // right arrow pressed
        player.turnBody(modifier, 'cw');
    }
    
    if (!(37 in keysDown) && !(39 in keysDown)) { // no left/right arrows pressed
        player.turnBody(modifier, 'hold');
    }
    
    if (38 in keysDown) { // up arrow pressed
        player.move(modifier, 'forward');
    }
    else {
        player.move(modifier, 'forward-stop');
    }
    
    if (40 in keysDown) { // down arrow pressed
        player.move(modifier, 'reverse');
    }
    else {
        player.move(modifier, 'reverse-stop');
    }
    
    if (mouseDownLeft) {
        player.fire();
    }
    
    player.frame(); // run all frame callbacks
    
    /* turn turret (based on current facing angle) */
    player.turnTurret(modifier, mousePos.mX + camera.xView, mousePos.mY + camera.yView);
    
    // save current rdd value
    var cRdd = GLOBALS.rdd;
   
    // AI
    for (var i = 0; i < bots.length; i++) {
        var bot_id = bots[i][0].config.id;
        var query = {};
    
        // update tanks only if active | TEST for AI pathfinding
        if (bots[i][0].config.active) {
            // randomize the chance for bot to ask for LOS
            var askForLos = 15 > Math.random() * 100;
            
            if (askForLos) {
                // send message to pathfinder asking for LOS calculation
                query = {};
                query.sender = bot_id;
                query.playerLoc = {x: player.config.oX, y: player.config.oY};
                query.botLoc = {x: bots[i][0].config.oX, y: bots[i][0].config.oY};
                query.lastKnown = {x: bots[i][4].x, y: bots[i][4].y};
                query.cmd = 'get_line_of_sight';
                
                bots[i][5].postMessage(JSON.stringify(query));
            }
            
            // Update turret to last known location of player
            bots[i][0].turnTurret(modifier, bots[i][4].x, bots[i][4].y);
            
            // Check if bot can see player
            if (bots[i][4].los) {
                // Fire
                if (1 > Math.random() * 100) {
                    bots[i][0].fire();
                }
            }
            
            // Check if movequeue has commands
            var msg = {};
            var mq = bots[i][1];
            if (mq.length > 0 && bots[i][2] === 'ready') {
                // if it has commands execute them starting from the last (since its reversed)
                var move = mq[mq.length - 1];
                var cmd = move[0];
                
                switch (cmd) {
                    case 'turn':
                        //bots[i][0].move(modifier, 'forward-stop');
                        if (bots[i][0].config.hAngle !== move[2]) {
                            bots[i][0].velocity.forward = 0.0;
                        }
                        bots[i][0].turnBody(modifier, move[1], move[2]);
                        // check if turn angle reached
                        if (bots[i][0].config.hAngle === move[2]) {
                            // if yes, pop the move
                            bots[i][1].pop();
                        }
                        break;
                    case 'move':
                        bots[i][0].turnBody(modifier, 'hold');
                        bots[i][0].move(modifier, 'forward', { x: move[1], y: move[2] });
                        // check if move point reach
                        if (bots[i][0].config.oX === move[1] && bots[i][0].config.oY === move[2]) {
                            // if yes, pop the move
                            bots[i][1].pop();
                        }
                        break;
                    default:
                        break;
                }
            }
            else if (cRdd > 0 && bots[i][2] !== 'waiting') {
                // there are recently destroyed destructibles, so we need to let the pathfinders know
                GLOBALS.rdd = 0;
                
                msg = {};
                
                msg.sender = bot_id;
                msg.cmd = 'update_obstacles';
                msg.sender = bot_id;
                msg.obs = UTIL.packDestructibles();
                msg.worldWidth = WORLD_WIDTH;
                msg.worldHeight = WORLD_HEIGHT;
                msg.tankSize = bots[i][0].config.width;
                
                // set status to:
                bots[i][2] = 'waiting';
                
                // send message to pathfinder worker asking for directions
                bots[i][5].postMessage(JSON.stringify(msg));
            }
            else if (bots[i][2] !== 'waiting') {
                // movequeue is empty or bot is not waiting for reply from worker, so ask for movelist from pathfinder
                
                msg = {};
                
                msg.sender = bot_id;
                msg.start = [bots[i][0].config.oX, bots[i][0].config.oY];
                msg.angle = bots[i][0].config.hAngle; // body angle
                
                switch (bots[i][3]) {
                    case 'patrol':
                        msg.cmd = 'get_waypoint_random';
                        break;
                    case 'chase':
                        msg.goal  = [bots[i][4].x, bots[i][4].y]; // use the last known location of player
                        msg.cmd = 'get_waypoint';
                        break;
                    default:
                        msg.cmd = 'get_waypoint_random';
                        break;
                }
                
                // set status to:
                bots[i][2] = 'waiting';
                
                // send message to pathfinder worker asking for directions
                bots[i][5].postMessage(JSON.stringify(msg));
            }
            
            bots[i][0].frame(); // run all frame callbacks
        }
    }
    
    // Update all projectiles.
    for (i = 0; i < projectiles.length; i++) {
        if (projectiles[i].config.active) {
            projectiles[i].update(modifier);
        }
    }
    
    // Update all visual effects.
    for (i = 0; i < visualeffects.length; i++) {
        if (visualeffects[i].config.active) {
            visualeffects[i].update();
        }
    }
    
    // Remove all inactive projectiles. This keeps the projectiles array from accumulating inactive objects.
    if (GLOBALS.flags.clean.projectiles > GLOBALS.flags.clean.threshold) {
        projectiles = projectiles.filter(function (item) {
            return item.config.active;
        });
        GLOBALS.flags.clean.projectiles = 0;
    }
    
    // Remove all inactive visualeffects. This keeps the visualeffects array from accumulating inactive objects.
    if (GLOBALS.flags.clean.visualeffects > GLOBALS.flags.clean.threshold) {
        visualeffects = visualeffects.filter(function (item) {
            return item.config.active;
        });
        GLOBALS.flags.clean.visualeffects = 0;
    }
    
    // Remove all inactive destructibles
    if (GLOBALS.flags.clean.destructibles > GLOBALS.flags.clean.threshold) {
        destructibles = destructibles.filter(function (item) {
            return item.config.active;
        });
        GLOBALS.flags.clean.destructibles = 0;
        GLOBALS.pd = UTIL.packDestructibles();
    }
    
    // Remove all inactive tanks
    if (GLOBALS.flags.clean.tanks > GLOBALS.flags.clean.threshold) {
        // clean the bots first
        bots = bots.filter(function (item) {
            if (item[0].config.active) {
                return true;
            }
            else {
                // tank is dead, time to terminate its associated pathfinder also
                LOAD.worker.terminate(item[0].config.id);
                return false;
            }
        });
        // then clean the tanks
        tanks = tanks.filter(function (item) {
            return item.config.active;
        });
        GLOBALS.flags.clean.tanks = 0;
    }
    
    camera.update();
};

// Editor UPDATE
var editorUpdate = function() {
     
    if (cs_asset_select_ok) {
        
        if (96 in keysDown) { // num 0
            MAP.nextPlaceable();
        }
        
        if (17 in keysDown) { // ctrl
            MAP.toggleMode();
        }
        
        cs_asset_select_ok = false;
        
        clearTimeout(csas_timeout);
        
        csas_timeout = setTimeout(function() { cs_asset_select_ok = true; }, 75);
    }
    
    if (cs_movement_ok) {
    
        if (37 in keysDown) { // left arrow
            MAP.moveCursor('L');
        }
        
        if (39 in keysDown) { // right arrow
            MAP.moveCursor('R');
        }
        
        if (38 in keysDown) { // up arrow
            MAP.moveCursor('U');
        }
        
        if (40 in keysDown) { // down arrow
            MAP.moveCursor('D');
        }
        
        cs_movement_ok = false;
        
        clearTimeout(csmv_timeout);
        
        csmv_timeout = setTimeout(function() { cs_movement_ok = true; }, 50);
    }
    
    if (cs_placement_ok) {
    
        if (13 in keysDown || mouseDownLeft) { // enter
            MAP.placeObject();
        }
        
        if (191 in keysDown) {
            MAP.placeRandom();
        }
        
        cs_placement_ok = false;
        
        clearTimeout(cspo_timeout);
        
        cspo_timeout = setTimeout(function() { cs_placement_ok = true; }, 100);
    }
    
    if (110 in keysDown || mouseDownRight ) {
        MAP.removeObject();
    }

    camera.update();
};

// DRAW SCENE
var renderCanvas = function () {

    CANVAS.clear(canvas, ctx);
    CANVAS.clear(minimap, minimapCtx);
    CANVAS.drawMinimap(minimapCtx, camera.xView, camera.yView);
    ctx.drawImage(terrain, 0, 0, WORLD_WIDTH, WORLD_HEIGHT, -camera.xView, -camera.yView, WORLD_WIDTH, WORLD_HEIGHT);
    CANVAS.drawDestructibles(ctx, camera.xView, camera.yView);
    CANVAS.drawPowerUps(ctx, camera.xView, camera.yView);
    CANVAS.drawTanks(ctx, camera.xView, camera.yView);
    CANVAS.drawVisualEffects(ctx, camera.xView, camera.yView);
    CANVAS.drawProjectiles(ctx, camera.xView, camera.yView);

};

var renderExtern = function () {
    // draw player health
    var healthFraction = player.config.health / player.config.maxHealth;
    var cHealth = player.config.health <= 0 ? 0 : 1024 * healthFraction; // 420
    var remBar = hp.style.width;
    remBar = remBar.replace('px', '');
    
    // change health bar color as health drops 
    if      (healthFraction >= 0.75) hp.style.backgroundColor = '#66CD00'; // green        @ >= 75%
    else if (healthFraction >= 0.50) hp.style.backgroundColor = '#FFFF00'; // yellow       @ >= 50%
    else if (healthFraction >= 0.25) hp.style.backgroundColor = '#FE4902'; // vermillion   @ >= 25%
    else                             hp.style.backgroundColor = '#FF0000'; // red          @ < 25%
    
    hp.style.width = cHealth + 'px';
    
    var diff = remBar - cHealth;
    hNum.innerHTML = player.config.health.toFixed(2);
    
    if (diff > 0) {
        // if health is reduced, animate
        $('#current-health-anim').stop();
        $('#current-health-anim').animate({width: cHealth}, 500);
    }
    else if (diff < 0) {
        // if health is restored, don't animate
        $('#current-health-anim').stop();
        $('#current-health-anim').width(cHealth);
    }
};    

// MAIN
var main = function () {
    var now = performance.now();
    var delta = now - then;

    update(delta / 1000);
    renderCanvas(); // render canvas objects
    //renderExtern(); // render external objects

    
    then = now;
    mainAnimation = requestAnimationFrame(main);
    
    // check player state
    if (!player.config.active) {
        // if player is dead, show game over screen
        ui_location = 'post_game';
        UTIL.writeStats();
        showGameOver('gameover');
    }
    else if (UTIL.levelCleared()) {
        // level is cleared (i.e. all enemy tanks are destroyed)
        UTIL.writeStats();
        ui_location = 'post_game';
        showGameOver('victory');
    }
};

// Faux Main (Map Editor)
var editor = function () {

    editorUpdate();
    renderCanvas();
    
    CANVAS.drawStartingPoints(ctx, camera.xView, camera.yView); 
    MAP.drawPlaceableGhost(ctx, camera.xView, camera.yView);
    
    editorAnimation = requestAnimationFrame(editor);
};

// START
var start = function (player_name) {
    ui_location = 'game';
    
    $('#external-hud').show();
    
    var workersCreated = LOAD.gameSettings(player_name);
    workersCreated = workersCreated > 0 ? workersCreated : 1;
    var pseudoInc = 5 / workersCreated;
    
    
    terrain = TerrainImages.get('default');
    
    UTIL.fancyProgress(pseudoInc, function() {
        $('#progress').fadeOut();
        attachGameEventListeners();
        then = performance.now();
        UTIL.playMusic(backgroundMusic);
        renderExtern();
        minimapBGCtx.drawImage(terrain, 0, 0, WORLD_WIDTH / 8, WORLD_HEIGHT / 8);
        main();
    });
};

// Editor START
var startMapEditor = function () {
    
    ui_location = 'editor';

    // clear the arrays
    powerups.length = 0;
    tanks.length = 0;
    projectiles.length = 0;
    destructibles.length = 0;
    startingpoints.length = 0;
    visualeffects.length = 0;

    MAP.loadPlaceablesToUI();
    
    terrain = EditorImages.get('grass-grid');
    
    minimapBGCtx.drawImage(terrain, 0, 0, WORLD_WIDTH / 8, WORLD_HEIGHT / 8);
    camera = new Viewport.Camera(0, 0, canvas.width, canvas.height, WORLD_WIDTH, WORLD_HEIGHT);
    camera.follow(MAP.getCursor(), canvas.width/2, canvas.height/2);
    
    editor();
};

var showGameOver = function (state) {
    // stop the main interval
    cancelAnimationFrame(mainAnimation);
    
    UTIL.killTimers();
    
    switch (state) {
        case 'victory':
            $('#mt-title').html('VICTORY!');
            break;
        case 'gameover':
            $('#mt-title').html('GAME OVER!');
            break;
        default:
            break;
    }

    // show game over screen
    $('#game-over-screen').show();
    UTIL.pauseMusic(backgroundMusic);
};

attachMenuEventListeners();
attachGameEventListeners();
attachEditorEventListeners();
