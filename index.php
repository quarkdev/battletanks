<!DOCTYPE html>
<html>
<head>
<title>BattleTanks</title>
<link href='http://fonts.googleapis.com/css?family=Cabin+Condensed' rel='stylesheet' type='text/css'>
<link href='http://fonts.googleapis.com/css?family=Droid+Sans+Mono' rel='stylesheet' type='text/css'>
<link rel="stylesheet" type="text/css" href="css/style.css">
<script type="text/javascript" src="scripts/jquery-2.1.0.min.js"></script>
</head>
<body>
<div id="canvas-ui-wrap">
    <div id="canvas-wrap" onselectstart="return false;">
        <canvas id="game-screen" width="1024" height="608" oncontextmenu="return false;"></canvas>
        <canvas id="minimap-bg" width="228" height="228"></canvas>
        <canvas id="minimap" width="228" height="228"></canvas>
        
        <div id="progress" class="overlay">
            <div id="progress-text">Loading Assets...</div>
            <progress id="progress-bar" value="0" max="100"></progress>
            <div id="progress-text-done">...</div>
        </div>
        
        <div id="main-menu" class="overlay">
            <div class="big-title">Battle Tanks</div>
            <div class="menu-btn-container mbc-2">
                <div id="start-game" class="menu-btn">START GAME</div>
                <div id="map-builder" class="menu-btn">MAP BUILDER</div>
            </div>
        </div>
        
        <div id="pause-menu" class="overlay">
            <div class="menu-btn-container mbc-2">
                <div class="menu-btn main-menu">MAIN MENU</div>
                <div class="menu-btn continue-game">CONTINUE</div>
            </div>
        </div>
        
        <div id="editor-menu" class="overlay">
            <div class="menu-btn-container mbc-5">
                <div class="menu-btn main-menu">MAIN MENU</div>
                <div id="map-properties" class="menu-btn">PROPERTIES</div>
                <div id="save-map" class="menu-btn">SAVE MAP</div>
                <div id="import-map" class="menu-btn">IMPORT MAP</div>
                <div id="export-map" class="menu-btn">EXPORT MAP</div>
                <div class="menu-btn continue-game">CONTINUE</div>
            </div>
        </div>
        
        <div id="map-properties-screen" class="overlay">
            <form>
                <fieldset>
                    <legend style="font-weight: bold">TIMED EVENTS</legend>
                    <div style="text-align: right">
                        <input id="te-new" type="button" value="New Event">
                        <input id="te-remove-all" type="button" value="Clear Events">
                    </div>
                    <hr>
                    <div id="timed-event-container">
                    </div>
                </fieldset>
            </form>
            <div class="menu-btn continue-game" style="position: absolute; bottom: 10px; right: 20px">CONTINUE</div>
        </div>
        
        <div id="game-over-screen" class="overlay">
            <div class="menu-btn-container mbc-4">
                <div class="menu-txt" id="mt-title">GAME OVER!</div>
                <div class="stat-title">STATISTICS:</div>
                <div class="stat-txt" >Shots fired -------- <span id="stat-sf"></span></div>
                <div class="stat-txt" >Hits --------------- <span id="stat-h"></span></div>
                <div class="stat-txt" >Tanks Spawned ------ <span id="stat-ts"></span></div>
                <div class="stat-txt" >Tanks Destroyed ---- <span id="stat-td"></span></div>
                <div class="stat-txt" >Damage Dealt ------- <span id="stat-dd"></span></div>
                <div class="stat-txt" >Damage Taken ------- <span id="stat-dt"></span></div>
                <div class="menu-btn main-menu">MAIN MENU</div>
            </div>
        </div>
        
        <div id="prompt-pre-game-settings" class="overlay">
                <div id="tank-select">
                    <div id="tank-info-wrapper">
                        <div id="tank-name"></div>
                        <div id="tank-next">NEXT</div>
                        <div id="tank-prev">PREV</div>
                    </div>
                    <div id="tank-is-wrapper">
                        <div id="tank-img">
                            <div id="tank-chassis-img">
                                <div id="tank-turret-img"></div>
                            </div>
                        </div>
                        <div id="tank-stats">
                            <div class="ts-bar">FIREPOWER<div id="ts-firepower"></div></div>
                            <div class="ts-bar">RATE OF FIRE<div id="ts-firingrate"></div></div>
                            <div class="ts-bar">ARMOR<div id="ts-armor"></div></div>
                            <div class="ts-bar">MOBILITY<div id="ts-mobility"></div></div>
                        </div>
                    </div>
                </div>
                <div id="map-select-wrapper">
                    <div id="ms-prev"></div>
                    <div id="ms-img"></div>
                    <div id="ms-info">
                        <span>MAP NAME: </span>
                        <p id="ms-name"></p>
                        <hr>
                        <span>DESCRIPTION:</span>
                        <p id="ms-desc"></p>
                    </div>
                    <div id="ms-next"></div>
                </div>
                <div id="main-menu-gs" class="menu-btn main-menu">< MAIN MENU</div>
                <div id="start-battle-ok" class="menu-btn">START BATTLE ></div>
        </div>
        
        <div id="prompt-map-name" class="overlay">
            <div class="menu-btn-container mbc-3">
                <input id="map-name" type="text" value="" placeholder="Map Name" />
                <textarea id="map-desc" placeholder="Map Description"></textarea>
                <div id="save-map-ok" class="menu-btn">OK</div>
            </div>
        </div>
        
        <div id="prompt-map-name-export" class="overlay">
            <div class="menu-btn-container mbc-3">
                <input id="map-name-ex" type="text" value="" placeholder="Map Name" />
                <textarea id="map-desc-ex" placeholder="Map Description"></textarea>
                <div id="save-map-ex-ok" class="menu-btn">OK</div>
            </div>
        </div>
        
        <div id="prompt-map-import" class="overlay">
            <div class="menu-btn-container mbc-2">
                <input id="map-string" class="ui_input" type="text" value="" placeholder="Map String" />
                <div id="import-map-ok" class="menu-btn">IMPORT</div>
            </div>
        </div>
    </div>
    
    <div id="external-hud">
        <div id="health-bar">
            <div id="current-health-anim">
                <div id="current-health">
                </div>  
            </div>
            <div id="hNum">
            </div>
        </div>
    </div>
    
    <div id="combat-log"></div>
    <div id="editor-ui"></div>
</div>

<!-- Ok, let's start unloading our Javascript payload -->
<script type="text/javascript" src="scripts/init.js"></script>
<script type="text/javascript" src="scripts/util.js"></script>
<script type="text/javascript" src="scripts/viewport.js"></script>
<script type="text/javascript" src="scripts/stat.js"></script>
<script type="text/javascript" src="scripts/canvas.js"></script>
<script type="text/javascript" src="scripts/global.js"></script>
<script type="text/javascript" src="scripts/tank.js"></script>
<script type="text/javascript" src="scripts/projectile.js"></script>
<script type="text/javascript" src="scripts/destructible.js"></script>
<script type="text/javascript" src="scripts/vfx.js"></script>
<script type="text/javascript" src="scripts/powerup.js"></script>
<script type="text/javascript" src="scripts/blueprint.js"></script>
<script type="text/javascript" src="scripts/map.js"></script>
<script type="text/javascript" src="scripts/setup.js"></script>
<script type="text/javascript" src="scripts/load.js"></script>
<script type="text/javascript" src="scripts/listener.js"></script>
<script type="text/javascript" src="scripts/main.js"></script>
</body>
</html>