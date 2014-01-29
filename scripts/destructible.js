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
    
    this.hit = function (projectile) {
        /* things to do (to the projectile) when hit, damage is calculated on the projectile object */

        switch (this.config.mod) {
            case 'rubber': // bounce the projectile (actually fire a new pojectile)
                // 1. first determine what side was hit        
                /*
                var dX = this.config.oX - projectile.config.oX;
                var dY = this.config.oY - projectile.config.oY;
                
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
                
                if (projectile.config.sideHit === 0 || projectile.config.sideHit == 2) {
                    cBaseAngle = 360;
                }
                else if (projectile.config.sideHit == 1 || projectile.config.sideHit == 3) {
                    cBaseAngle = 540;
                }
                

                // 2. calculate new angle
                var newAngle = cBaseAngle - projectile.config.angle;

                // 3. Fire new projectile at new angle. Calculate new base oX and oY at 3 units offset.
                var _oY = projectile.config.PoI.y + (1 * Math.sin(newAngle*Math.PI/180));
                var _oX = projectile.config.PoI.x + (1 * Math.cos(newAngle*Math.PI/180));

                projectiles.push(new Projectile({ speed: projectile.config.speed, damage: projectile.config.damage, angle:  newAngle, oX: _oX, oY: _oY, srcId: projectile.config.srcId, srcType: 'ricochet'}));

                break;
            case 'explosive': // create multiple projectiles that fire in all directions, explosion damage is based on projectile damage
                if (this.config.health <= 0) { // explode on death only
                    
                    // 0
                    projectiles.push(new Projectile({
                        speed  : projectile.config.speed,
                        damage : projectile.config.damage,
                        angle  :  0,
                        oX     : this.config.oX + this.config.cRadius,
                        oY     : this.config.oY,
                        srcId  : projectile.config.srcId,
                        srcType: 'explosion'}));
                    
                    // 45
                    projectiles.push(new Projectile({
                        speed  : projectile.config.speed,
                        damage : projectile.config.damage,
                        angle  :  45,
                        oX     : this.config.oX + this.config.cRadius,
                        oY     : this.config.oY + this.config.cRadius,
                        srcId  : projectile.config.srcId,
                        srcType: 'explosion'}));
                    
                    // 90
                    projectiles.push(new Projectile({
                        speed  : projectile.config.speed,
                        damage : projectile.config.damage,
                        angle  :  90, 
                        oX     : this.config.oX,
                        oY     : this.config.oY + this.config.cRadius,
                        srcId  : projectile.config.srcId,
                        srcType: 'explosion'}));
                    
                    // 135
                    projectiles.push(new Projectile({
                        speed  : projectile.config.speed,
                        damage : projectile.config.damage,
                        angle  :  135,
                        oX     : this.config.oX + this.config.cRadius,
                        oY     : this.config.oY - this.config.cRadius,
                        srcId  : projectile.config.srcId,
                        srcType: 'explosion'}));
                    
                    // 180
                    projectiles.push(new Projectile({
                        speed  : projectile.config.speed,
                        damage : projectile.config.damage,
                        angle  :  180,
                        oX     : this.config.oX - this.config.cRadius,
                        oY     : this.config.oY,
                        srcId  : projectile.config.srcId,
                        srcType: 'explosion'}));
                    
                    // 225
                    projectiles.push(new Projectile({
                        speed  : projectile.config.speed,
                        damage : projectile.config.damage,
                        angle  :  225,
                        oX     : this.config.oX - this.config.cRadius,
                        oY     : this.config.oY - this.config.cRadius,
                        srcId  : projectile.config.srcId,
                        srcType: 'explosion'}));
                    
                    // 270
                    projectiles.push(new Projectile({
                        speed  : projectile.config.speed,
                        damage : projectile.config.damage,
                        angle  :  270,
                        oX     : this.config.oX,
                        oY     : this.config.oY - this.config.cRadius,
                        srcId  : projectile.config.srcId,
                        srcType: 'explosion'}));
                    
                    // 315
                    projectiles.push(new Projectile({
                        speed  : projectile.config.speed,
                        damage : projectile.config.damage,
                        angle  :  315,
                        oX     : this.config.oX - this.config.cRadius,
                        oY     : this.config.oY - this.config.cRadius,
                        srcId  : projectile.config.srcId,
                        srcType: 'explosion'}));
                    
                }
                break;
            default:
                break;
        }
    };
    
    this.death = function () {
        // Set to inactive.
        this.config.active = false;
   
        /* has a chance to spawn a random powerup on death */
        var lucky = Math.random() > 0.5 ? true : false;
        
        if (lucky) {
            // ok just got lucky, generate a random powerup
            var roll = Math.floor(Math.random() * 10) + 1;
            var tmp = {};
            switch (roll) {
                case 1:
                    tmp = new RapidFire(this.config.oX, this.config.oY);
                    break;
                case 2:
                    tmp = new Haste(this.config.oX, this.config.oY);
                    break;
                case 3:
                    tmp = new FasterProjectile(this.config.oX, this.config.oY);
                    break;
                case 4:
                    tmp = new IncreasedArmor(this.config.oX, this.config.oY);
                    break;
                case 5:
                    tmp = new IncreasedDamage(this.config.oX, this.config.oY);
                    break;
                case 6:
                    tmp = new AphoticShield(this.config.oX, this.config.oY);
                    break;
                case 7:
                    tmp = new ReactiveArmor(this.config.oX, this.config.oY);
                    break;
                case 8:
                    tmp = new Regeneration(this.config.oX, this.config.oY);
                    break;
                case 9:
                    tmp = new Random(this.config.oX, this.config.oY);
                    break;
                case 10:
                    tmp = new Ammo(this.config.oX, this.config.oY);
                    break;
            }
            powerups.push(tmp);
        }
    };
    
    this.draw = function () {
        if (this.config.active === false) return;
        
        var _size = this.config.size / 2;
        ctx.translate(this.config.oX, this.config.oY);
        ctx.drawImage(this.config.nImage, -_size, -_size);
        ctx.translate(-this.config.oX, -this.config.oY);
    }
}