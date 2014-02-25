/*-------- Tanks --------*/
function Tank(specs, id, control, x, y) {
    this.fire_callbacks = [];
    this.hit_callbacks = []; // hit callbacks attached (powerups, etc..)
    this.move_callbacks = []; // callbacks called everytime the tank moves
    this.frame_callbacks = []; // called for each frame update (useful for powerups that require per frame animation)
    
    this.attachments = { // {id, Image()}
        turret  : [],
        chassis : []
    };

    this.velocity = {
        forward : 0.0,
        reverse : 0.0
    };
    
    this.status = {
        chassisRotateLeft   : false,
        chassisRotateRight  : false,
        chassisRotateAmount : 0.0
    };
    
    this.images = {
        chassis   : TankImages.get(specs.bImage),  // chassis image
        turret    : TankImages.get(specs.tImage),  // turret image
    };
    
    this.reloading = false;

    this.config = {
        active       : true,
        control      : control,
        id           : id,                                                                 // random-gen id
        name         : specs.name,                                                         // tank name
        type         : specs.type,                                                         // tanks type (light/medium/heavy/destroyer/howitzer)
        health       : specs.health,                                                       // tank health
        maxHealth    : specs.health,
        width        : specs.width,
        height       : specs.height,
        cx           : -specs.width/2,
        cy           : -specs.height/2,
        tWidth       : specs.tWidth,
        tHeight      : specs.tHeight,
        cxt          : -specs.tWidth/2,
        cyt          : -specs.tHeight/2,
        fireScale    : specs.fireScale,
        explodeScale : specs.explodeScale,
        armor        : specs.armor,                                                        // tank armor
        invulnerable : typeof specs.invulnerable === 'undefined' ? 0 : specs.invulnerable, // can be any integer from 0 >
        tSize        : specs.tSize,                                                        // tank turret Size (in px, must be square)
        cRadius      : Math.max(specs.width, specs.height) / 2,                            // tank max collision size (the greater value between the chassis width and height)
        sSpeed       : specs.sSpeed,                                                       // tank turn Speed (in degrees / sec)
        tSpeed       : specs.tSpeed,                                                       // turret turn Speed (in degrees / sec)
        fSpeed       : specs.fSpeed,                                                       // tank forward Speed
        rSpeed       : specs.rSpeed,                                                       // tank reverse Speed
        accel        : specs.accel,                                                        // acceleration rate (time it takes for the tank to reach max speed)
        pSpeed       : specs.pSpeed,                                                       // Projectile speed
        pDamage      : specs.pDamage,                                                      // projectile damage
        ammo         : specs.ammo,                                                         // amount of ammo
        fRate        : specs.fRate,                                                        // Firing rate (rounds per second)
        oX           : x,                                                                  // tank x coordinate
        oY           : y,                                                                  // tank y coordinate
        hAngle       : specs.hAngle,                                                       // tank head angle (the direction it is currently facing)
        tAngle       : specs.tAngle                                                        // tank turret angle (the direction the turret is facing)
    };
    
    this.x = this.config.oX;
    this.y = this.config.oY;
    
    var t = this.config;
    
    t.turretAnim = new VisualEffect({name: 'fire_recoil', oX: t.oX, oY: t.oY, width: t.tWidth, height: t.tHeight, scaleW: t.tSize, scaleH: t.tSize,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, resettable: true, paused: true, spriteSheet: t.name + '_recoil'});
    visualeffects.push(t.turretAnim);
    
    this.turnBody = function (modifier, direction, lockAngle) {
        /* lockAngle is used by AI. Prevents it from going beyond the lockAngle. */
        if (t.active === false) return;
        
        if (t.tSpeed === 0) {
            t.turretAnim.updateAngle(t.tAngle);
        }
        
        lockAngle = typeof lockAngle === 'undefined' ? false : lockAngle; 
    
        /* turn tank body to direction */
        var oldAngle = t.hAngle;
        var turnAmount = t.sSpeed*modifier;
        
        switch(direction) {
            case 'ccw':
                t.hAngle += (t.sSpeed*modifier);
                if (lockAngle !== false && Math.abs(oldAngle - lockAngle) < turnAmount) {
                    t.hAngle = lockAngle;
                }
                this.status.chassisRotateLeft = true;
                break;
            case 'cw':
                t.hAngle -= (t.sSpeed*modifier);
                if (lockAngle !== false && Math.abs(oldAngle - lockAngle) < turnAmount) {
                    t.hAngle = lockAngle;
                }
                this.status.chassisRotateRight = true;
                break;
            case 'hold':
                this.status.chassisRotateLeft = false;
                this.status.chassisRotateRight = false;
                break;
        }
        
        
        t.hAngle = t.hAngle % 360;
        t.hAngle = t.hAngle < 0 ? t.hAngle + 360 : t.hAngle;
        
        // if turret turn speed is zero (fixed-turret type), copy angle of chassis to turret
        if (t.tSpeed === 0) {
            t.tAngle = t.hAngle; 
        }
        
        this.status.chassisRotateAmount = Math.abs(oldAngle - t.hAngle);
    };
    
    this.turnTurret = function (modifier, mX, mY) {
        if (t.active === false || t.tSpeed === 0) return;
        
        t.turretAnim.updateAngle(t.tAngle);
        
        /*  1. calculate mouseCoord line angle using oX and oY
            2. calculate angle in between mc angle and current facing angle
            3. decide which angle is shorter (left/right turn)
        */
        
        var dX = mX - t.oX;
        var dY = mY - t.oY;
        
        var tanA = Math.atan2(dY, dX) * 180/Math.PI;
        tanA = tanA < 0 ? tanA + 360 : tanA;
        tanA = tanA > t.tAngle ? tanA - t.tAngle : tanA + 360 - t.tAngle;
        
        var d_add = tanA;
        var d_sub = Math.abs(360 - tanA);
        
        if (tanA === 360 || tanA === 0) {
            // nothing
        }
        else if (d_add < d_sub) {
            // turn left
            t.tAngle = tanA < (t.tSpeed*modifier) ? tanA + t.tAngle : t.tAngle + (t.tSpeed*modifier);
            if (this.status.chassisRotateLeft) {
                // if the chassis is also rotating left, add an offset
                t.tAngle += this.status.chassisRotateAmount;
            }
            else if (this.status.chassisRotateRight) {
                // its actually rotating counter, so subtract offset
                t.tAngle -= this.status.chassisRotateAmount;
            }
        }
        else if (d_add > d_sub) {
            // turn right
            t.tAngle = 360-tanA < (t.tSpeed*modifier) ? tanA + t.tAngle : t.tAngle - (t.tSpeed*modifier);
            if (this.status.chassisRotateRight) {
                // if the chassis is also rotating right, subtract an offset
                t.tAngle -= this.status.chassisRotateAmount;
            }
            else if (this.status.chassisRotateLeft) {
                // its actually rotating counter, so add offset
                t.tAngle += this.status.chassisRotateAmount;
            }
        }
        
        t.tAngle = t.tAngle % 360;
        if (t.tAngle < 0) {
            t.tAngle += 360;
        }           
    };
    
    this.move = function (modifier, direction, lockPoint) {
        /* lockPoint used by AI. Prevents it from going beyond the lockPoint. */
        
        if (t.active === false) return;
        
        /* when tank moves */
        for (var i = 0; i < this.move_callbacks.length; i++) {
            this.move_callbacks[i]();
        }
        
        t.turretAnim.updatePos(t.oX, t.oY);
        
        lockPoint = typeof lockPoint === 'undefined' ? false : lockPoint; 
    
        /* move forward or backward, modifier is time-based*/
        var tmpX = t.oX; // save old coords
        var tmpY = t.oY;
        var d, bot;
        
        switch(direction) {
            case 'forward':
                this.velocity.forward += t.accel;
                this.velocity.forward = this.velocity.forward > t.fSpeed ? t.fSpeed : this.velocity.forward;
                
                var step = modifier*this.velocity.forward;
                //var slope = Math.tan(t.hAngle * Math.PI/180);
                //var yIntercept = t.oY - (slope * t.oX);
                                
                if (lockPoint !== false) {
                    // Check if AI is near enough target point. Compare step and the required distance to target point
                    var distance_to_lockpoint = Math.sqrt(Math.pow(lockPoint.x - tmpX, 2) + Math.pow(lockPoint.y - tmpY, 2));

                    if (distance_to_lockpoint < step) {
                        // Distance is less than step, so stop at lockPoint
                        t.oX = lockPoint.x;
                        t.oY = lockPoint.y;
                    }
                    else {
                        t.oX = t.oX +  (step)*Math.cos(t.hAngle*Math.PI/180);
                        t.oY = t.oY +  (step)*Math.sin(t.hAngle*Math.PI/180);
                    }
                }
                else {
                    t.oX = t.oX +  (step)*Math.cos(t.hAngle*Math.PI/180);
                    t.oY = t.oY +  (step)*Math.sin(t.hAngle*Math.PI/180);
                }
                
                break;
            case 'reverse':
                this.velocity.reverse += t.accel;
                this.velocity.reverse = this.velocity.reverse > t.rSpeed ? t.rSpeed : this.velocity.reverse;
                t.oX = t.oX +  (modifier*this.velocity.reverse)*Math.cos((t.hAngle+180)*Math.PI/180);
                t.oY = t.oY +  (modifier*this.velocity.reverse)*Math.sin((t.hAngle+180)*Math.PI/180);
                break;
            case 'forward-stop':
                this.velocity.forward -= t.accel*3;
                this.velocity.forward = this.velocity.forward < 0.0 ? 0.0 : this.velocity.forward;
                if (lockPoint === false) {
                    t.oX = t.oX +  (modifier*this.velocity.forward)*Math.cos(t.hAngle*Math.PI/180);
                    t.oY = t.oY +  (modifier*this.velocity.forward)*Math.sin(t.hAngle*Math.PI/180);
                }
                break;
            case 'reverse-stop':
                this.velocity.reverse -= t.accel*3;
                this.velocity.reverse = this.velocity.reverse < 0.0 ? 0.0 : this.velocity.reverse;
                t.oX = t.oX +  (modifier*this.velocity.reverse)*Math.cos((t.hAngle+180)*Math.PI/180);
                t.oY = t.oY +  (modifier*this.velocity.reverse)*Math.sin((t.hAngle+180)*Math.PI/180);
                break;
        }
        
        // check if there are any objects in new coords, revert coord update if object found
        // check all destructible pos
        for (i = 0; i < destructibles.length; i++) {
            var des = destructibles[i].config;
        
            if (des.active === false) continue;
            d = Math.sqrt(Math.pow(des.oX - t.oX, 2) + Math.pow(des.oY - t.oY, 2));
            
            if (des.cRadius + t.cRadius >= d) {
                // check if this destructible is a weak one
                if (des.health < 20 && des.armor < 20 && t.width > des.size) {
                    // yep, its pretty weak, so mow it over
                    destructibles[i].death();
                    switch (direction) {
                        case 'forward':
                            this.velocity.forward -= des.health * des.armor;
                            break;
                        case 'reverse':
                            this.velocity.reverse -= des.health * des.armor;
                            break;
                    }
                }
                else {
                    t.oX = tmpX;
                    t.oY = tmpY;
                    this.velocity.forward = 0.0;
                    this.velocity.reverse = 0.0;
                    
                    // reset pathfinding
                    bot = UTIL.getBotReference(t.id);
                    if (typeof bot !== 'undefined') {
                        if (bot[3] !== 'waiting') {
                            bot[2] = 'blocked';
                        }
                    }
                }
                break;
            }
        }
        
        // check all powerup pos
        for (i = 0; i < powerups.length; i++) {
            d = Math.sqrt(Math.pow(powerups[i].config.oX - t.oX, 2) + Math.pow(powerups[i].config.oY - t.oY, 2));
            if (powerups[i].config.cRadius + t.cRadius >= d) {
            
                // apply powerup effects
                powerups[i].use(this);
                
                var powerup_name = powerups[i].config.name;
                
                delete powerups[i];
                powerups.splice(i, 1);
                
                // powerup pick sound effect
                pick_powerupSound.get();
                
                // write to log
                //UTIL.writeToLog('<span id="log-' + logNum + '"><strong>'+ t.id +'</strong><span style="color: #FE4902">(' + t.name + ')</span> used a powerup: <span style="color: blue">' + powerup_name + '</span></span>');
                
                break;
            }
        }
        
        // check all tank pos
        for (var j = 0; j < tanks.length; j++) {
            if (tanks[j].config.active === false) continue;
            d = Math.sqrt(Math.pow(tanks[j].config.oX - t.oX, 2) + Math.pow(tanks[j].config.oY - t.oY, 2));
            if (tanks[j].config.cRadius + t.cRadius >= d && tanks[j].config.id != t.id) {
                t.oX = tmpX;
                t.oY = tmpY;
                this.velocity.forward = 0.0;
                this.velocity.reverse = 0.0;
                // reset pathfinding
                bot = UTIL.getBotReference(t.id);
                if (typeof bot !== 'undefined') {
                    if (bot[3] !== 'waiting') {
                        bot[2] = 'blocked';
                    }
                }
                break;
            }
        }
        
        // check if it has reached the boundaries
        if (t.oX - t.cRadius < 0 || t.oX + t.cRadius > WORLD_WIDTH || t.oY - t.cRadius < 0 || t.oY + t.cRadius > WORLD_HEIGHT) {
            t.oX = tmpX;
            t.oY = tmpY;
            this.velocity.forward = 0.0;
            this.velocity.reverse = 0.0;
            // reset pathfinding
            bot = UTIL.getBotReference(t.id);
            if (typeof bot !== 'undefined') {
                if (bot[3] !== 'waiting') {
                    bot[2] = 'blocked';
                }
            }
        }
        
        this.x = t.oX;
        this.y = t.oY;
    };
    
    this.fire = function () {
        if (t.active === false) return;
    
        // are we still reloading?
        if (this.reloading || t.ammo === 0) { return; } 
        
        if (t.control === 'player') {
            STAT.inc('total_shots_fired', 1);
        }
        
        // if not, then fire!
        /* solve for (oX, oY) at tSize/2 distance from (oX, oY) */
        var _oY = t.oY + ((t.tWidth/2) * Math.sin(t.tAngle*Math.PI/180));
        var _oX = t.oX + ((t.tWidth/2) * Math.cos(t.tAngle*Math.PI/180));
        
        /* when tank is fires */
        for (var i = 0; i < this.fire_callbacks.length; i++) {
            this.fire_callbacks[i](_oX, _oY);
        }
        
        var proj = new Projectile({speed: t.pSpeed, damage: t.pDamage, angle:  t.tAngle, oX: _oX, oY: _oY, srcId: t.id, srcType: t.name});
        projectiles.push(proj);
        
        // take 1 ammo
        t.ammo--;
        
        // we just fired a round, let's reload
        this.reloading = true;
        var that = this; // save context
        setTimeout(function () { that.reload(); }, 1000 / t.fRate);
        
        visualeffects.push(new VisualEffect({name: 'explosion', oX: _oX, oY: _oY, width: 32, height: 32, scaleW: t.fireScale, scaleH: t.fireScale,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'explosion'}));
        
        t.turretAnim.unPause();
        // play sound effect
        fireSound.get();
    };
    
    this.reload = function () {
        if (t.active === false) return;
        this.reloading = false;
    };
    
    this.draw = function (ctx, xView, yView) {
        if (t.active === false) return;
        
        var i = 0;

        ctx.translate(t.oX - xView, t.oY - yView);
        // draw body && attachments
        ctx.rotate(t.hAngle * Math.PI/180);
        ctx.drawImage(this.images.chassis, t.cx, t.cy);
        /*for (i = 0; i < this.attachments.chassis.length; i++) {
            ctx.drawImage(this.attachments.chassis[i].img, t.cx, t.cy);
        }
        */
        ctx.rotate(-t.hAngle * Math.PI/180);
        /*// draw turret && attachments
        ctx.rotate(t.tAngle * Math.PI/180);
        ctx.drawImage(this.images.turret, t.cxt, t.cyt);
        for (i = 0; i < this.attachments.turret.length; i++) {
            ctx.drawImage(this.attachments.turret[i].img, t.cxt, t.cyt);
        }
        ctx.rotate(-t.tAngle * Math.PI/180);*/
        // reverse translate
        ctx.translate(-(t.oX - xView), -(t.oY - yView));
        
        var decPercent = (t.health / t.maxHealth);
        var lifebarLen = decPercent * t.width;
        
        if (decPercent >= 0.75) {
            ctx.fillStyle = '66CD00';
        }
        else if (decPercent >= 0.5) {
            ctx.fillStyle = 'FFFF00';
        }
        else if (decPercent >= 0.25) {
            ctx.fillStyle = 'FE4902';
        }
        else {
            ctx.fillStyle = 'FF0000';
        }
        
        ctx.fillRect((t.oX - lifebarLen/2) - xView, (t.oY + t.cRadius + 8) - yView, lifebarLen, 4);
    };
    
    this.hit = function (projectile) {
        /* when tank is hit */
        
        // calculate damage
        var p = projectile.config;
        
        var min = p.damage - 3;
        var max = p.damage + 3;
        var critical_hit = 5 > Math.random()*100 ? true : false; // crit chance, baseline is 5% @ 2x
        var raw_damage = p.damage; // raw damage
        var dmg_base_roll = Math.floor((Math.random() * max) + min);
        var mod_damage = critical_hit ? dmg_base_roll*2.0 : dmg_base_roll; // damage after mods/crit
        var end_damage = t.invulnerable > 0 ? 0 : mod_damage/t.armor;
        
        // play visual effect
        var hit_explosion_scale = Math.floor((Math.random() * 15) + 10);
        hit_explosion_scale = critical_hit ? hit_explosion_scale * 1.5 : hit_explosion_scale;
        visualeffects.push(new VisualEffect({name: 'hit_explosion', oX: p.oX, oY: p.oY, width: 32, height: 32, scaleW: hit_explosion_scale, scaleH: hit_explosion_scale,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'explosion'}));

        // record hit if source is the player and target is NOT the player
        if (p.srcId === player.config.id && t.id !== player.config.id) {
            // the one hit is an enemy
            STAT.inc('total_hits', 1);
            STAT.inc('total_damage_dealt', end_damage);
        }
        else if (p.srcId !== player.config.id && t.id === player.config.id) {
            // source is enemy tank, and target is the player
            STAT.inc('total_damage_taken', end_damage);
        }
        
        var oldHealth = t.health;
        // decrease health
        t.health = t.health < end_damage ? 0 : t.health - end_damage;
        
        // Update combat log.
        var crit_str = critical_hit ? '<span style="color: red">[CRITICAL HIT!]</span>' : '';
        //UTIL.writeToLog('<span id="log-' + logNum + '"><strong>' + p.srcId + '</strong><span style="color: #FE4902">(' + p.srcType + ')</span> hit <strong>' + t.id + '</strong><span style="color: #FE4902">(' + t.name + ')</span> for <span style="color: red">' + end_damage + '</span> damage ' + crit_str + '</span>');

        if (t.health === 0) {
            // If tank health is less than or zero, declare it as inactive/dead.
            //UTIL.writeToLog('<span id="log-' + logNum + '"><strong>' + p.srcId + '</strong><span style="color: #FE4902">(' + p.srcType + ')</span> destroyed <strong>' + t.id + '</strong><span style="color: #FE4902">(' + t.name + ')</span></span>');
            
            this.death(); // Call tank death method. This changes the tank state to inactive.
            
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
        
        for (var i = 0; i < this.hit_callbacks.length; i++) {
            this.hit_callbacks[i](projectile);
        }
        
        // render extern, only do so if there are changes
        if (t.control === 'player' && oldHealth !== t.health) {
            renderExtern();
        }
    }; 
    
    this.death = function () {
        /* Move object offscreen. Set to inactive. */
        t.active = false;
        GLOBALS.flags.clean.tanks++;
        t.turretAnim.end();

        visualeffects.push(new VisualEffect({name: 'explosion', oX: t.oX, oY: t.oY, width: 32, height: 32, scaleW: t.explodeScale, scaleH: t.explodeScale,  maxCols: 4, maxRows: 4, framesTillUpdate: 2, loop: false, spriteSheet: 'explosion'}));
        //t.oX = canvas.height+250;
        //t.oY = 0;
    };
    
    this.frame = function () {
        /* per frame callback */
        
        for (var i = 0; i < this.frame_callbacks.length; i++) {
            this.frame_callbacks[i]();
        }
    };
}