/*
* lighting module
*/
var LIGHTING = (function () {
    return {
        darken : function (ctx, x, y, w, h, darkenColor, amount) {
            /* Darkens an area of the canvas. */
            ctx.fillStyle = darkenColor;
            ctx.globalAlpha = amount;
            ctx.fillRect(x, y, w, h);
            ctx.globalAlpha = 1;
        },
        lighten : function (ctx, x, y, radius, color) {
            /* Lightens an area of the canvas. */
            ctx.save();
            var rnd = 0.03 * Math.sin(1.1 * Date.now() / 1000);
            radius = radius * (1 + rnd);
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = '#0B0B00';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, radius * 0.90+rnd, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y, radius * 0.4+rnd, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        },
        lightenGradient : function (ctx, x, y, radius, intensity) {
            /* Lightens an area of the canvas using a gradient. */
            ctx.save();
            ctx.globalAlpha = intensity;
            ctx.globalCompositeOperation = 'lighter';
            var rnd = 0.05 * Math.sin(1.1 * Date.now() / 1000);
            radius = radius * (1 + rnd);
            var radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            radialGradient.addColorStop(0.0, '#BB9');
            radialGradient.addColorStop(0.2 + rnd, '#AA8');
            radialGradient.addColorStop(0.7 + rnd, '#330');
            radialGradient.addColorStop(0.90, '#110');
            radialGradient.addColorStop(1, '#000');
            ctx.fillStyle = radialGradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.restore();
        }
    };
}());

function Light(specs) {
	this.config = {
        active            : true,
        name              : specs.name,
        oX                : specs.oX,
        oY                : specs.oY,
        radius            : specs.radius,
        intensity         : specs.intensity
	};

	var l = this.config;

	this.draw = function (ctx, xView, yView) {
		if (!this.config.active) { return; }
		LIGHTING.lightenGradient(ctx, l.oX - xView, l.oY - yView, l.radius, l.intensity);
	};
}