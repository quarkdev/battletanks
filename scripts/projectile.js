/*-------- Projectiles --------*/
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
    
    this.update = function (modifier) {
        // Prevent update if not active.
        if (this.config.active === false) return;
    
        var p = this.config,
            angleInDegrees = p.angle * Math.PI / 180;
        
        // Save last position.
        var lastX = p.oX,
            lastY = p.oY;
        
        // Update projectile position.
        p.oX = p.oX + (p.speed * modifier * Math.cos(angleInDegrees));
        p.oY = p.oY + (p.speed * modifier * Math.sin(angleInDegrees));
        
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
                
                // Call tank hit method.
                t.hit();
                var critical_hit = 5 > Math.random()*100 ? true : false; // crit chance, baseline is 5% @ 2x
                var raw_damage = p.damage; // raw damage
                var mod_damage = critical_hit ? raw_damage*2.0 : raw_damage; // damage after mods/crit
                var end_damage = mod_damage/t.config.armor;
                
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
    
    this.draw = function (ctx) {
        // Prevent draw if not active.
        if (this.config.active === false) return;

        ctx.beginPath();
        ctx.arc(this.config.oX, this.config.oY, 3, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
    };
    
    var _hasHitBoundary = function (x, y) {      
        return (x < 0 || x > canvas.width || y < 0 || y > canvas.height);
    };
    
    var _hasHitDestructible = function (destructibles, x, y, lastX, lastY) {
        for (var i = 0; i < destructibles.length; i++) {
            var d = destructibles[i].config;
            
            if (d.active === false) continue; // Skip inactive.
            
            /* If (UTIL.geometry.pointLiesInsidePointSquare([x, y], [d.oX, d.oY], d.size)) {
                return { hit: true, destructible: destructibles[i] };
            }*/
            var lineX = UTIL.geometry.lineAxPaSquareIntersect({ s: 32, x: d.oX, y: d.oY }, { Ax: x, Ay: y, Bx: lastX, By: lastY });
            if (lineX.yes) {
                return { hit: true, poi: lineX.PoI, sideH: lineX.sideIndex, destructible: destructibles[i] };
            }
        }
        return { hit: false, poi: null, sideH: null, destructible: null };
    };
    
    var _hasHitTank = function (tanks, x, y) {
        for (var i = 0; i < tanks.length; i++) {
            if (tanks[i].config.active === false) continue; // Skip inactive.
        
            if (UTIL.geometry.pointInsideRectangle({w: tanks[i].config.width, h: tanks[i].config.height, a: tanks[i].config.hAngle, x: tanks[i].config.oX, y: tanks[i].config.oY}, {x: x, y: y})) {
                return { hit: true, tank: tanks[i] };
            }
        }
        return { hit: false, tank: null };
    };
}

var updateProjectiles = function(modifier) {
    for (var i = 0; i < projectiles.length; i++) {
        if (projectiles[i].config.active) {
            projectiles[i].update(modifier);
        }
    }
};

// Draw Projectiles
var drawProjectiles = function(ctx) {
    /* draw all the projectiles */
    for (var i = 0; i < projectiles.length; i++) {
        // draw the projectile
        if (projectiles[i].config.active) {
            projectiles[i].draw(ctx);
        }
    }
};