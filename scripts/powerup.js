/*-------- Powerups --------*/
var PUP = (function() {
    var my = {};
    
    var pSlugs = [
        'random',
        'haste',
        'ammo',
        'projectile-barrier',
        'aphotic-shield',
        'increased-armor',
        'reactive-armor',
        'regeneration',
        'rapid-fire',
        'faster-projectile',
        'increased-damage',
        'return',
        'multi-shot'
    ];
    
    my.create = function (name, x, y) {
        switch (name) {
            case 'random':
                return new Random(x, y);
                break;
            case 'haste':
                return new Haste(x, y);
                break;
            case 'ammo':
                return new Ammo(x, y);
                break;
            case 'projectile-barrier':
                return new ProjectileBarrier(x, y);
                break;
            case 'aphotic-shield':
                return new AphoticShield(x, y);
                break;
            case 'increased-armor':
                return new IncreasedArmor(x, y);
                break;
            case 'reactive-armor':
                return new ReactiveArmor(x, y);
                break;
            case 'regeneration':
                return new Regeneration(x, y);
                break;
            case 'rapid-fire':
                return new RapidFire(x, y);
                break;
            case 'faster-projectile':
                return new FasterProjectile(x, y);
                break;
            case 'increased-damage':
                return new IncreasedDamage(x, y);
                break;
            case 'return':
                return new Return(x, y);
                break;
            case 'multi-shot':
                return new MultiShot(x, y);
                break;
            default:
                break;
        }
    };
    
    my.createRandom = function (x, y) {
        var index = Math.floor(Math.random() * pSlugs.length);
        
        return PUP.create(pSlugs[index], x, y);
    };
    
    return my;
}());

function Random(x, y) {
    /* get random effects */
    this.config = {
        name    : 'Random',
        slug    : 'random',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('random')
    };
    
    this.tmp = PUP.createRandom(x, y);
    
    this.use = function (tank) {
        this.tmp.use(tank);
        var pn = this.tmp.config.name;
        this.config.name += ' | ' + pn;
    }
}

function MultiShot(x, y) {
    /* Fires 2 extra projectiles at a slight angle. Adds another 2 extra projectiles for each stack. */
    this.config = {
        name    : 'Multi Shot',
        slug    : 'multi-shot',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('multi-shot')
    };
    
    this.use = function (tank) {
        var active = typeof tank.ts_active !== 'undefined';
        
        if (!active) {
            tank.ts_active = true;
            tank.ts_stack = 1;
        
            var multiShot = function (_oX, _oY) {
                for (var i = 1; i < tank.ts_stack + 1; i++) {
                    projectiles.push(new Projectile({speed: tank.config.pSpeed, damage: tank.config.pDamage, angle:  tank.config.tAngle - (2 * i), oX: _oX, oY: _oY, srcId: tank.config.id, srcType: tank.config.name}));
                    projectiles.push(new Projectile({speed: tank.config.pSpeed, damage: tank.config.pDamage, angle:  tank.config.tAngle + (2 * i), oX: _oX, oY: _oY, srcId: tank.config.id, srcType: tank.config.name}));
                }
            };
            multiShot.id = 'multiShot';
            
            tank.fire_callbacks.push(multiShot);
            
            tank.ts_timeout = new Timer(function () {
                delete tank.ts_active;
                delete tank.ts_timeout;
                delete tank.ts_stack;
                tank.fire_callbacks = tank.fire_callbacks.filter(function (item) { return item.id != 'multiShot'; });
            }, 20000);
        }
        else {
            tank.ts_stack += 1;
            tank.ts_timeout.reset();
        }
    };
}

