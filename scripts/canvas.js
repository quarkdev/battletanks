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
        }
    };
    my.drawDestructibles = function (context, xView, yView) {
        for (var i = 0; i < destructibles.length; i++) {
            destructibles[i].draw(context, xView, yView);
        }
    };
    my.drawVisualEffects = function (context, xView, yView) {
        for (var i = 0; i < visualeffects.length; i++) {
            visualeffects[i].draw(context, xView, yView);
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
    my.drawMinimap = function (context, xView, yView) {
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