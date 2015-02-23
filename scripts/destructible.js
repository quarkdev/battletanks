/*-------- Destructibles --------*/
function Destructible(specs, x, y) {

    this.images = {
        nImage : DestructibleImages.get(specs.nImage),     // object normal image file
        dImage : DestructibleImages.get(specs.dImage),     // damaged image file
    };

    this.config = {
        active   : true,
        name     : specs.name,
        oX       : x,
        oY       : y,
        size     : specs.size,   // object size
        cRadius  : specs.size/2, // ((Math.sqrt(Math.pow(specs.size/2, 2)*2) - specs.size/2) / 2) + specs.size/2, // bounding circle radius
        health   : specs.health,  // hitpoints
        armor    : specs.armor,   // armor
        dropRate : typeof specs.dropRate === 'undefined' ? 10 : specs.dropRate,
        mod      : specs.mod      // special modifier, can be: (immortal, rubber, explosive, etc)
    };
}

Destructible.prototype.hit = function (projectile) {
    /* things to do (to the projectile) when hit... */
    var d = this.config;
    var p = projectile.config;

    var min = p.damage - 3;
    var max = p.damage + 3;
    var critical_hit = 5 > Math.random()*100 ? true : false; // crit chance, baseline is 5% @ 2x
    var raw_damage = p.damage; // raw damage
    var dmg_base_roll = Math.floor((Math.random() * max) + min);
    var mod_damage = critical_hit ? dmg_base_roll*2.0 : dmg_base_roll; // damage after mods/crit
    var damage_reduction = ((0.06 * d.armor) / (1 + 0.06 * d.armor));
    var end_damage = mod_damage - (mod_damage * damage_reduction);
        
    d.health = d.health < end_damage ? 0 : d.health - end_damage;
    
    if (d.health === 0) {
        // If destructible health is less than or zero, call death method.
        this.death();
    }
    else {
        d_explodeSound.get();
    }

    // call hit-related mods
    switch (d.mod) {
        case 'rubber': // bounce the projectile
            // 1. first determine what side was hit        

            if (p.srcType === 'projectile-barrier') {
                return; // hits from projectile barrier doesn't bounce
            }
            
            // 2. calculate new angle
            var newAngle = 0;
            
            switch (p.sideHit) {
                case 0:
                case 2:
                    newAngle = UTIL.geometry.getBounceAngle(180, p.angle);
                    break;
                case 1:
                case 3:
                    newAngle = UTIL.geometry.getBounceAngle(90, p.angle);
                    break;
            }

            // 3. Deflect projectile. Calculate new base oX and oY at 3 units offset.
            p.active = true;
            p.oY = p.PoI.y + (1 * Math.sin(newAngle*Math.PI/180));
            p.oX = p.PoI.x + (1 * Math.cos(newAngle*Math.PI/180));
            p.srcType = 'ricochet';
            p.angle = newAngle;

            break;
        case 'low-lying':
            // low-lying destructibles can't be hit by projectiles
            break;
        default:
            // play visual effect
            var hit_explosion_scale = Math.floor((Math.random() * 15) + 10);
            visualeffects.push(new VisualEffect({name: 'hit_explosion', oX: p.oX, oY: p.oY, width: 32, height: 32, scaleW: hit_explosion_scale, scaleH: hit_explosion_scale,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'explosion'}));

            // show hit flash
            var flash = new Light({
                name        : 'hit-flash',
                oX          : p.oX,
                oY          : p.oY,
                radius      : hit_explosion_scale,
                intensity   : 0.3,
                duration    : 40
            });

            lights.push(flash);

            break;
        }
};

