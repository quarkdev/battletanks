/* Module: LISTENER */

// EVENT LISTENERS
function attachMenuEventListeners() {
    $('#start-game').click(function () {
        // hide menu
        $('.overlay').hide();
        
        // retrieve all tank blueprints
        GLOBALS.tankSelection.blueprints = BLUEPRINT.getByType('tanks');
        
        // update initial stats
        UTIL.gui.updateTankStats();
        
        GLOBALS.map.current = maps[GLOBALS.map.index];
        UTIL.gui.selectMap('init');
        
        // show pre-game settings
        $('#prompt-pre-game-settings').show();
    });
    
    $('.start-battle-ok').click(function () {
        // hide menu
        $('.overlay').hide();
        
        // reset and show hud counters
        $('#text-overlay-top').html('');
        $('#text-overlay-center').html('');
        $('#kill-count').html('0');
        $('#gold-count').html('0');
        $('#ammo-count').html('0');
        TANK.upgrade.reset();
        TANK.consumable.reset();
        $('.hud').show();
        
        // get player name
        var player_name = GLOBALS.player.name;
        
        // start game
        start(player_name);
    });
    
    $('#tank-next').click(function () {
        UTIL.gui.updateTankStats('next');
    });
    
    $('#tank-prev').click(function () {
        UTIL.gui.updateTankStats('prev');
    });
    
    $('#ms-next').click(function () {
        UTIL.gui.selectMap('next');
    });
    
    $('#ms-prev').click(function () {
        UTIL.gui.selectMap('prev');
    });
    
    $('#hall-of-fame').click(function () {
        // hide menu
        $('.overlay').fadeOut();
        $('#hof').show();
        UTIL.getHighScores();
    });
    
    $('#map-builder').click(function () {
        // hide menu
        $('.overlay').fadeOut();
        // start map editor
        startMapEditor();
    });
    
    $('.continue-game').click(function () {
        // hide menu
        $('.overlay').hide();
        // continue what we were doing
        then = performance.now();
        if (ui_location == 'game') {
            main();

            // resume timers
            UTIL.timer.resumeAll();
            UTIL.playMusic(backgroundMusic);
        }
        if (ui_location == 'editor') editor();
    });
    
    $('.main-menu').click(function() {
        UTIL.stopMusic(backgroundMusic);
        LOAD.worker.terminateAll();
    
        cancelAnimationFrame(mainAnimation);
        cancelAnimationFrame(editorAnimation);
        
        clearInterval(waveCountDown);
        
        document.getElementById('combat-log').innerHTML = ''; // clear logs
    
        // hide menu
        $('.overlay').hide();
        $('.hud').hide();
        // goto menu
        menu();
    });
    
    $('#gamepedia').click(function () {
        $('.overlay').hide();
        $('#gamepedia-screen').show();
    });
    
    $('#settings').click(function () {
        $('.overlay').hide();
        
        // load default settings
        $('#set-screen-shake').val(GLOBALS.settings.screenShake);
        
        $('#settings-screen').show();
    });
}

function attachEditorEventListeners() {

    $('#map-properties').click(function () {
        $('.overlay').hide();
        $('#map-properties-screen').show();
    });

    $('#save-map').click(function () {

        // hide menu
        $('.overlay').hide();
        // show save prompt
        $('#prompt-map-name').show();
    });
    
    $('#save-map-ok').click(function () {
        // we have the map name, so we can save it.
        
        var name = document.getElementById('map-name').value;
        var desc = document.getElementById('map-desc').value;
        
        name = name === '' ? 'Unnamed Map' : name;
        desc = desc === '' ? 'No description.' : desc;
        
        MAP.save(name, desc);
        
        // hide menu
        editor();
        $('.overlay').fadeOut();
        
    });
    
    $('#export-map').click(function () {
        // hide menu
        $('.overlay').hide();
        // show prompt
        $('#prompt-map-name-export').show();
    });
    
    $('#save-map-ex-ok').click(function () {
        // we have the map name, so we can save it.
        
        var name = document.getElementById('map-name-ex').value;
        var desc = document.getElementById('map-desc-ex').value;
        
        name = name === '' ? 'Unnamed Map' : name;
        desc = desc === '' ? 'No description.' : desc;
        
        //MAP.exportToString(name);
        MAP.exportToJSON(name, desc);
        
        // hide menu
        editor();
        $('.overlay').fadeOut();
        
    });
    
    $('#import-map').click(function () {

        // hide menu
        $('.overlay').hide();
        // show prompt
        $('#prompt-map-import').show();
    });
    
    $('#import-map-ok').click(function () {
        // we have the map name, so we can save it.
        
        var mapStr = document.getElementById('map-string').value;
        
        //MAP.importFromString(mapStr);
        MAP.importFromJSON(mapStr);
        
        // hide menu
        editor();
        $('.overlay').fadeOut();
        
    });
}

function attachGameEventListeners() {
    addEventListener('keydown', gameKeyDownEvent, false);
    addEventListener('keyup', gameKeyUpEvent, false);
    canvas.addEventListener('mousemove', gameMouseMoveEvent, false);
    canvas.addEventListener('mousedown', gameMouseDownEvent, false);
    canvas.addEventListener('mouseup', gameMouseUpEvent, false);
}

function gameKeyDownEvent(e) {
    if (e.keyCode == 27) {
        pause(); // pause the game
    }
    else if (e.keyCode == 77) {
        UTIL.toggleMiniMap();
    }
    else if (e.keyCode === 85 && e.altKey) {
        // letter u, show upgrades screen if in-game
        if (ui_location === 'game' && $('#upgrades-screen').css('display') === 'none' && GLOBALS.botCount === 0) {
            // show upgrades screen only in-game and when there are no active bots
            pause();
            $('#upgrades-screen').show();
        }
    }
    else if (e.keyCode === 67 && e.altKey) {
        // letter c, show upgrades screen if in-game
        if (ui_location === 'game' && $('#consumables-screen').css('display') === 'none' && GLOBALS.botCount === 0) {
            // show consumables screen only in-game and when there are no active bots
            pause();
            $('#consumables-screen').show();
        }
    }
    else if (e.keyCode === 97 || e.keyCode === 98 || e.keyCode === 99 || e.keyCode === 100 || e.keyCode === 101) {
        switch (e.keyCode) {
            case 97:
                TANK.consumable.use(0);
                break;
            case 98:
                TANK.consumable.use(1);
                break;
            case 99:
                TANK.consumable.use(2);
                break;
            case 100:
                TANK.consumable.use(3);
                break;
            case 101:
                TANK.consumable.use(4);
                break;
        }
    }
    else {
        keysDown[e.keyCode] = true;
    }
}

function gameKeyUpEvent(e) { delete keysDown[e.keyCode]; }
function gameMouseMoveEvent(evt) { mousePos = UTIL.getMousePos(canvas, evt); }
function gameMouseDownEvent(e) { if (e.which == 1) { mouseDownLeft = true; } else { mouseDownRight = true; } }
function gameMouseUpEvent(e) { mouseDownLeft = mouseDownRight = false; }