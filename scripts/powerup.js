/*-------- Powerups --------*/
function Random(x, y) {
    /* get random effects */
    this.config = {
        name    : 'Random',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('random')
    };
    
    var roll = Math.floor(Math.random() * 8) + 1;
    switch (roll) {
        case 1:
            this.tmp = new RapidFire(x, y);
            break;
        case 2:
            this.tmp = new Haste(x, y);
            break;
        case 3:
            this.tmp = new FasterProjectile(x, y);
            break;
        case 4:
            this.tmp = new IncreasedArmor(x, y);
            break;
        case 5:
            this.tmp = new IncreasedDamage(x, y);
            break;
        case 6:
            this.tmp = new AphoticShield(x, y);
            break;
        case 7:
            this.tmp = new ReactiveArmor(x, y);
            break;
        case 8:
            this.tmp = new Regeneration(x, y);
            break;
    }
    
    this.use = function(tank) {
        this.tmp.use(tank);
        var pn = this.tmp.config.name;
        this.config.name += ' | ' + pn;
    }
}

function RapidFire(x, y) {
    /* increases the firing rate */
    this.config = {
        name    : 'Rapid Fire',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('rapid-fire')
    };
    
    this.use = function(tank) {
        tank.config.fRate += 5;
        setTimeout(function() { tank.config.fRate -= 5; }, 5000);
    };
}

function Haste(x, y) {
    /* increases the movement speed */
    this.config = {
        name    : 'Haste',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('haste')
    };
    
    this.use = function(tank) {
        tank.config.fSpeed += 100;
        tank.config.rSpeed += 100;
        setTimeout(function() { tank.config.fSpeed -= 100; tank.config.rSpeed -= 100; }, 10000);
    };
}

function FasterProjectile(x, y) {
    /* increases the velocity of projectiles */
    this.config = {
        name    : 'Faster Projectile',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('faster-projectile')
    };
    
    this.use = function(tank) {
        tank.config.pSpeed += 200;
        setTimeout(function() { tank.config.pSpeed -= 200; }, 8000);
    };
}

function IncreasedArmor(x, y) {
    /* increases the armor */
    this.config = {
        name    : 'Increased Armor',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('increased-armor')
    };
    
    this.use = function(tank) {
        // add chassis attachment, no cleanup needed since this is an infinitely stackable powerup
        var unique_id = UTIL.genArrayId(tank.attachments.chassis);
        tank.attachments.chassis.push({id: unique_id, img: AttachmentImages.get('increased-armor')}); // add attachment
        
        tank.config.armor += 50;
        setTimeout(function() {
            tank.config.armor -= 50;
            // remove attachment
            tank.attachments.chassis = tank.attachments.chassis.filter(function(item) { return item.id != unique_id; }); // remove all instances of unique_id
        }, 20000);
    };
}

function IncreasedDamage(x, y) {
    /* increases the armor */
    this.config = {
        name    : 'Increased Damage',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('increased-damage')
    };
    
    this.use = function(tank) {   
        // add turret attachment, no cleanup needed since this is an infinitely stackable powerup
        var unique_id = UTIL.genArrayId(tank.attachments.turret);
        //tank.attachments.turret = tank.attachments.turret.filter(function(item) { return item.id != unique_id; }); // cleanup
        tank.attachments.turret.push({id: unique_id, img: AttachmentImages.get('increased-damage')}); // add attachment
        
        tank.config.pDamage += 50;
        setTimeout(function() { 
            tank.config.pDamage -= 50;
            // remove attachment
            tank.attachments.turret = tank.attachments.turret.filter(function(item) { return item.id != unique_id; }); // remove all instances of unique_id
        }, 20000);
    };
}

function AphoticShield(x, y) {
    /* increases the armor, absorbs projectiles */
    this.config = {
        name    : 'Aphotic Shield',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('aphotic-shield')
    };
    
    this.use = function(tank) {
        tank.hitsTaken = tank.hitsTaken > 0 ? tank.hitsTaken : 0;
        var absorbHit = function() {
            // absorb all projectile hits
            tank.hitsTaken++;
        };
        absorbHit.id = 'absorbHit';
        
        tank.callbacks.push(absorbHit);
        
        tank.config.armor += 1000; // make tank almost invulnerable
        setTimeout(function() {
            tank.config.armor -= 1000;
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
            
            delete tank.hitsTaken; // remove temp variable
            tank.callbacks = tank.callbacks.filter(function(item) { return item.id != 'absorbHit'; });
            d_explodeSound.get(); // play explode sound
        }, 8000);
    };
}

function ReactiveArmor(x, y) {
    /* increases the armor each time tank is hit, "what doesn't kill you, makes you stronger" */
    this.config = {
        name    : 'Reactive Armor',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('reactive-armor')
    };
    
    this.use = function(tank) {
        // remove any callbacks, buff doesnt stack
        clearTimeout(tank.ra_timeout);
        tank.armorBuff = tank.armorBuff > 0 ? tank.armorBuff : 0;
        
        var increaseArmorWhenHit = function() {
            // increase armor each hit
            tank.armorBuff += 10;
            tank.config.armor += 10;
        };
        increaseArmorWhenHit.id = 'increaseArmorWhenHit';
        
        tank.callbacks.push(increaseArmorWhenHit);
        
        tank.ra_timeout = setTimeout(function() {
            tank.config.armor -= tank.armorBuff;
            delete tank.armorBuff; // remove temp variable
            delete tank.ra_timeout; // remove temp variable
            tank.callbacks = tank.callbacks.filter(function(item) { return item.id != 'increaseArmorWhenHit'; });
        }, 20000);
    };
}

function Regeneration(x, y) {
    /* Regenerates the tanks health, dispells on hit */
    this.config = {
        name    : 'Regeneration',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('regeneration')
    };
    
    this.use = function(tank) {
        clearInterval(tank.regenIntervalID);
        tank.regenIntervalID = setInterval(function() {
            tank.config.health = tank.config.maxHealth - tank.config.health < 0.01 ? tank.config.maxHealth : tank.config.health + 0.01;
            if (tank.config.health == tank.config.maxHealth) {
                clearInterval(tank.regenIntervalID);
            }
        }, 1);
    
        var dispellRegen = function() {
            // dispell regen
            clearInterval(tank.regenIntervalID);
        };
        dispellRegen.id = 'dispellRegen';
        
        tank.callbacks.push(dispellRegen);
        
        setTimeout(function() {
            clearInterval(tank.regenIntervalID);
            delete tank.regenIntervalID; // remove temp variable
            tank.callbacks = tank.callbacks.filter(function(item) { return item.id != 'dispellRegen'; });
        }, 20000);
    };
}

function Ammo(x, y) {
    /* additional ammunition */
    this.config = {
        name    : 'Ammo',
        oX      : x,
        oY      : y,
        size    : 32,
        cRadius : 16,
        image   : PowerUpImages.get('ammo')
    };
    
    this.use = function(tank) {
        tank.config.ammo += 25;
    };
}