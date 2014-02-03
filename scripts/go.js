/* Module: Game Object */
var GO = (function () {
    var my = {};
    
    my.clear = function () {
        /* Clear all Game Objects. */
        powerups.clear();
        tanks.clear();
        projectiles.clear();
        destructibles.clear();
        startingpoints.clear();
    };
    
    return my;
}());