function Return(x, y) {
    /* returns any (except ricochet type) projectiles to their source */
    this.config = {
        name    : 'Return',
        slug    : 'return',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('return')
    };
    
    this.use = function (tank) {
        var active = typeof tank.r_active !== 'undefined';
        
        if (!active) {
            tank.r_active = true;
            
            var returnHit = function(projectile) {
                var p = projectile.config;
            
                if (p.srcType === 'ricochet') {
                    return; // bounce once only please
                }

                var retProj = new Projectile({speed: p.speed, damage: p.damage, angle: (p.angle + 180) % 360, oX: p.oX, oY: p.oY, srcId: p.srcId, srcType: 'ricochet'});
                projectiles.push(retProj);
            };
            returnHit.id = 'returnHit';
            
            tank.hit_callbacks.push(returnHit);
            
            tank.r_timeout = new Timer(function () {
                delete tank.r_active;
                delete tank.r_timeout;
                tank.hit_callbacks = tank.hit_callbacks.filter(function (item) { return item.id != 'returnHit'; });
            }, 20000);
        }
        else {
            tank.r_timeout.reset();
        }
    };
}

function ProjectileBarrier(x, y) {
    /* causes projectiles that hit the tank to circle around forming a lethal barrier */
    this.config = {
        name    : 'Projectile Barrier',
        slug    : 'projectile-barrier',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('projectile-barrier')
    };
    
    this.use = function (tank) {
        var active = typeof tank.pb_active !== 'undefined';
    
        if (!active) {
            // array that holds the projectile barriers
            tank.pBarrier = [];
            tank.pb_active = true;
            tank.config.invulnerable++;
        
            var incBarrier = function () {
                // Increases the barrier projectile count
                var tmp = new Projectile({speed: 0, damage: tank.config.pDamage, angle: 0, oX: tank.config.oX + 35, oY: tank.config.oY, srcId: tank.config.id, srcType: 'projectile-barrier'});
                projectiles.push(tmp);
                tank.pBarrier.push([tmp, 0]);
            };
            incBarrier.id = 'incBarrier';
            
            tank.hit_callbacks.push(incBarrier);
            
            var updateBarrierSpin = function () {
                // Updates the position of each projectile tethered to the tank

                for (var i = 0; i < tank.pBarrier.length; i++) {
                    var newAngle = tank.pBarrier[i][1] === 356 ? 0 : tank.pBarrier[i][1] + 4;
                    var newLoc = UTIL.geometry.getPointAtAngleFrom(tank.config.oX, tank.config.oY, newAngle, 35);
                    tank.pBarrier[i][0].config.oX = newLoc[0];
                    tank.pBarrier[i][0].config.oY = newLoc[1];
                    tank.pBarrier[i][1] = newAngle;
                }
            };
            updateBarrierSpin.id = 'updateBarrierSpin';
            
            tank.frame_callbacks.push(updateBarrierSpin);
            
            tank.pb_timeout = new Timer(function () {    
                // deactivate all projectiles in pBarrier
                for (var i = 0; i < tank.pBarrier.length; i++) {
                    tank.pBarrier[i][0].config.active = false;
                }
                
                tank.config.invulnerable--;
                delete tank.pBarrier; // remove temp variable
                delete tank.pb_timeout;
                delete tank.pb_active;
                tank.hit_callbacks = tank.hit_callbacks.filter(function (item) { return item.id != 'incBarrier'; });
                tank.frame_callbacks = tank.move_callbacks.filter(function (item) { return item.id != 'updateBarrierSpin'; });
            }, 20000);
        }
        else {
            tank.pb_timeout.reset(); // reset timer
        }
    };
}

function RapidFire(x, y) {
    /* increases the firing rate */
    this.config = {
        name    : 'Rapid Fire',
        slug    : 'rapid-fire',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('rapid-fire')
    };
    
    this.use = function (tank) {
        tank.config.fRate += 5;
        var timer = new Timer(function () { tank.config.fRate -= 5; }, 5000);
    };
}

