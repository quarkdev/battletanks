
/* ------------------------ MAIN ------------------- */ 
var menu = function() {

    ui_location = 'menu';
    
    $('#external-hud').hide();
    $('#editor-ui').hide();

    // show menu overlay
    $('#main-menu').fadeIn();
};

var pause = function () {
    // stop the main interval
    if (ui_location === 'game') {
        cancelAnimationFrame(mainAnimation);
        // remove all dead timers
        UTIL.timer.cleanAll();
        
        // pause all timers
        UTIL.timer.pauseAll();
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
var update = function(delta) {
    
    /* turn tank body to direction */
    if (37 in keysDown) { // left arrow pressed
        player.turnBody(delta, 'ccw');
    }
    
    if (39 in keysDown) { // right arrow pressed
        player.turnBody(delta, 'cw');
    }
    
    if (!(37 in keysDown) && !(39 in keysDown)) { // no left/right arrows pressed
        player.turnBody(delta, 'hold');
    }
    
    if (38 in keysDown) { // up arrow pressed
        player.move(delta, 'forward');
    }
    else if (!(40 in keysDown)) {
        player.move(delta, 'forward-stop');
    }
    
    if (40 in keysDown) { // down arrow pressed
        player.move(delta, 'reverse');
    }
    else if (!(38 in keysDown)) {
        player.move(delta, 'reverse-stop');
    }
    
    if (mouseDownLeft) {
        player.fire();
        $('#ammo-count').html(player.config.ammo);
    }
    
    player.frame(delta); // run all frame callbacks
    
    /* turn turret (based on current facing angle) */
    player.turnTurret(delta, mousePos.mX + camera.xView, mousePos.mY + camera.yView);
    
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
                
                bots[i][5].worker.postMessage(JSON.stringify(query));
            }
            
            // Update turret to last known location of player
            bots[i][0].turnTurret(delta, bots[i][4].x, bots[i][4].y);
            
            // Check if bot can see player
            if (bots[i][4].los) {
                // Check if tank within firing angle (fire only @ less than 5 degree difference)
                if (Math.abs(UTIL.geometry.getAngleBetweenLineAndHAxis({x: bots[i][0].config.oX, y: bots[i][0].config.oY}, {x: tanks[0].config.oX, y: tanks[0].config.oY}) - bots[i][0].config.tAngle) < 5) {
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
                        //bots[i][0].move(delta, 'forward-stop');
                        if (bots[i][0].config.hAngle !== move[2]) {
                            bots[i][0].velocity.forward = 0.0;
                        }
                        bots[i][0].turnBody(delta, move[1], move[2]);
                        // check if turn angle reached
                        if (bots[i][0].config.hAngle === move[2]) {
                            // if yes, pop the move
                            bots[i][1].pop();
                        }
                        break;
                    case 'move':
                        bots[i][0].turnBody(delta, 'hold');
                        bots[i][0].move(delta, 'forward', { x: move[1], y: move[2] });
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
                bots[i][5].worker.postMessage(JSON.stringify(msg));
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
                bots[i][5].worker.postMessage(JSON.stringify(msg));
            }
            
            bots[i][0].frame(delta); // run all frame callbacks
        }
    }
    
    // Update all timers
    for (i = 0; i < timers.length; i++) {
        if (timers[i].config.active) {
            timers[i].update(delta);
        }
    }

    // Update all intervals
    for (i = 0; i < intervals.length; i++) {
        if (intervals[i].config.active) {
            intervals[i].update(delta);
        }
    }
    
    // Update all dummies
    for (i = 0; i < dummies.length; i++) {
        if (dummies[i].config.active) {
            dummies[i].update(delta);
        }
    }
    
    // Update all projectiles.
    for (i = 0; i < projectiles.length; i++) {
        if (projectiles[i].config.active) {
            projectiles[i].update(delta);
        }
    }
    
    // Update all visual effects.
    for (i = 0; i < visualeffects.length; i++) {
        if (visualeffects[i].config.active) {
            visualeffects[i].update();
        }
    }
    
    // Remove all inactive timers. This keeps the timers array from accumulating inactive objects.
    if (GLOBALS.flags.clean.timers > GLOBALS.flags.clean.threshold) {
        timers = timers.filter(function (item) {
            return item.config.active;
        });
        GLOBALS.flags.clean.timers = 0;
    }
    
    // Remove all inactive intervals. This keeps the intervals array from accumulating inactive objects.
    if (GLOBALS.flags.clean.intervals > GLOBALS.flags.clean.threshold) {
        intervals = intervals.filter(function (item) {
            return item.config.active;
        });
        GLOBALS.flags.clean.intervals = 0;
    }
    
    // Remove all inactive dummies. This keeps the dummies array from accumulating inactive objects.
    if (GLOBALS.flags.clean.dummies > GLOBALS.flags.clean.threshold) {
        dummies = dummies.filter(function (item) {
            return item.config.active;
        });
        GLOBALS.flags.clean.dummies = 0;
    }
    
    // Remove all inactive projectiles. This keeps the projectiles array from accumulating inactive objects.
    if (GLOBALS.flags.clean.projectiles > GLOBALS.flags.clean.threshold) {
        projectiles = projectiles.filter(function (item) {
            return item.config.active;
        });
        GLOBALS.flags.clean.projectiles = 0;
    }
    
    // Remove all inactive lights.
    if (GLOBALS.flags.clean.visualeffects > GLOBALS.flags.clean.threshold) {
        lights = lights.filter(function (item) {
            return item.config.active;
        });
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
    if (GLOBALS.flags.clean.tanks > 0) {
        // clean the bots first
        bots = bots.filter(function (item) {
            if (item[0].config.active) {
                return true;
            }
            else {
                // tank is dead, make 1 slot available in its associated pathfinder
                item[5].clients.active -= 1;
                return false;
            }
        });
        // then clean the tanks
        tanks = tanks.filter(function (item, index) {
            return item.config.active || index === 0;
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
        
        if (191 in keysDown) { // ? key
            MAP.placeRandom();
        }
        
        cs_placement_ok = false;
        
        clearTimeout(cspo_timeout);
        
        cspo_timeout = setTimeout(function() { cs_placement_ok = true; }, 40);
    }
    
    if (110 in keysDown || mouseDownRight ) {
        MAP.removeObject();
    }

    if (!(16 in keysDown)) {
        // prevents the camera from moving while on mouse placement mode
        camera.update();
    }
};

// DRAW SCENE
var renderCanvas = function () {

    CANVAS.clear(canvas, ctx);
    CANVAS.clear(minimap, minimapCtx);
    ctx.drawImage(terrain, 0, 0, WORLD_WIDTH, WORLD_HEIGHT, -camera.xView, -camera.yView, WORLD_WIDTH, WORLD_HEIGHT);
    CANVAS.drawDestructibles(ctx, camera.xView, camera.yView);
    CANVAS.drawPowerUps(ctx, camera.xView, camera.yView);
    CANVAS.drawTanks(ctx, camera.xView, camera.yView);
    CANVAS.drawVisualEffects(ctx, camera.xView, camera.yView);
    CANVAS.drawProjectiles(ctx, camera.xView, camera.yView);
    CANVAS.drawMinimapViewRect(minimapCtx, camera.xView, camera.yView);
    //LIGHTING.darken(ctx, 0, 0, 1024, 608, '#000', 0.7);
    //LIGHTING.lightenGradient(ctx, player.config.oX - camera.xView, player.config.oY - camera.yView, 420, 1);
    CANVAS.drawLights(ctx, camera.xView, camera.yView);

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
        if (!GLOBALS.map.postgame) {
            gameover_sound.get();
            $('#text-overlay-center').css('font-size', '62px');
            $('#text-overlay-center').html('<span>You have been Defeated!</span>');
            $('#text-overlay-center').animate({
                opacity: 1,
                fontSize: '36px'
            }, 300, function () {
                $(this).delay(2000).animate({
                    opacity: 0,
                }, 300, function () {
                    ui_location = 'post_game';
                    showGameOver('gameover');
                });
            });
            GLOBALS.map.postgame = true;
        }
    }

    // Check if there are no enemies and there are none spawning
    if (GLOBALS.map.wave.enemyCount === 0 && GLOBALS.map.wave.spawning === false) {
        // if there are unspawned waves, spawn them
        if (GLOBALS.map.wave.current !== GLOBALS.map.current.waves.length) {         
            var waves = GLOBALS.map.current.waves;
            var bp_and_count = [];

            if (GLOBALS.map.wave.current !== 0) {
                // inform player that wave have been cleared, bonus gold is current_gold*10%
                GLOBALS.botCount = 0; // reset botcount

                var bonusGold = Math.ceil(tanks[0].config.coins * 0.1);
                
                $('#shop-ui').show();

                wave_cleared_sound.get();
                $('#text-overlay-center').css('font-size', '42px');
                $('#text-overlay-center').html('<span>Wave Cleared!</span><br><span style="color: #ffd700;">BONUS GOLD: ' + bonusGold + '</span>');
                $('#text-overlay-center').animate({
                    opacity: 1,
                    fontSize: '26px'
                }, 300, function () {
                    tanks[0].config.coins += bonusGold;
                    $('#gold-count').html(tanks[0].config.coins);
                    gold_pick_sound.get();
                    $(this).delay(2000).animate({
                        opacity: 0
                    }, 300);
                });
            }
            
            // inform player that wave is spawning after spawn wait time
            var wave_delay = parseInt(waves[GLOBALS.map.wave.current][2]);
            var cd_timesRun = 0;
            waveCountDown = new Interval(function () {
                cd_timesRun += 1;
                
                $('#text-overlay-top').html('Wave ' + (GLOBALS.map.wave.current + 1) + ' in ' + (wave_delay-cd_timesRun) + ' seconds...');
                
                if (cd_timesRun === wave_delay - 1) {
                    wave_start_sound.get();
                    
                    // replenish health and ammo on start of wave
                    tanks[0].config.health = tanks[0].config.maxHealth;
                    tanks[0].config.ammo = tanks[0].config.maxAmmo;
                    $('#ammo-count').html(player.config.ammo);
                    renderExtern();
                    $('#shop-ui').hide();
                    
                    $('#text-overlay-center').css('font-size', '42px');
                    $('#text-overlay-center').html('<span>Incoming! Wave #' + (GLOBALS.map.wave.current + 1) + '</span><br><span style="font-style: italic; font-weight: normal;">' + waves[GLOBALS.map.wave.current][0] + '</span>');
                    $('#text-overlay-center').animate({
                        opacity: 1,
                        fontSize: '26px'
                    }, 300, function () {
                        $(this).delay(2000).animate({
                            opacity: 0
                        }, 300);
                    });
                }
                else if (cd_timesRun >= wave_delay) {
                    waveCountDown.clear();
                    cd_timesRun = 0;
                    
                    $('#text-overlay-top').html('Wave: ' + (GLOBALS.map.wave.current));
                }
            }, 1000);
            
            // spawn for every blueprint
            GLOBALS.map.wave.spawning = true;
            
            spawn_timer = new Timer(function () {
                for (var k = 0; k < waves[GLOBALS.map.wave.current][1].length; k++) {
                    
                    bp_and_count = waves[GLOBALS.map.wave.current][1][k].split('|');
                    for (var n = 0; n < bp_and_count[1]; n++) {
                        GLOBALS.map.wave.enemyCount += 1;

                        var buffs = [];
                        if (typeof bp_and_count[2] !== 'undefined') {
                            buffs = bp_and_count[2].split(',');
                            for (var i = 0; i < buffs.length; i++) {
                                buffs[i] = buffs[i].split(':');
                            }
                        }

                        MAP.spawnEnemyAtAnyPoint(
                            bp_and_count[0],
                            [ 
                                {
                                    cb: function (tank, data) {
                                        for (var v = 0; v < data.length; v++) {
                                            tank.config[data[v][0]] += parseFloat(data[v][1]);
                                        }
                                    },
                                    args: buffs
                                }
                            ]
                        );
                    }
                }
                // update current wave
                GLOBALS.map.wave.current += 1;
                GLOBALS.map.wave.spawning = false;
            }, parseInt(waves[GLOBALS.map.wave.current][2]) * 1000);
        }
        else {
            // no more unspawned waves, declare victory!
            if (!GLOBALS.map.postgame) {
                gameover_sound.get();
                $('#text-overlay-center').css('font-size', '62px');
                $('#text-overlay-center').html('<span>You are Victorious!</span>');
                $('#text-overlay-center').animate({
                    opacity: 1,
                    fontSize: '36px'
                }, 300, function () {
                    $(this).delay(2000).animate({
                        opacity: 0,
                    }, 300, function () {
                        ui_location = 'post_game';
                        showGameOver('victory');
                    });
                });
                GLOBALS.map.postgame = true;
            }
        }
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
var start = function () {
    ui_location = 'game';
    
    $('#external-hud').show();
    
    var workersCreated = LOAD.gameSettings();
    workersCreated = workersCreated > 0 ? workersCreated : 1;
    var pseudoInc = 100 / workersCreated;
    
    UTIL.fancyProgress(pseudoInc, function() {
        $('#progress').fadeOut();
        attachGameEventListeners();
        then = performance.now();
        UTIL.playMusic(backgroundMusic);
        renderExtern();
        minimapBGCtx.drawImage(terrain, 0, 0, WORLD_WIDTH / 8, WORLD_HEIGHT / 8);
        $('#ammo-count').html(player.config.ammo);
        $('#gold-count').html(player.config.coins);
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
    dummies.length = 0;

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
    
    UTIL.timer.killAll();
    UTIL.stopMusic(backgroundMusic);
    LOAD.worker.terminateAll();
    
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
    
    UTIL.pauseMusic(backgroundMusic);

    $('submit-score').hide();
    
    // show game over screen
    $('#game-over-screen').show();
    
    // Animate stats
     $('#gos-kills').html(''); // clear first
     
    var post_stats = STAT.getAll();
    GLOBALS.statistics.tank_type_kills = [];
    
    for (var key in post_stats) {
        if (key.substr(0, 3) == 'td_') {
            if (post_stats[key] > 0) {
                GLOBALS.statistics.tank_type_kills.push({tank: key.substr(3), killed: post_stats[key]});
            }
        }
    }
    
    GLOBALS.statistics.tankAppend = 0;
    
    var looped_stat_tick = function (tank_name) {
        setTimeout(function () {
            tick_sound.get();
            $('#gosk-' + tank_name).html(GLOBALS.statistics.tankKillTicks);
            if (GLOBALS.statistics.tankKillTicks < STAT.get('td_' + tank_name)) {
                GLOBALS.statistics.tankKillTicks += 1;
                looped_stat_tick(tank_name);
            }
            else {
                looped_stat_append();
            }
        }, 25);
    };
    
    var looped_stat_append = function () {
        setTimeout(function () {
            if (GLOBALS.statistics.tankAppend < GLOBALS.statistics.tank_type_kills.length) {
                GLOBALS.statistics.tankKillTicks = 0;
                var tank_name = GLOBALS.statistics.tank_type_kills[GLOBALS.statistics.tankAppend].tank;
                $('#gos-kills').append('<br><br><span id="gosk-' + tank_name + '" style="background: url(images/tanks/' + tank_name + '/icon.png) left center no-repeat; padding-left: 52px; padding-top: 6px; padding-bottom: 6px; color: #fff; font-size: 32px;"></span>');
                looped_stat_tick(tank_name);
                GLOBALS.statistics.tankAppend += 1;
            }
            else {
                tick_sound.get();
                var totalCoins = tanks[0].config.coins;
                $('#gos-kills').append('<br><br><span id="gosk-coins" style="background: url(images/ui/dollar.png) left center no-repeat; padding-left: 52px; padding-top: 6px; padding-bottom: 6px; color: #fff; font-size: 32px;">' + totalCoins + '</span>');
                
                var best = STAT.get('total_tanks_destroyed') + totalCoins;
                var newBest = '';
                if (typeof GLOBALS.player.bestScores[GLOBALS.map.current.name] !== 'undefined') {
                    if (GLOBALS.player.bestScores[GLOBALS.map.current.name] >= best) {
                        best = GLOBALS.player.bestScores[GLOBALS.map.current.name];
                    }
                    else {
                        GLOBALS.player.bestScores[GLOBALS.map.current.name] = best;
                        newBest = '<span style="padding: 6px; font-size: 24px; color: #fff; background-color: red;">NEW!</span>';
                    }
                }
                else {
                    GLOBALS.player.bestScores[GLOBALS.map.current.name] = best;
                    newBest = '<span style="padding: 6px; font-size: 24px; color: #fff; background-color: red;">NEW!</span>';
                }
                $('#gos-kills').append('<br><br><span id="gosk-total" style="padding-top: 6px; padding-bottom: 6px; color: #fff; font-size: 32px;">TOTAL: ' + (STAT.get('total_tanks_destroyed') + totalCoins) + '</span><br><span style="padding-top: 6px; padding-bottom: 6px; color: #fff; font-size: 32px;">BEST: ' + best + ' ' + newBest + '</span>');
            
                // save bestScores to localstorage
                localStorage.setItem('best_scores', JSON.stringify(GLOBALS.player.bestScores));
                GLOBALS.statistics.lastScore = STAT.get('total_tanks_destroyed') + totalCoins;
                
                $('submit-score').show();
            }
            
        }, 50);
    };
    
    looped_stat_append();
};

attachMenuEventListeners();
attachGameEventListeners();
attachEditorEventListeners();
