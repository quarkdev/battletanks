/*-------- Tanks --------*/
function Tank(specs, id, control, x, y) {
    this.callbacks = []; // callbacks attached (powerups, etc..)
    
    this.attachments = { // {id, Image()}
        turret  : new Array(),
        chassis : new Array()
    };

    this.velocity = {
        forward : 0.0,
        reverse : 0.0
    }
    
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
        active    : true,
        control   : typeof control === 'undefined' ? 'computer' : 'player',
        id        : id,                            // random-gen id
        name      : specs.name,                    // tank name
        type      : specs.type,                    // tanks type (light/medium/heavy/destroyer/howitzer)
        health    : specs.health,                  // tank health
        maxHealth : specs.health,
        width     : specs.width,
        height    : specs.height,
        cx        : -specs.width/2,
        cy        : -specs.height/2,
        tWidth    : specs.tWidth,
        tHeight   : specs.tHeight,
        cxt       : -specs.tWidth/2,
        cyt       : -specs.tHeight/2,
        armor     : specs.armor,                   // tank armor
        bSize     : specs.bSize,                   // tank body Size (in px, must be square)
        tSize     : specs.tSize,                   // tank turret Size (in px, must be square)
        cRadius   : specs.bSize/2,                 // ((Math.sqrt(Math.pow(specs.bSize/2, 2)*2) - specs.bSize/2) / 2) + specs.bSize/2, // bounding circle radius
        sSpeed    : specs.sSpeed,                  // tank turn Speed (in degrees / sec)
        tSpeed    : specs.tSpeed,                  // turret turn Speed (in degrees / sec)
        fSpeed    : specs.fSpeed,                  // tank forward Speed
        rSpeed    : specs.rSpeed,                  // tank reverse Speed
        accel     : specs.accel,                   // acceleration rate (time it takes for the tank to reach max speed)
        pSpeed    : specs.pSpeed,                  // Projectile speed
        pDamage   : specs.pDamage,                 // projectile damage
        ammo      : specs.ammo,                    // amount of ammo
        fRate     : specs.fRate,                   // Firing rate (rounds per second)
        oX        : x,                             // tank x coordinate
        oY        : y,                             // tank y coordinate
        hAngle    : specs.hAngle,                  // tank head angle (the direction it is currently facing)
        tAngle    : specs.tAngle                   // tank turret angle (the direction the turret is facing)
    };
    
    this.turnBody = function (modifier, direction, lockAngle) {
        /* lockAngle is used by AI. Prevents it from going beyond the lockAngle. */
        if (this.config.active === false) return;
        
        lockAngle = typeof lockAngle === 'undefined' ? false : lockAngle; 
    
        /* turn tank body to direction */
        var oldAngle = this.config.hAngle;
        var turnAmount = this.config.sSpeed*modifier;
        
        switch(direction) {
            case 'ccw':
                this.config.hAngle += (this.config.sSpeed*modifier);
                if (lockAngle !== false && Math.abs(oldAngle - lockAngle) < turnAmount) {
                    this.config.hAngle = lockAngle;
                }
                this.status.chassisRotateLeft = true;
                break;
            case 'cw':
                this.config.hAngle -= (this.config.sSpeed*modifier);
                if (lockAngle !== false && Math.abs(oldAngle - lockAngle) < turnAmount) {
                    this.config.hAngle = lockAngle;
                }
                this.status.chassisRotateRight = true;
                break;
            case 'hold':
                this.status.chassisRotateLeft = false;
                this.status.chassisRotateRight = false;
                break;
        }
        
        
        this.config.hAngle = this.config.hAngle % 360;
        this.config.hAngle = this.config.hAngle < 0 ? this.config.hAngle + 360 : this.config.hAngle;
        
        // if turret turn speed is zero (fixed-turret type), copy angle of chassis to turret
        if (this.config.tSpeed === 0) {
            this.config.tAngle = this.config.hAngle; 
        }
        
        this.status.chassisRotateAmount = Math.abs(oldAngle - this.config.hAngle);
    };
    
    this.turnTurret = function (modifier, mX, mY) {
        if (this.config.active === false || this.config.tSpeed === 0) return;
    
        /*  1. calculate mouseCoord line angle using oX and oY
            2. calculate angle in between mc angle and current facing angle
            3. decide which angle is shorter (left/right turn)
        */
        var dX = mX - this.config.oX;
        var dY = mY - this.config.oY;
        
        var tanA = Math.atan2(dY, dX) * 180/Math.PI;
        tanA = tanA < 0 ? tanA + 360 : tanA;
        tanA = tanA > this.config.tAngle ? tanA - this.config.tAngle : tanA + 360 - this.config.tAngle;
        
        var d_add = tanA;
        var d_sub = Math.abs(360 - tanA);
        
        if (tanA === 360) {
            // nothing
        }
        else if (d_add < d_sub) {
            // turn left
            this.config.tAngle = tanA < (this.config.tSpeed*modifier) ? tanA + this.config.tAngle : this.config.tAngle + (this.config.tSpeed*modifier);
            if (this.status.chassisRotateLeft) {
                // if the chassis is also rotating left, add an offset
                this.config.tAngle += this.status.chassisRotateAmount;
            }
            else if (this.status.chassisRotateRight) {
                // its actually rotating counter, so subtract offset
                this.config.tAngle -= this.status.chassisRotateAmount;
            }
        }
        else if (d_add > d_sub) {
            // turn right
            this.config.tAngle = 360-tanA < (this.config.tSpeed*modifier) ? tanA + this.config.tAngle : this.config.tAngle - (this.config.tSpeed*modifier);
            if (this.status.chassisRotateRight) {
                // if the chassis is also rotating right, subtract an offset
                this.config.tAngle -= this.status.chassisRotateAmount;
            }
            else if (this.status.chassisRotateLeft) {
                // its actually rotating counter, so add offset
                this.config.tAngle += this.status.chassisRotateAmount;
            }
        }
        
        this.config.tAngle = this.config.tAngle % 360;
        if (this.config.tAngle < 0) {
            this.config.tAngle += 360;
        }           
    };
    
    this.move = function (modifier, direction, lockPoint) {
        /* lockPoint used by AI. Prevents it from going beyond the lockPoint. */
        
        if (this.config.active === false) return;
        
        lockPoint = typeof lockPoint === 'undefined' ? false : lockPoint; 
    
        /* move forward or backward, modifier is time-based*/
        var tmpX = this.config.oX; // save old coords
        var tmpY = this.config.oY;
        
        switch(direction) {
            case 'forward':
                this.velocity.forward += this.config.accel;
                this.velocity.forward = this.velocity.forward > this.config.fSpeed ? this.config.fSpeed : this.velocity.forward;
                
                var step = modifier*this.velocity.forward;
                //var slope = Math.tan(this.config.hAngle * Math.PI/180);
                //var yIntercept = this.config.oY - (slope * this.config.oX);
                                
                if (lockPoint !== false) {
                    // Check if AI is near enough target point. Compare step and the required distance to target point
                    var distance_to_lockpoint = Math.sqrt(Math.pow(lockPoint.x - tmpX, 2) + Math.pow(lockPoint.y - tmpY, 2));

                    if (distance_to_lockpoint < step) {
                        // Distance is less than step, so stop at lockPoint
                        this.config.oX = lockPoint.x;
                        this.config.oY = lockPoint.y;
                    }
                    else {
                        this.config.oX = this.config.oX +  (step)*Math.cos(this.config.hAngle*Math.PI/180);
                        this.config.oY = this.config.oY +  (step)*Math.sin(this.config.hAngle*Math.PI/180);
                    }
                }
                else {
                    this.config.oX = this.config.oX +  (step)*Math.cos(this.config.hAngle*Math.PI/180);
                    this.config.oY = this.config.oY +  (step)*Math.sin(this.config.hAngle*Math.PI/180);
                }
                
                break;
            case 'reverse':
                this.velocity.reverse += this.config.accel;
                this.velocity.reverse = this.velocity.reverse > this.config.rSpeed ? this.config.rSpeed : this.velocity.reverse;
                this.config.oX = this.config.oX +  (modifier*this.velocity.reverse)*Math.cos((this.config.hAngle+180)*Math.PI/180);
                this.config.oY = this.config.oY +  (modifier*this.velocity.reverse)*Math.sin((this.config.hAngle+180)*Math.PI/180);
                break;
            case 'forward-stop':
                this.velocity.forward -= this.config.accel*3;
                this.velocity.forward = this.velocity.forward < 0.0 ? 0.0 : this.velocity.forward;
                if (lockPoint === false) {
                    this.config.oX = this.config.oX +  (modifier*this.velocity.forward)*Math.cos(this.config.hAngle*Math.PI/180);
                    this.config.oY = this.config.oY +  (modifier*this.velocity.forward)*Math.sin(this.config.hAngle*Math.PI/180);
                }
                break;
            case 'reverse-stop':
                this.velocity.reverse -= this.config.accel*3;
                this.velocity.reverse = this.velocity.reverse < 0.0 ? 0.0 : this.velocity.reverse;
                this.config.oX = this.config.oX +  (modifier*this.velocity.reverse)*Math.cos((this.config.hAngle+180)*Math.PI/180);
                this.config.oY = this.config.oY +  (modifier*this.velocity.reverse)*Math.sin((this.config.hAngle+180)*Math.PI/180);
                break;
        }
        
        // check if there are any objects in new coords, revert coord update if object found
        // check all destructible pos
        for (var i = 0; i < destructibles.length; i++) {
            if (destructibles[i].config.active === false) continue;
            var d = Math.sqrt(Math.pow(destructibles[i].config.oX - this.config.oX, 2) + Math.pow(destructibles[i].config.oY - this.config.oY, 2));
            if (destructibles[i].config.cRadius + this.config.cRadius >= d) {
                this.config.oX = tmpX;
                this.config.oY = tmpY;
                this.velocity.forward = 0.0;
                this.velocity.reverse = 0.0;
                
                // reset pathfinding
                var bot = UTIL.getBotReference(this.config.id);
                if (typeof bot !== 'undefined') {
                    bot[2] = 'blocked';
                }
                break;
            }
        }
        
        // check all powerup pos
        for (var i = 0; i < powerups.length; i++) {
            var d = Math.sqrt(Math.pow(powerups[i].config.oX - this.config.oX, 2) + Math.pow(powerups[i].config.oY - this.config.oY, 2));
            if (powerups[i].config.cRadius + this.config.cRadius >= d) {
            
                // apply powerup effects
                powerups[i].use(this);
                
                var powerup_name = powerups[i].config.name;
                
                delete powerups[i];
                powerups.splice(i, 1);
                
                // powerup pick sound effect
                pick_powerupSound.get();
                
                // write to log
                UTIL.writeToLog('<span id="log-' + logNum + '"><strong>'+ this.config.id +'</strong><span style="color: #FE4902">(' + this.config.name + ')</span> used a powerup: <span style="color: blue">' + powerup_name + '</span></span>');
                
                break;
            }
        }
        
        // check all tank pos
        for (var j = 0; j < tanks.length; j++) {
            if (tanks[j].config.active === false) continue;
            d = Math.sqrt(Math.pow(tanks[j].config.oX - this.config.oX, 2) + Math.pow(tanks[j].config.oY - this.config.oY, 2));
            if (tanks[j].config.cRadius + this.config.cRadius >= d && tanks[j].config.id != this.config.id) {
                this.config.oX = tmpX;
                this.config.oY = tmpY;
                this.velocity.forward = 0.0;
                this.velocity.reverse = 0.0;
                // reset pathfinding
                var bot = UTIL.getBotReference(this.config.id);
                if (typeof bot !== 'undefined') {
                    bot[2] = 'blocked';
                }
                break;
            }
        }
        
        // check if it has reached the boundaries
        if (this.config.oX - this.config.cRadius < 0 || this.config.oX + this.config.cRadius > canvas.width || this.config.oY - this.config.cRadius < 0 || this.config.oY + this.config.cRadius > canvas.height) {
            this.config.oX = tmpX;
            this.config.oY = tmpY;
            this.velocity.forward = 0.0;
            this.velocity.reverse = 0.0;
            // reset pathfinding
            var bot = UTIL.getBotReference(this.config.id);
            if (typeof bot !== 'undefined') {
                bot[2] = 'blocked';
            }
        }
    };
    
    this.fire = function () {
        if (this.config.active === false) return;
    
        // are we still reloading?
        if (this.reloading || this.config.ammo == 0) { return; } 
        
        // if not, then fire!
        /* solve for (oX, oY) at tSize/2 distance from (oX, oY) */
        var _oY = this.config.oY + ((this.config.tWidth/2) * Math.sin(this.config.tAngle*Math.PI/180));
        var _oX = this.config.oX + ((this.config.tWidth/2) * Math.cos(this.config.tAngle*Math.PI/180));
        var proj = new Projectile({speed: this.config.pSpeed, damage: this.config.pDamage, angle:  this.config.tAngle, oX: _oX, oY: _oY, srcId: this.config.id, srcType: this.config.name});
        projectiles.push(proj);
        
        // take 1 ammo
        this.config.ammo--;
        
        // we just fired a round, let's reload
        this.reloading = true;
        var that = this; // save context
        setTimeout(function () { that.reload(); }, 1000 / this.config.fRate);
        
        // play sound effect
        fireSound.get();
    };
    
    this.reload = function () {
        if (this.config.active === false) return;
        this.reloading = false;
    };
    
    this.draw = function () {
        if (this.config.active === false) return;

        ctx.translate(this.config.oX, this.config.oY);
        // draw body && attachments
        ctx.rotate(this.config.hAngle * Math.PI/180);
        ctx.drawImage(this.images.chassis, this.config.cx, this.config.cy);
        for (var i = 0; i < this.attachments.chassis.length; i++) {
            ctx.drawImage(this.attachments.chassis[i].img, this.config.cx, this.config.cy);
        }
        ctx.rotate(-this.config.hAngle * Math.PI/180);
         // draw turret && attachments
        ctx.rotate(this.config.tAngle * Math.PI/180);
        ctx.drawImage(this.images.turret, this.config.cxt, this.config.cyt);
        for (var i = 0; i < this.attachments.turret.length; i++) {
            ctx.drawImage(this.attachments.turret[i].img, this.config.cxt, this.config.cyt);
        }
        ctx.rotate(-this.config.tAngle * Math.PI/180);
        // reverse translate
        ctx.translate(-this.config.oX, -this.config.oY);
    };
    
    this.hit = function () {
        /* when tank is hit */
        for (var i = 0; i < this.callbacks.length; i++) {
            this.callbacks[i]();
        }
    };
    
    this.death = function () {
        /* Move object offscreen. Set to inactive. */
        this.config.active = false;
        this.config.oX = canvas.height+250;
        this.config.oY = 0;
    };
}