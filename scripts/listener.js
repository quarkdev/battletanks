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
        
        // append all map options to select element
        var map_options = '<option value="0" selected="selected">Default</option>';
        for (var i = 1; i < maps.length; i++) {
            map_options += '<option value="' + i + '" >' + maps[i].name + '</option>';
        }
        
        $('#map-select').html(map_options);
        
        // show pre-game settings
        $('#prompt-pre-game-settings').show();
    });
    
    $('#start-battle-ok').click(function () {
        // hide menu
        $('.overlay').hide();
        
        // get map
        GLOBALS.map.current = maps[$('#map-select').val()];
        
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
        then = Date.now();
        if (ui_location == 'game') {
            main();
            // remove all dead timers
            UTIL.cleanTimers();
            
            // resume timers
            UTIL.resumeTimers();
            UTIL.playMusic(backgroundMusic);
        }
        if (ui_location == 'editor') editor();
    });
    
    $('.main-menu').click(function() {
        UTIL.stopMusic(backgroundMusic);
        LOAD.worker.terminateAll();
    
        cancelAnimationFrame(mainAnimation);
        cancelAnimationFrame(editorAnimation);
        
        document.getElementById('combat-log').innerHTML = ''; // clear logs
    
        // hide menu
        $('.overlay').hide();
        // goto menu
        menu();
    });
}

function attachEditorEventListeners() {
    $('#save-map').click(function () {

        // hide menu
        $('.overlay').hide();
        // show save prompt
        $('#prompt-map-name').show();
    });
    
    $('#save-map-ok').click(function () {
        // we have the map name, so we can save it.
        
        var name = document.getElementById('map-name').value;
        
        MAP.save(name);
        
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
        
        //MAP.exportToString(name);
        MAP.exportToJSON(name);
        
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
    else {
        keysDown[e.keyCode] = true;
    }
}

function gameKeyUpEvent(e) { delete keysDown[e.keyCode]; }
function gameMouseMoveEvent(evt) { mousePos = UTIL.getMousePos(canvas, evt); }
function gameMouseDownEvent(e) { if (e.which == 1) { mouseDownLeft = true; } else { mouseDownRight = true; } }
function gameMouseUpEvent(e) { mouseDownLeft = mouseDownRight = false; }