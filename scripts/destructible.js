/*-------- Destructibles --------*/
function Destructible(specs, x, y) {

    this.images = {
        nImage : DestructibleImages.get(specs.nImage),     // object normal image file
        dImage : DestructibleImages.get(specs.dImage),     // damaged image file
    };

    this.config = {
        active : true,
        name   : specs.name,
        oX     : x,
        oY     : y,
        size   : specs.size,   // object size
        cRadius : specs.size/2, // ((Math.sqrt(Math.pow(specs.size/2, 2)*2) - specs.size/2) / 2) + specs.size/2, // bounding circle radius
        health : specs.health,  // hitpoints
        armor  : specs.armor,   // armor
        dropRate : typeof specs.dropRate === 'undefined' ? 10 : specs.dropRate,
        mod    : specs.mod      // special modifier, can be: (immortal, rubber, explosive, etc)
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

    switch (d.mod) {
        case 'rubber': // bounce the projectile (actually fire a new pojectile)
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
        case 'explosive': // create multiple projectiles that fire in all directions, explosion damage is based on projectile damage
            if (d.health <= 0) { // explode on death only
                
                // 0
                projectiles.push(new Projectile({
                    speed  : p.speed,
                    damage : p.damage,
                    angle  :  0,
                    oX     : d.oX + d.cRadius,
                    oY     : d.oY,
                    srcId  : p.srcId,
                    srcType: 'explosion'}));
                
                // 45
                projectiles.push(new Projectile({
                    speed  : p.speed,
                    damage : p.damage,
                    angle  :  45,
                    oX     : d.oX + d.cRadius,
                    oY     : d.oY + d.cRadius,
                    srcId  : p.srcId,
                    srcType: 'explosion'}));
                
                // 90
                projectiles.push(new Projectile({
                    speed  : p.speed,
                    damage : p.damage,
                    angle  :  90, 
                    oX     : d.oX,
                    oY     : d.oY + d.cRadius,
                    srcId  : p.srcId,
                    srcType: 'explosion'}));
                
                // 135
                projectiles.push(new Projectile({
                    speed  : p.speed,
                    damage : p.damage,
                    angle  :  135,
                    oX     : d.oX + d.cRadius,
                    oY     : d.oY - d.cRadius,
                    srcId  : p.srcId,
                    srcType: 'explosion'}));
                
                // 180
                projectiles.push(new Projectile({
                    speed  : p.speed,
                    damage : p.damage,
                    angle  :  180,
                    oX     : d.oX - d.cRadius,
                    oY     : d.oY,
                    srcId  : p.srcId,
                    srcType: 'explosion'}));
                
                // 225
                projectiles.push(new Projectile({
                    speed  : p.speed,
                    damage : p.damage,
                    angle  :  225,
                    oX     : d.oX - d.cRadius,
                    oY     : d.oY - d.cRadius,
                    srcId  : p.srcId,
                    srcType: 'explosion'}));
                
                // 270
                projectiles.push(new Projectile({
                    speed  : p.speed,
                    damage : p.damage,
                    angle  :  270,
                    oX     : d.oX,
                    oY     : d.oY - d.cRadius,
                    srcId  : p.srcId,
                    srcType: 'explosion'}));
                
                // 315
                projectiles.push(new Projectile({
                    speed  : p.speed,
                    damage : p.damage,
                    angle  :  315,
                    oX     : d.oX - d.cRadius,
                    oY     : d.oY - d.cRadius,
                    srcId  : p.srcId,
                    srcType: 'explosion'}));
                
            }
            
            visualeffects.push(new VisualEffect({name: 'explosion', oX: p.oX, oY: p.oY, width: 32, height: 32, scaleW: 32, scaleH: 32,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'explosion'}));
            // show hit flash
            var flash = new Light({
                name        : 'hit-flash',
                oX          : p.oX,
                oY          : p.oY,
                radius      : 32,
                intensity   : 0.5
            });

            lights.push(flash);
            
            new Timer(function () {
                flash.config.active = false;
            }, 40);
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
                intensity   : 0.3
            });

            lights.push(flash);
            
            new Timer(function () {
                flash.config.active = false;
            }, 40);
            break;
        }
};

Destructible.prototype.death = function () {
    // Set to inactive.
    var d = this.config;
    d.active = false;
    GLOBALS.flags.clean.destructibles++;
    GLOBALS.rdd++;
    d_destroyedSound.get();

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