function Haste(x, y) {
    /* increases the movement speed */
    this.config = {
        name    : 'Haste',
        slug    : 'haste',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('haste')
    };
    
    this.use = function (tank) {
        tank.config.fSpeed += 100;
        tank.config.rSpeed += 100;
        var timer = new Timer(function () { tank.config.fSpeed -= 100; tank.config.rSpeed -= 100; }, 10000);
    };
}

function FasterProjectile(x, y) {
    /* increases the velocity of projectiles */
    this.config = {
        name    : 'Faster Projectile',
        slug    : 'faster-projectile',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('faster-projectile')
    };
    
    this.use = function (tank) {
        tank.config.pSpeed += 200;
        var timer = new Timer(function () { tank.config.pSpeed -= 200; }, 8000);
    };
}

function IncreasedArmor(x, y) {
    /* increases the armor */
    this.config = {
        name    : 'Increased Armor',
        slug    : 'increased-armor',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('increased-armor')
    };
    
    this.use = function (tank) {
        // add chassis attachment, no cleanup needed since this is an infinitely stackable powerup
        var unique_id = UTIL.genArrayId(tank.attachments.chassis);
        tank.attachments.chassis.push({id: unique_id, img: AttachmentImages.get('increased-armor')}); // add attachment
        
        tank.config.armor += 50;
        
        var timer = new Timer(function () {
            tank.config.armor -= 50;
            // remove attachment
            tank.attachments.chassis = tank.attachments.chassis.filter(function (item) { return item.id != unique_id; }); // remove all instances of unique_id
        }, 20000);
    };
}

function IncreasedDamage(x, y) {
    /* increases the armor */
    this.config = {
        name    : 'Increased Damage',
        slug    : 'increased-damage',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('increased-damage')
    };
    
    this.use = function (tank) {   
        // add turret attachment, no cleanup needed since this is an infinitely stackable powerup
        var unique_id = UTIL.genArrayId(tank.attachments.turret);
        //tank.attachments.turret = tank.attachments.turret.filter(function (item) { return item.id != unique_id; }); // cleanup
        tank.attachments.turret.push({id: unique_id, img: AttachmentImages.get('increased-damage')}); // add attachment
        
        tank.config.pDamage += 50;
        var timer = new Timer(function () { 
            tank.config.pDamage -= 50;
            // remove attachment
            tank.attachments.turret = tank.attachments.turret.filter(function (item) { return item.id != unique_id; }); // remove all instances of unique_id
        }, 20000);
    };
}

function AphoticShield(x, y) {
    /* increases the armor, absorbs projectiles */
    this.config = {
        name    : 'Aphotic Shield',
        slug    : 'aphotic-shield',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('aphotic-shield')
    };
    
    this.use = function (tank) {
        var active = typeof tank.as_active !== 'undefined';
    
        if (!active) {
            tank.as_active = true;
            tank.hitsTaken = tank.hitsTaken > 0 ? tank.hitsTaken : 0;
            
            tank.as_vfx = new VisualEffect({name: 'aphotic_shield', oX: tank.config.oX, oY: tank.config.oY, width: 32, height: 32, scaleW: 52, scaleH: 52, maxCols: 4, maxRows: 4, framesTillUpdate: 2, loop: true, spriteSheet: 'aphotic_shield'});
            visualeffects.push(tank.as_vfx);
            tank.config.invulnerable++;
            
            var absorbHit = function () {
                // keep count of hits taken
                tank.hitsTaken++;
            };
            absorbHit.id = 'absorbHit';
            
            var asAnim = function () {
                // update animation position
                tank.as_vfx.updatePos(tank.config.oX, tank.config.oY);
            };
            asAnim.id = 'asAnim';
            
            tank.frame_callbacks.push(asAnim);
            tank.hit_callbacks.push(absorbHit);
            
            tank.as_timeout = new Timer(function () {
                // fire the number of absorbed projectiles in all directions
                var aFactor = 360/tank.hitsTaken;
                var cAngle = 0;
                var x = 0;
                var y = 0;
                
                for (var i = 0; i < tank.hitsTaken; i++) {
                    // determine starting coordinates of projectile based on vector info
                    x = tank.config.oX + Math.cos(cAngle * Math.PI/180) * (tank.config.cRadius+10);
                    y = tank.config.oY + Math.sin(cAngle * Math.PI/180) * (tank.config.cRadius+10);
                    
                    // create new projectile
                    var proj = new Projectile({ speed: tank.config.pSpeed * 1.25, damage: tank.config.pDamage, angle:  cAngle, oX: x, oY: y, srcId: tank.config.id, srcType: 'blast'});
                    
                    // add projectile to array
                    projectiles.push(proj);
                    
                    // set cAngle
                    cAngle += aFactor;
                }
                
                tank.config.invulnerable--;
                tank.as_vfx.end();
                
                delete tank.hitsTaken; // remove temp variable
                delete tank.as_active;
                delete tank.as_vfx;
                delete tank.as_timeout;
                
                tank.hit_callbacks = tank.hit_callbacks.filter(function (item) { return item.id != 'absorbHit'; });
                tank.frame_callbacks = tank.frame_callbacks.filter(function (item) { return item.id != 'asAnim'; });
                d_explodeSound.get(); // play explode sound
            }, 8000);
        }
        else {
            tank.as_timeout.reset();
        } 
    };
}

