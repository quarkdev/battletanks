/*
* Public Object: Projectile
*
* A Projectile object constructor
*
* Parameters:
*   specs - contains the following properties: speed, damage, angle, oX, oY, srcId, srcType
*/
function Projectile(specs) {
    this.config = {
        active  : true,
        speed   : specs.speed,
        damage  : specs.damage,
        angle   : specs.angle,
        oX      : specs.oX,
        oY      : specs.oY,
        srcId   : specs.srcId,
        srcType : specs.srcType,
        PoI     : {x: 0, y: 0}, // Point of impact of the last collision
        sideHit : 0 // Side hit (if square)
    };
    
    var p = this.config;
    
    /*
    * Public Method: update
    *
    * Updates the projectile's configuration, including collision checks
    *
    * Parameters:
    *   modifier - this is the time elapsed since the last frame/update (delta/1000)
    */
    this.update = function (modifier) {  
        var angleInRadians = p.angle * Math.PI / 180;
        
        // Save last position.
        var lastX = p.oX,
            lastY = p.oY;
        
        // Update projectile position.
        p.oX = p.oX + (p.speed * modifier * Math.cos(angleInRadians));
        p.oY = p.oY + (p.speed * modifier * Math.sin(angleInRadians));
        
        // Check for collisions. First check if it has reached the canvas outer boundary.
        if (_hasHitBoundary(p.oX, p.oY) === true) {
            p.active = false;
        }
        else {
            // Check if it hit a tank.
            var result = _hasHitTank(tanks, p.oX, p.oY);
            if (result.hit === true) {
                p.active = false;
                var t = result.tank;
                
                // Call tank hit method. Pass the projectile that hit it.
                t.hit(this);
            }
            else {
                // Check if it hit a destructible.
                var resultD = _hasHitDestructible(destructibles, p.oX, p.oY, lastX, lastY);
                if (resultD.hit === true) {
                    p.active = false;
                    var d = resultD.destructible;
                    
                    p.PoI = resultD.poi;
                    p.sideHit = resultD.sideH;

                    // Call destructible hit method.
                    d.hit(this);
                }
            }
        }
    };
    
    /*
    * Public Method: draw
    *
    * Draws the projectile
    *
    * Parameters:
    *   ctx - the context
    */
    this.draw = function (ctx, xView, yView) {
        /*
        ctx.translate(p.oX - xView, p.oY - yView);
            ctx.drawImage(ProjectileImages.get('default'), -2.5, -2.5);
        ctx.translate(-(p.oX - xView), -(p.oY - yView));
        */
        
        ctx.beginPath();
        ctx.arc(p.oX - xView, p.oY - yView, 2.5, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        
    };
    
    /*
    * Private Method: _hasHitBoundary
    *
    * Checks if projectile have hit the outer bounds of the canvas
    *
    * Parameters:
    *   x, y - projectile coordinates
    *
    * Returns:
    *   a boolean true if hit, else a boolean false
    */
    var _hasHitBoundary = function (x, y) {      
        return (x < 0 || x > WORLD_WIDTH || y < 0 || y > WORLD_HEIGHT);
    };
    
    /*
    * Private Method: _hasHitDestructible
    *
    * Checks if projectile hit a destructible
    *
    * Parameters:
    *   destructibles - the array of destructibles
    *   x, y          - the coordinates of the projectile
    *   lastX, lastY  - the previous coodinates of the projectile (current frame - 1)
    *
    * Returns:
    *   an object with the following parameters:
    *       hit          - boolean
    *       poi          - point of impact
    *       sideH        - side of impact (used to calculate bound angle)
    *       destructible - the affected destructible
    */
    var _hasHitDestructible = function (destructibles, x, y, lastX, lastY) {
        for (var i = 0; i < destructibles.length; i++) {
            var d = destructibles[i].config;
            
            if (d.active === false) continue; // Skip inactive destructibles
            
            var lineX = UTIL.geometry.lineAxPaSquareIntersect({ s: 32, x: d.oX, y: d.oY }, { Ax: x, Ay: y, Bx: lastX, By: lastY });
            if (lineX.yes) {
                return { hit: true, poi: lineX.PoI, sideH: lineX.sideIndex, destructible: destructibles[i] };
            }
        }
        return { hit: false, poi: null, sideH: null, destructible: null };
    };
    
    /*
    * Private Method: _hasHitTank
    *
    * Checks if projectile hit a tank
    *
    * Parameters:
    *   tanks - the array of tanks
    *   x, y  - the projectile coordinates
    *
    * Returns:
    *   an object containing the parameters: hit, tank
    */
    var _hasHitTank = function (tanks, x, y) {
        for (var i = 0; i < tanks.length; i++) {
            if (tanks[i].config.active === false) continue; // Skip inactive tanks
        
            if (UTIL.geometry.pointInsideRectangle({w: tanks[i].config.width, h: tanks[i].config.height, a: tanks[i].config.hAngle, x: tanks[i].config.oX, y: tanks[i].config.oY}, {x: x, y: y})) {
                return { hit: true, tank: tanks[i] };
            }
        }
        return { hit: false, tank: null };
    };
}