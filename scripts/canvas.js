/* Module: CANVAS */

var CANVAS = (function () {
    var my = {};
    
    my.setup = function (canvas, ctx) {
        // Convert from screen coordinates to cartesian.
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        ctx.save();
        
        // default styles
        ctx.lineWidth='1';
        ctx.strokeStyle='#000';
        ctx.fillStyle = 'red';
        ctx.font = '12pt Arial';
    };
    my.clear = function (canvas, ctx) {
        // Clear the canvas.
        //ctx.save();
        //ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //ctx.restore();
    };
    my.drawTanks = function (context, xView, yView) {
        for (var i = 0; i < tanks.length; i++) {
            tanks[i].draw(context, xView, yView);
            // draw tank position on minimap
            if (tanks[i].config.active) {
                if (tanks[i].config.control === 'player') {
                    var _x = tanks[i].config.oX * 0.125;
                    var _y = tanks[i].config.oY * 0.125;
                    var toRadians = Math.PI/180;
                    minimapCtx.translate(_x, _y);
                    minimapCtx.rotate(tanks[i].config.hAngle * toRadians);
                    minimapCtx.drawImage(MinimapImages.get('player-map-object'), -64, -64);
                    minimapCtx.rotate(-tanks[i].config.hAngle * toRadians);
                    minimapCtx.translate(-_x, -_y);
                }
                else {
                    minimapCtx.beginPath();
                    minimapCtx.arc(tanks[i].config.oX/8, tanks[i].config.oY/8, 3, 0, 2 * Math.PI, false);
                    if (tanks[i].config.faction == 'friendly') {
                        minimapCtx.fillStyle = 'white';
                    }
                    else {
                        minimapCtx.fillStyle = 'orange';
                    }
                    minimapCtx.fill();
                }
            }
        }
    };
    my.drawDestructibles = function (context, xView, yView) {
        for (var i = 0; i < destructibles.length; i++) {
            destructibles[i].draw(context, xView, yView);
            // draw destructible position on minimap
            if (destructibles[i].config.active) {
                var _x = destructibles[i].config.oX * 0.125;
                var _y = destructibles[i].config.oY * 0.125;
                minimapCtx.translate(_x, _y);
                minimapCtx.drawImage(destructibles[i].images.nImage, -2, -2, 4, 4);
                minimapCtx.translate(-_x, -_y);
            }
        }
    };
    my.drawVisualEffects = function (context, xView, yView) {
        for (var i = 0; i < visualeffects.length; i++) {
            visualeffects[i].draw(context, xView, yView);
        }
    };
    my.drawLights = function (context, xView, yView) {
        for (var i = 0; i < lights.length; i++) {
            lights[i].draw(context, xView, yView);
        }
    };
    my.drawProjectiles = function (context, xView, yView) {
        /* draw all the projectiles */
        for (var i = 0; i < projectiles.length; i++) {
            // draw the projectile
            if (projectiles[i].config.active) {
                projectiles[i].draw(context, xView, yView);
            }
        }
    };
    my.drawPowerUps = function (context, xView, yView) {
        /* draw all powerups */
        for (var i = 0; i < powerups.length; i++) {
            if (powerups[i].config.image.ready) {
                var _size = powerups[i].config.size / 2; // half Size
                context.translate(powerups[i].config.oX - xView, powerups[i].config.oY - yView);
                context.drawImage(powerups[i].config.image, -_size, -_size);
                // reverse translate
                context.translate(-(powerups[i].config.oX - xView), -(powerups[i].config.oY - yView));
            }
        }
    };
    my.drawStartingPoints = function (context, xView, yView) {
        /* draw all starting points */
        for (var i = 0; i < startingpoints.length; i++) {
            context.translate(startingpoints[i].config.oX - xView, startingpoints[i].config.oY - yView);
            context.drawImage(EditorImages.get('starting-point'), -16, -16);
            // reverse translate
            context.translate(-(startingpoints[i].config.oX - xView), -(startingpoints[i].config.oY - yView));
        }
    };
    my.drawMinimapViewRect = function (context, xView, yView) {
        /* Draw the minimap. */
        context.strokeRect(xView / 8, yView / 8, 128, 76);
    };
    return my;
}());

canvas = document.getElementById('game-screen');
minimap = document.getElementById('minimap');
minimapBG = document.getElementById('minimap-bg');

WORLD_WIDTH = 1824;//canvas.width;
WORLD_HEIGHT = 1824;//canvas.height;

ctx = canvas.getContext('2d');
minimapCtx = minimap.getContext('2d');
minimapBGCtx = minimapBG.getContext('2d');

canvas.onselectstart = function() { return false; }; // turn off text selection on dragging

CANVAS.setup(canvas, ctx);
CANVAS.setup(minimap, minimapCtx);
CANVAS.setup(minimapBG, minimapBGCtx);
minimapCtx.lineWidth = '2px';
minimapCtx.strokeStyle = '#fff';

var fullArc = 2 * Math.PI;