Destructible.prototype.death = function () {
    // Set to inactive.
    var d = this.config;
    if (!d.active) {return;} // prevent multiple deaths
    d.active = false;
    GLOBALS.flags.clean.destructibles++;
    GLOBALS.rdd++;
    d_destroyedSound.get();
    
    // call death-related mods
    switch (d.mod) {
        case 'explosive': // explode on death
            visualeffects.push(new VisualEffect({name: 'des_exp', oX: d.oX, oY: d.oY, width: 256, height: 256, angle: Math.random() * 360, scaleW: 256, scaleH: 256,  maxCols: 8, maxRows: 6, framesTillUpdate: 0, loop: false, spriteSheet: 'd-exp-0'}));
            // deal damage to all tanks within range
            for (var n = 0; n < tanks.length; n++) {                 
                var dist = UTIL.geometry.getDistanceBetweenPoints({x: d.oX, y: d.oY}, {x: tanks[n].config.oX, y: tanks[n].config.oY});
                
                if (dist > 160) { continue; } // trigger distance
            
                // calculate damage
                var dmg = tanks[n].config.invulnerable > 0 ? 0 : d.armor * 32;
                var crit = 10 > Math.random() * 100;
                dmg = crit ? dmg * ((Math.random() * 3) + 1) : dmg;
                
                // deal damage to tank shield
                tanks[n].config.shield -= dmg;
                if (tanks[n].config.shield < 0) {
                    dmg = (-1)*tanks[n].config.shield;
                    tanks[n].config.shield = 0;
                }
                else {
                    dmg = 0;
                }

                // apply damage reduction from armor
                dmg -= dmg * ((0.06 * tanks[n].config.armor) / (1 + 0.06 * tanks[n].config.armor));

                // deal damage to tank health
                tanks[n].config.health -= dmg;
                tanks[n].config.health = tanks[n].config.health < 0 ? 0 : tanks[n].config.health;
                
                // animate player health if hit
                if (tanks[n].config.control === 'player') {
                    renderExtern();
                }
                
                // if tank has 0 health, destroy the tank
                if (tanks[n].config.health === 0) {
                    tanks[n].death();
                }
            }
            
            // deal damage to all destructibles within range
            for (var n = 0; n < destructibles.length; n++) {
                var dist = UTIL.geometry.getDistanceBetweenPoints({x: d.oX, y: d.oY}, {x: destructibles[n].config.oX, y: destructibles[n].config.oY});
                if (dist > 160) { continue; } // trigger distance
                
                // calculate damage
                var dmg = destructibles[n].config.mod === 'immortal' ? 0 : d.armor * 32;
                var crit = 10 > Math.random() * 100;
                dmg = crit ? dmg * ((Math.random() * 3) + 1) : dmg;
                
                // apply damage reduction from armor
                dmg -= dmg * ((0.06 * destructibles[n].config.armor) / (1 + 0.06 * destructibles[n].config.armor));
                
                // deal damage to destructible health
                destructibles[n].config.health -= dmg;
                destructibles[n].config.health = destructibles[n].config.health < 0 ? 0 : destructibles[n].config.health;
                
                // if destructible has 0 health, destroy the tank
                if (destructibles[n].config.health === 0) {
                    destructibles[n].death();
                }
            }
            
            // blow armed dummies within ranged (set chain chainExplode to true)
            for (var r = 0; r < dummies.length; r++) {
                if (dummies[r].armed) {
                    // check distance
                    var dist = UTIL.geometry.getDistanceBetweenPoints({x: dummies[r].config.oX, y: dummies[r].config.oY}, {x: d.oX, y: d.oY});
                    if (dist < 90) {
                        dummies[r].chainExplode = true;
                    }
                }
            }
    }

    /* has a chance to spawn a random powerup on death */
    var lucky = (GLOBALS.map.current.dropRate + d.dropRate) > Math.random()*100;
    if (lucky) {
        // ok just got lucky, get a random powerup
        powerups.push(PUP.createRandom(d.oX, d.oY));
    }
};

Destructible.prototype.draw = function (ctx, xView, yView) {
    var d = this.config;
    if (d.active === false) return;
    var _size = d.size / 2;
    ctx.translate(d.oX - xView, d.oY - yView);
    ctx.drawImage(this.images.nImage, -_size, -_size);
    ctx.translate(-(d.oX - xView), -(d.oY - yView));
};