<!DOCTYPE html>
<html manifest="cache.appcache">
<head>
<title>BattleTanks</title>
<link href='http://fonts.googleapis.com/css?family=Cabin+Condensed' rel='stylesheet' type='text/css'>
<link href='http://fonts.googleapis.com/css?family=Droid+Sans+Mono' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
<link rel="stylesheet" type="text/css" href="css/editor.css">
<script type="text/javascript" src="scripts/jquery-2.1.0.min.js"></script>
<script type="text/javascript" src="scripts/jquery-ui-1.10.4.custom.min.js"></script>
</head>
<body>
<div id="canvas-ui-wrap" onselectstart="return false;">
    <div id="canvas-wrap" onselectstart="return false;">
        <canvas id="game-screen" width="1024" height="608" oncontextmenu="return false;"></canvas>
        <!--<div id="light-box-radial" class="hud"></div>-->
        <div style="width: 100%; height: 610px; background: url(images/ui/hud-gradient.png) center repeat-x; display: block; position: absolute; top: 0;" class="hud"></div>
        <canvas id="minimap-bg" width="228" height="228" oncontextmenu="return false;"></canvas>
        <canvas id="minimap" width="228" height="228" oncontextmenu="return false;"></canvas>
        <div id="kill-count" class="hud">0</div>
        <div id="gold-count" class="hud">1</div>
        <div id="ammo-count" class="hud">0</div>
        <div id="inventory-hud" class="hud"></div>
        <div id="shop-ui" class="hud">
            <span style="font-weight: bold;">SHOP</span>
            <hr>
            <span class="shop-btn" onclick="pause();$('#upgrades-screen').show();">Upgrades</span><br>
            <span class="shop-btn" onclick="pause();$('#consumables-screen').show();">Consumables</span>
        </div>
        <div id="text-overlay-center" class="hud"></div>
        <div id="text-overlay-top" class="hud"></div>
        
        <?php
            // include ui screens
            include 'screens/progress.html';
            include 'screens/main_menu.html';
            include 'screens/halloffame.html';
            include 'screens/settings.html';
            include 'screens/gamepedia.html';
            include 'screens/pause.html';
            include 'screens/editor.html';
            include 'screens/map_properties.html';
                include 'screens/add_wave/add_wave.html';
                include 'screens/add_wave/update_wave.html';
                    include 'screens/add_wave/add_spawn.html';
                
            include 'screens/gameover.html';
            include 'screens/pre_game.html';
            include 'screens/prompt_map_name.html';
            include 'screens/prompt_map_name_export.html';
            include 'screens/prompt_map_import.html';
            include 'screens/upgrades.html';
            include 'screens/consumables.html';
        ?>
    </div>
    
    <div id="external-hud" class="non-interactive">
        <div id="health-bar" class="non-interactive">
            <div id="current-health-anim" class="non-interactive">
                <div id="current-health" class="non-interactive">
                </div>  
            </div>
            <div id="hNum" class="non-interactive" style="color: #fff; text-shadow: 0px 0px 8px rgba(0, 0, 0, 1);">
            </div>
        </div>
    </div>
    
    <div id="combat-log"></div>
    <div id="editor-ui"></div>
</div>

<!-- Ok, let's start unloading our Javascript payload -->
<script type="text/javascript" src="scripts/init.js"></script>
<script type="text/javascript" src="scripts/util.js"></script>
<script type="text/javascript" src="scripts/eventemitter.js"></script>
<script type="text/javascript" src="scripts/viewport.js"></script>
<script type="text/javascript" src="scripts/canvas.js"></script>
<script type="text/javascript" src="scripts/global.js"></script>
<script type="text/javascript" src="scripts/tank.js"></script>
<script type="text/javascript" src="scripts/projectile.js"></script>
<script type="text/javascript" src="scripts/destructible.js"></script>
<script type="text/javascript" src="scripts/vfx.js"></script>
<script type="text/javascript" src="scripts/lights.js"></script>
<script type="text/javascript" src="scripts/powerup.js"></script>
<script type="text/javascript" src="scripts/blueprint.js"></script>
<script type="text/javascript" src="scripts/map.js"></script>
<script type="text/javascript" src="scripts/setup.js"></script>
<script type="text/javascript" src="scripts/load.js"></script>
<script type="text/javascript" src="scripts/listener.js"></script>
<script type="text/javascript" src="scripts/main.js"></script>
</body>
</html>