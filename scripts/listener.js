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
    
    $('#start-battle-ok').click(function () {
        // hide menu
        $('.overlay').hide();
        
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
    
    $('#gamepedia').click(function () {
        UTIL.gui.loadPediaContents();
        $('.overlay').hide();
        $('#gamepedia-screen').show();
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
    
    $('#te-new').click(function () {
        // Add new timed event
        var str = '';
        
        str +=
            '<div class="timed-event">' +
                '<span>Spawn</span> ' +
                '<select class="te-blueprint" name="te-blueprint">';
                
        // retrieve all tank blueprints
        GLOBALS.tankSelection.blueprints = BLUEPRINT.getByType('tanks');
        
        str += '<option value="powerup" selected="selected">Power-Up</option>'; // set the first blueprint as default
        
        for (var i = 0; i < GLOBALS.tankSelection.blueprints.length; i++) {
            str += '<option value="' + GLOBALS.tankSelection.blueprints[i].name + '">' + GLOBALS.tankSelection.blueprints[i].name + '</option>';
        }
                
        str +=
                '</select> ' +
                '<select class="te-freq">' +
                    '<option value="after" selected="selected">after</option>' +
                    '<option value="every">every</option>' +
                '</select> ' +
                '<input class="te-timeout" name="te-timeout" type="number" value="50" style="width: 42px;"> ' +
                '<span>second(s) only if</span> ' +
                '<select class="te-constraint-a">' +
                    '<option value="active_tanks" selected="selected">Active Tanks</option>' +
                    '<option value="player_health">Player Health</option>' +
                '</select> ' +
                '<select class="te-comp">' +
                    '<option value="less_than" selected="selected">&lt;</option>' +
                    '<option value="equals">&equals;</option>' +
                    '<option value="greater_than">&gt;</option>' +
                '</select> ' +
                '<input class="te-constraint-b" type="number" value="20" style="width: 42px;"> ' +
                '<span>and</span> ' +
                '<select class="te-constraint-a2">' +
                    '<option value="total_spawned" selected="selected">Total Spawned</option>' +
                '</select> ' +
                '<select class="te-comp2"> ' +
                    '<option value="less_than" selected="selected">&lt;</option>' +
                    '<option value="equals">&equals;</option>' +
                    '<option value="greater_than">&gt;</option>' +
                '</select> ' +
                '<input class="te-constraint-b2" type="number" value="100" style="width: 42px;"> ' +
                '<input class="te-remove" type="button" value="Remove" onclick="$(this).parent().remove()"/>' +
            '</div>';
            
        $('#timed-event-container').append(str);
    });
    
    $('#te-remove-all').click(function () {
        // clear all timed events
        document.getElementById('timed-event-container').innerHTML = '';
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
    else {
        keysDown[e.keyCode] = true;
    }
}

function gameKeyUpEvent(e) { delete keysDown[e.keyCode]; }
function gameMouseMoveEvent(evt) { mousePos = UTIL.getMousePos(canvas, evt); }
function gameMouseDownEvent(e) { if (e.which == 1) { mouseDownLeft = true; } else { mouseDownRight = true; } }
function gameMouseUpEvent(e) { mouseDownLeft = mouseDownRight = false; }