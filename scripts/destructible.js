/*-------- Destructibles --------*/
function Destructible(specs, x, y) {

    this.config = {
        active : true,
        name   : specs.name,
        nImage : DestructibleImages.get(specs.nImage),     // object normal image file
        dImage : DestructibleImages.get(specs.dImage),     // damaged image file
        oX     : x,
        oY     : y,
        size   : specs.size,   // object size
        cRadius : specs.size/2, // ((Math.sqrt(Math.pow(specs.size/2, 2)*2) - specs.size/2) / 2) + specs.size/2, // bounding circle radius
        health : specs.health,  // hitpoints
        armor  : specs.armor,   // armor
        mod    : specs.mod      // special modifier, can be: (immortal, rubber, explosive, etc)
    };
    
    var d = this.config;
    
    this.hit = function (projectile) {
        /* things to do (to the projectile) when hit... */
        
        var p = projectile.config;

        var min = p.damage - 3;
        var max = p.damage + 3;
        var critical_hit = 5 > Math.random()*100 ? true : false; // crit chance, baseline is 5% @ 2x
        var raw_damage = p.damage; // raw damage
        var dmg_base_roll = Math.floor((Math.random() * max) + min);
        var mod_damage = critical_hit ? dmg_base_roll*2.0 : dmg_base_roll; // damage after mods/crit
        var end_damage = mod_damage/d.armor;
            
        d.health = d.health < end_damage ? 0 : d.health - end_damage;
        
        if (d.health === 0) {
            // If destructible health is less than or zero, call death method.
            this.death();
            
            d_destroyedSound.get();
        }
        else {
            d_explodeSound.get();
        }

        switch (d.mod) {
            case 'rubber': // bounce the projectile (actually fire a new pojectile)
                // 1. first determine what side was hit        
                /*
                var dX = d.oX - p.oX;
                var dY = d.oY - p.oY;
                
                var tanA = Math.atan2(dY, dX) * 180/Math.PI;
                tanA = tanA + 180;
                var cBaseAngle = 360;
                
                if ((tanA > 45 && tanA < 135) || (tanA > 225 && tanA < 315)) {
                    // top or bottom is hit
                    cBaseAngle = 360;
                }
                else if ((tanA > 135 && tanA < 225) || (tanA > 315 && tanA <= 360 || tanA < 45 && tanA >= 0)) {
                    // left or right is hit (special case zero)
                    cBaseAngle = 540;
                }*/
                
                var cBaseAngle = 360;
                
                if (p.sideHit === 0 || p.sideHit == 2) {
                    cBaseAngle = 360;
                }
                else if (p.sideHit == 1 || p.sideHit == 3) {
                    cBaseAngle = 540;
                }
                

                // 2. calculate new angle
                var newAngle = cBaseAngle - p.angle;

                // 3. Fire new projectile at new angle. Calculate new base oX and oY at 3 units offset.
                var _oY = p.PoI.y + (1 * Math.sin(newAngle*Math.PI/180));
                var _oX = p.PoI.x + (1 * Math.cos(newAngle*Math.PI/180));

                projectiles.push(new Projectile({ speed: p.speed, damage: p.damage, angle:  newAngle, oX: _oX, oY: _oY, srcId: p.srcId, srcType: 'ricochet'}));

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
                break;
            default:
                break;
        }
    };
    
    this.death = function () {
        // Set to inactive.
        d.active = false;
   
        /* has a chance to spawn a random powerup on death */
        var lucky = Math.random() > 0.5 ? true : false;
        
        if (lucky) {
            // ok just got lucky, generate a random powerup
            var roll = Math.floor(Math.random() * 11) + 1;
            var tmp = {};

            switch (roll) {
                case 1:
                    tmp = new RapidFire(d.oX, d.oY);
                    break;
                case 2:
                    tmp = new Haste(d.oX, d.oY);
                    break;
                case 3:
                    tmp = new FasterProjectile(d.oX, d.oY);
                    break;
                case 4:
                    tmp = new IncreasedArmor(d.oX, d.oY);
                    break;
                case 5:
                    tmp = new IncreasedDamage(d.oX, d.oY);
                    break;
                case 6:
                    tmp = new AphoticShield(d.oX, d.oY);
                    break;
                case 7:
                    tmp = new ReactiveArmor(d.oX, d.oY);
                    break;
                case 8:
                    tmp = new Regeneration(d.oX, d.oY);
                    break;
                case 9:
                    tmp = new Random(d.oX, d.oY);
                    break;
                case 10:
                    tmp = new Ammo(d.oX, d.oY);
                    break;
                case 11:
                    tmp = new ProjectileBarrier(d.oX, d.oY);
                    break;
            }
            powerups.push(tmp);
        }
    };
    
    this.draw = function (ctx) {
        if (d.active === false) return;
        
        var _size = d.size / 2;
        ctx.translate(d.oX, d.oY);
        ctx.drawImage(d.nImage, -_size, -_size);
        ctx.translate(-d.oX, -d.oY);
    }
}