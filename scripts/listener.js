/* Module: LISTENER */

// EVENT LISTENERS
function attachMenuEventListeners() {
    $('#start-game').click(function () {
        // hide menu
        $('.overlay').hide();
        
        // show pre-game settings
        $('#prompt-pre-game-settings').fadeIn();
    });
    
    $('#start-battle-ok').click(function () {
        // hide menu
        $('.overlay').hide();
        
        // get player name
        var player_name = document.getElementById('player-name').value;
        
        // start game
        start(player_name);
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
        if (ui_location == 'game') main();
        if (ui_location == 'editor') editor();
        
        UTIL.playMusic(backgroundMusic);
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
        
        MAP.exportAsString(name);
        
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
        
        MAP.importFromString(mapStr);
        
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