function ReactiveArmor(x, y) {
    /* increases the armor each time tank is hit, "what doesn't kill you, makes you stronger" */
    this.config = {
        name    : 'Reactive Armor',
        slug    : 'reactive-armor',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('reactive-armor')
    };
    
    this.use = function (tank) {
        var active = typeof tank.ra_active !== 'undefined';
        
        if (!active) {
            tank.ra_active = true;
            tank.armorBuff = 0;
            
            var increaseArmorWhenHit = function () {
                // increase armor each hit
                tank.armorBuff += 20;
                tank.config.armor += 20;
            };
            increaseArmorWhenHit.id = 'increaseArmorWhenHit';
            
            tank.hit_callbacks.push(increaseArmorWhenHit);
            
            tank.ra_timeout = new Timer(function () {
                tank.config.armor -= tank.armorBuff;
                delete tank.armorBuff; // remove temp variable
                delete tank.ra_timeout; // remove temp variable
                delete tank.ra_active;
                tank.hit_callbacks = tank.hit_callbacks.filter(function (item) { return item.id != 'increaseArmorWhenHit'; });
            }, 20000);
        }
        else {
            tank.ra_timeout.reset();
        }
    };
}

function Regeneration(x, y) {
    /* Regenerates the tanks health, dispells on hit */
    this.config = {
        name    : 'Regeneration',
        slug    : 'regeneration',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('regeneration')
    };
    
    this.use = function (tank) {
        // can only use one
        var active = typeof tank.regen_active !== 'undefined';
        
        if (!active) {
            tank.regen_active = true;
            
            tank.regenIntervalID = setInterval(function () {
                tank.config.health = tank.config.maxHealth - tank.config.health < 0.01 ? tank.config.maxHealth : tank.config.health + 0.01;
                if (tank.config.health == tank.config.maxHealth) {
                    clearInterval(tank.regenIntervalID);
                    delete tank.regenIntervalID;
                    delete tank.dispellRegen;
                    delete tank.regen_active;
                    tank.hit_callbacks = tank.hit_callbacks.filter(function (item) { return item.id != 'dispellRegen'; });
                }
            }, 1);
        
            var dispellRegen = function () {
                // dispell regen
                clearInterval(tank.regenIntervalID);
            };
            dispellRegen.id = 'dispellRegen';
            
            tank.hit_callbacks.push(dispellRegen);
        }
    };
}

function Ammo(x, y) {
    /* additional ammunition */
    this.config = {
        name    : 'Ammo',
        slug    : 'ammo',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('ammo')
    };
    
    this.use = function (tank) {
        tank.config.ammo += 25;
    };
}