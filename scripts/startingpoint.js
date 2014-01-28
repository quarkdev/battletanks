function StartingPoint(x, y) {
    this.config = {
        oX: x,
        oY: y
    };
}

var drawStartingPoints = function() {
    /* draw all starting points */
    for (var i = 0; i < startingpoints.length; i++) {
        ctx.translate(startingpoints[i].config.oX, startingpoints[i].config.oY);
        ctx.drawImage(EditorImages.get('starting-point'), -16, -16);
        // reverse translate
        ctx.translate(-startingpoints[i].config.oX, -startingpoints[i].config.oY);
    }
};