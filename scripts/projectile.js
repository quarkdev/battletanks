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
    
    /*
    * Public Method: update
    *
    * Updates the projectile's configuration, including collision checks
    *
    * Parameters:
    *   modifier - this is the time elapsed since the last frame/update (delta/1000)
    */
    this.update = function (modifier) {  
        var p = this.config,
            angleInRadians = p.angle * Math.PI / 180;
        
        // Save last position.
        var lastX = p.oX,
            lastY = p.oY;
        
        // Update projectile position.
        p.oX = p.oX + (p.speed * modifier * Math.cos(angleInRadians));
        p.oY = p.oY + (p.speed * modifier * Math.sin(angleInRadians));
        
        // Check for collisions. First check if it has reached the canvas outer boundary.
        if (_hasHitBoundary(p.oX, p.oY) === true) {
            this.config.active = false;
        }
        else {
            // Check if it hit a tank.
            var result = _hasHitTank(tanks, p.oX, p.oY);
            if (result.hit === true) {
            
                this.config.active = false;
                var t = result.tank;
                
                var min = p.damage - 3;
                var max = p.damage + 3;
                var critical_hit = 5 > Math.random()*100 ? true : false; // crit chance, baseline is 5% @ 2x
                var raw_damage = p.damage; // raw damage
                var dmg_base_roll = Math.floor((Math.random() * max) + min);
                var mod_damage = critical_hit ? dmg_base_roll*2.0 : dmg_base_roll; // damage after mods/crit
                var end_damage = mod_damage/t.config.armor;
                
                // play visual effect
                var hit_explosion_scale = Math.floor((Math.random() * 15) + 10);
                hit_explosion_scale = critical_hit ? hit_explosion_scale * 1.5 : hit_explosion_scale;
                visualeffects.push(new VisualEffect({name: 'hit_explosion', oX: p.oX, oY: p.oY, width: 32, height: 32, scaleW: hit_explosion_scale, scaleH: hit_explosion_scale,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'tank_explosion'}));

                
                // Call tank hit method. Pass the damage dealt.
                t.hit(end_damage, this);
                
                // record hit if source is the player and target is NOT the player
                if (this.config.srcId === player.config.id && result.tank.config.id !== player.config.id) {
                    // the one hit is an enemy
                    GameStatistics.inc('total_hits', 1);
                    GameStatistics.inc('total_damage_dealt', end_damage);
                }
                else if (this.config.srcId !== player.config.id && result.tank.config.id === player.config.id) {
                    // source is enemy tank, and target is the player
                    GameStatistics.inc('total_damage_taken', end_damage);
                }
                
                // decrease health
                t.config.health = t.config.health < end_damage ? 0 : t.config.health - end_damage;
                
                // Update combat log.
                var crit_str = critical_hit ? '<span style="color: red">[CRITICAL HIT!]</span>' : '';
                UTIL.writeToLog('<span id="log-' + logNum + '"><strong>' + p.srcId + '</strong><span style="color: #FE4902">(' + p.srcType + ')</span> hit <strong>' + t.config.id + '</strong><span style="color: #FE4902">(' + t.config.name + ')</span> for <span style="color: red">' + end_damage + '</span> damage ' + crit_str + '</span>');

                if (t.config.health <= 0) {
                    // If tank health is less than or zero, declare it as inactive/dead.
                    UTIL.writeToLog('<span id="log-' + logNum + '"><strong>' + p.srcId + '</strong><span style="color: #FE4902">(' + p.srcType + ')</span> destroyed <strong>' + t.config.id + '</strong><span style="color: #FE4902">(' + t.config.name + ')</span></span>');
                    
                    t.death(); // Call tank death method. This changes the tank state to inactive.
                    
                    // Play sound effect [random]
                    var roll = Math.floor(Math.random() * 3) + 1;
                    switch (roll) {
                        case 1:
                            t_destroyedSound.get();
                            break;
                        case 2:
                            t_destroyedSound2.get();
                            break;
                        case 3:
                            t_destroyedSound3.get();
                            break;
                    }
                }
                else {
                    // Just play the 'hit' sound effect.
                    explodeSound.get();
                }
            }
            else {
                // Check if it hit a destructible.
                var resultD = _hasHitDestructible(destructibles, p.oX, p.oY, lastX, lastY);
                if (resultD.hit === true) {
                    this.config.active = false;
                    var d = resultD.destructible;
                    
                    p.PoI = resultD.poi;
                    p.sideHit = resultD.sideH;
                    d.config.health -= p.damage/d.config.armor;

                    // Call destructible hit method.
                    d.hit(this);
                    
                    if (d.config.health <= 0) {
                        // If destructible health is less than or zero, call death method.
                        d.death();
                        
                        d_destroyedSound.get();
                    }
                    else {
                        d_explodeSound.get();
                    }
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
    this.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.config.oX, this.config.oY, 3, 0, 2 * Math.PI, false);
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
        return (x < 0 || x > canvas.width || y < 0 || y > canvas.height);
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