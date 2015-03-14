/*-------- Destructibles --------*/
function Destructible(specs, x, y) {

    this.images = {
        nImage : DestructibleImages.get(specs.nImage),     // object normal image file
        dImage : DestructibleImages.get(specs.dImage),     // damaged image file
    };

    this.config = {
        active      : true,
        name        : specs.name,
        oX          : x,
        oY          : y,
        size        : specs.size,   // object size
        cRadius     : specs.size/2, // ((Math.sqrt(Math.pow(specs.size/2, 2)*2) - specs.size/2) / 2) + specs.size/2, // bounding circle radius
        health      : specs.health,  // hitpoints
        armor       : specs.armor,   // armor
        dropRate    : typeof specs.dropRate === 'undefined' ? 10 : specs.dropRate,
        material    : specs.material || 'default',
        mod         : specs.mod      // special modifier, can be: (immortal, rubber, explosive, etc)
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
    var end_damage = mod_damage * UTIL.getDamageMultiplier(d.armor);
        
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
            var impact_scale = Math.floor((Math.random() * 15) + 10);
            
            switch (d.material) {
                case 'stone':
                    impact_scale += 128;
                    var _effi = Math.floor(Math.random() * 7) + 1;
                    visualeffects.push(new VisualEffect({name: 'impact', oX: p.oX, oY: p.oY, width: 256, height: 256, angle: Math.random() * 360, scaleW: impact_scale, scaleH: impact_scale,  maxCols: 8, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'impact-stone-' + _effi}));
                    break;
                case 'metal':
                    impact_scale += 128;
                    var mete_map = [
                        [2, 2],
                        [8, 3],
                        [8, 3],
                        [4, 2],
                        [4, 2],
                        [4, 2],
                        [4, 2],
                        [4, 2],
                        [4, 2],
                        [4, 2],
                        [4, 3]
                    ];
                    var _mmi = Math.floor(Math.random() * 10);
                    visualeffects.push(new VisualEffect({name: 'impact', oX: p.oX, oY: p.oY, width: 256, height: 256, angle: Math.random() * 360, scaleW: impact_scale, scaleH: impact_scale,  maxCols: mete_map[_mmi][0], maxRows: mete_map[_mmi][1], framesTillUpdate: 0, loop: false, spriteSheet: 'impact-metal-' + _mmi}));
                    break;
                default:
                    visualeffects.push(new VisualEffect({name: 'impact', oX: p.oX, oY: p.oY, width: 32, height: 32, angle: Math.random() * 360, scaleW: impact_scale, scaleH: impact_scale,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'explosion'}));

                    // show hit flash
                    var flash = new Light({
                        name        : 'hit-flash',
                        oX          : p.oX,
                        oY          : p.oY,
                        radius      : impact_scale,
                        intensity   : 0.3,
                        duration    : 40
                    });

                    lights.push(flash);
                break;
            }

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
            UTIL.dealAreaDamage({x: d.oX, y: d.oY}, 200, 500, 120);
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