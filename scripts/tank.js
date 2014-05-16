/*
*   TANK Main Module
*/
var TANK = (function () {
    var blueprints = {}; // tank blueprints will be relocated here in the future (currently in the GLOBALS module)

    // tank stats that can be buffed via the wave spawns dialog
    var buffables = [
        'maxHealth',
        'health',
        'shield',
        'maxShield',
        'shieldRegen',
        'armor',
        'fRate',
        'pDamage',
        'pSpeed',
        'fSpeed',
        'rSpeed',
        'sSpeed',
        'tSpeed',
        'accel',
        'critChance',
        'dropRate',
        'ammo',
        'coins'
    ];

    return {
        getBuffables : function () {
            return buffables;
        }
    };
}());

/*
*   TANK behavior submodule
*
*   Contains special tank behavior (particulary for bosses).
*/
TANK.behavior = (function () {
    return {

    };
}());

/*
*   TANK Upgrade Module
*/
TANK.upgrade = (function () {
    var upgrades = []; // all the possible upgrades to the tank

    return {
        init : function () {
            /* Initialize the upgrades var. */
            upgrades = BLUEPRINT.getByType('upgrades')[0].data;
        },
        reset : function () {
            /* Reset upgrades and write data to div*/
            $('#upgrades_container').html(''); // empty the container first
            var box = '';

            for (var key in upgrades) {
                upgrades[key].level = 0;
                box += '<div id="u-passive-' + upgrades[key].id + '" class="upgrade-box" style="display: inline-block; position: relative; width: 48px; text-align: center; cursor: pointer;" onmouseover="$(this).children(\'.upgrade-hover-box\').show(); $(this).children(\'.buyout-multiplier\').css(\'opacity\', 1)" onmouseout="$(this).children(\'.upgrade-hover-box\').hide(); $(this).children(\'.buyout-multiplier\').css(\'opacity\', 0)">\
                            <img class="flip-vertical" src="' + upgrades[key].image + '" onclick="$(this).parent().find($(\'strong\')).html(TANK.upgrade.buy(\'' + key + '\', $(this).parent().children(\'.buyout-multiplier\').val()));" />\
                            <span class="upgrade-cost" style="background: url(images/ui/dollar-small.png) left center no-repeat; padding-left: 14px; color: yellow;">' + upgrades[key].cost + '</span>\
                            <input class="buyout-multiplier" type="number" value="1" style="width: 100%; opacity: 0;">\
                            <div class="upgrade-hover-box" style="position: absolute; width: 200px; background-color: #000; border: 1px dotted #fff; text-align: left; padding: 12px; font-size: 13px; display: none; color: #fff;">\
                                <b>' + upgrades[key].name + '</b>\
                                <p>' + upgrades[key].description + '</p>\
                                Level: <strong>' + upgrades[key].level + '</strong>\
                            </div>\
                        </div>';
            }
            $('#upgrades_container').html(box);
        },
        buy : function (key, size) {
            /* Acquire the upgrade in exchange for a fixed cost. */
            size = parseInt(size); // clean size var

            // Check if player can afford
            if (tanks[0].config.coins >= upgrades[key].cost * size) {
                // The player can afford, decrease player gold
                tanks[0].config.coins -= upgrades[key].cost * size;

                // Apply upgrades
                for (var i = 0; i < upgrades[key].stats.length; i++) {
                    tanks[0].config[upgrades[key].stats[i].stat] += upgrades[key].stats[i].value * size;
                }

                // Mark upgrade level
                upgrades[key].level += size;

                // Update coin count in hud
                $('#gold-count').html(tanks[0].config.coins);

                // Update ammo count
                $('#ammo-count').html(tanks[0].config.ammo);

                // Play sound
                gold_pick_sound.get();
            }

            return upgrades[key].level;
        }
    };
}());

/*
* TANK Consumable module (powerup consumables)
*/
TANK.consumable = (function() {
    var inventory = [];
    var MAX_INVENTORY_SLOTS = 5;
        
    return {
        reset : function () {
            /* Reset upgrades and write data to div*/
            inventory = [];
            $('#consumables_container').html(''); // empty the container first
            var box = '';

            var pups = PUP.getSlugs();
            for (var i = 0; i < pups.length; i++) {
                if (pups[i].slug === 'gold-coin' || pups[i].slug === 'ammo') continue; // exclude gold coin and ammo powerups
                box += '<div id="c-powerup-' + i + '" class="consumable-box" style="display: inline-block; position: relative; width: 48px; text-align: center; cursor: pointer;" onmouseover="$(this).children(\'.consumable-hover-box\').show(); $(this).children(\'.buyout-multiplier\').css(\'opacity\', 1)" onmouseout="$(this).children(\'.consumable-hover-box\').hide(); $(this).children(\'.buyout-multiplier\').css(\'opacity\', 0)">\
                            <img class="flip-vertical" src="' + PowerUpImages.get(pups[i].slug).src + '" onclick="TANK.consumable.buy(\'' + pups[i].slug + '\', $(this).parent().children(\'.buyout-multiplier\').val());" />\
                            <span class="consumable-cost" style="background: url(images/ui/dollar-small.png) left center no-repeat; padding-left: 14px; color: yellow;">' + pups[i].cost + '</span>\
                            <input class="buyout-multiplier" type="number" value="1" style="width: 100%; opacity: 0;">\
                            <div class="consumable-hover-box" style="position: absolute; width: 220px; background-color: #000; border: 1px dotted #fff; text-align: left; padding: 12px; font-size: 13px; display: none; color: #fff;">\
                                <b>' + UTIL.toTitleCase(pups[i].slug.split('-').join(' ')) + '</b>\
                                <p>' + pups[i].desc + '</p>\
                            </div>\
                        </div>';
            }
            $('#consumables_container').html(box);
            TANK.consumable.updateInventoryHUD();
        },
        buy : function (key, size) {
            /* Acquire the consumable for a fixed cost. */
            size = parseInt(size);
            
            // Check if player can afford
            var pup = PUP.getSlug(key);
            if (tanks[0].config.coins >= pup.cost * size) {
                var stackSize = 0;
                
                // check if identical powerup is already in inventory
                var indexInInventory = -1; // index of identical powerup in inventory
                for (var i = 0; i < inventory.length; i++) {
                    if (inventory[i].item === key) {
                        indexInInventory = i;
                        break;
                    }
                }
                
                // if identical powerup is NOT found, push new item if there are some free slots
                if (indexInInventory === -1) {
                    if (inventory.length === MAX_INVENTORY_SLOTS) return; 
                    
                    inventory.push({
                        item: key,
                        stacks: size
                    });
                    stackSize = inventory[inventory.length - 1].stacks;
                }
                else {
                    // if found, add to its stack size
                    inventory[indexInInventory].stacks += size;
                    stackSize = inventory[indexInInventory].stacks;
                }
                
                // if yes, decrease player gold
                tanks[0].config.coins -= pup.cost * size;
                
                // Update coin count in hud
                $('#gold-count').html(tanks[0].config.coins);

                // Play sound
                gold_pick_sound.get();
                
                TANK.consumable.updateInventoryHUD();
                return stackSize;
            }
        },
        use : function (index) {
            /* Use a consumable. */
            
            // check if we have a consumable at index
            if (inventory.length <= index) return; // no consumable
            
            PUP.create(inventory[index].item, -200, -200).use(tanks[0]); // create a powerup outside of the gameworld, then use it.
            inventory[index].stacks -= 1; // take 1 stack away
            
            // if stack size is zero, remove it from inventory
            if (inventory[index].stacks === 0) {
                inventory.splice(index, 1);
            }
            
            // update inventory hud
            TANK.consumable.updateInventoryHUD();
        },
        updateInventoryHUD : function () {
            /* Update inventory HUD contents. */
            var hud = '';
            
            for (var i = 0; i < inventory.length; i++) {
                hud += '<div style="height: 32px; width: 32px; display: inline-block; position: relative;"><img class="flip-vertical" src="' + PowerUpImages.get(inventory[i].item).src + '" /><div style="width: 100%; height: 12px; position: absolute; top: -12px; color: #fff; background-color: #000; text-align: center; font-size: 10px;">' + inventory[i].stacks + '</div></div>';
            }
            
            $('#inventory-hud').html(hud);
        }
    };
}());

/*-------- Tanks --------*/
function Tank(specs, id, control, x, y, faction) {
    
    this.projectile_mods = [];
    this.events = new EventEmitter();
    
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
        collision    : false,                                                              // newly spawned units are ethereal until there's nothing else to collide with
        colliding    : {state: false, type: 'none', object: null},                                               // collision flag, when colliding with objects, colliding is true
        control      : control,
        faction      : faction || 'hostile',
        id           : id,                                                                 // random-gen id
        name         : specs.name,                                                         // tank name
        type         : specs.type,                                                         // tanks type (light/medium/heavy/destroyer/howitzer)
        coins        : specs.coins || 0,                                                                  // tank currency (can be used to purchase upgrades)
        health       : specs.health,                                                       // tank health
        maxHealth    : specs.health,
        shield       : specs.shield || 0,
        maxShield    : specs.shield || 0,
        shieldRegen  : specs.shieldRegen || 0,                                            // per second
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
        invulnerable : specs.invulnerable || 0,                                            // invulnerability count. can be any integer from 0 >
        tSize        : specs.tSize,                                                        // tank turret Size (in px, must be square)
        cRadius      : Math.max(specs.width, specs.height) / 2,                            // tank max collision size (the greater value between the chassis width and height)
        sSpeed       : specs.sSpeed,                                                       // tank turn Speed (in degrees / sec)
        tSpeed       : specs.tSpeed,                                                       // turret turn Speed (in degrees / sec)
        fSpeed       : specs.fSpeed,                                                       // tank forward Speed
        rSpeed       : specs.rSpeed,                                                       // tank reverse Speed
        accel        : specs.accel,                                                        // acceleration rate (time it takes for the tank to reach max speed)
        decel        : specs.width * 3,                                                    // deceleration rate
        pSpeed       : specs.pSpeed,                                                       // Projectile speed
        pDamage      : specs.pDamage,                                                      // projectile damage
        critChance   : specs.critChance,
        critMultiplier : specs.critMultiplier || 2,
        dropRate     : specs.dropRate || 10,                                               // chance of dropping a powerup on death (default: 10%)
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
}

Tank.prototype.turnBody = function (modifier, direction, lockAngle) {
    /* lockAngle is used by AI. Prevents it from going beyond the lockAngle. */
    var t = this.config;

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

    this.events.emit('turnchassis');
};

Tank.prototype.turnTurret = function (modifier, mX, mY) {
    /* Turn the tank turret */
    var t = this.config;

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

    this.events.emit('turnturret');
};

Tank.prototype.move = function (modifier, direction, lockPoint) {
    /* lockPoint used by AI. Prevents it from going beyond the lockPoint. */
    var t = this.config;

    if (t.active === false) return;
    
    lockPoint = typeof lockPoint === 'undefined' ? false : lockPoint; 

    /* move forward or backward, modifier is time-based*/
    var tmpX = t.oX; // save old coords
    var tmpY = t.oY;
    var d, bot;
    var extraBrake = 0;
    
    if (direction == 'forward' && this.velocity.reverse > 0) {
        extraBrake = t.fSpeed;
        direction = 'reverse-stop';
    }
    else if (direction == 'reverse' && this.velocity.forward > 0) {
        extraBrake = t.rSpeed;
        direction = 'forward-stop';
    }
    
    switch(direction) {
        case 'forward':
            this.velocity.forward += t.accel * modifier;
            this.velocity.forward = this.velocity.forward > t.fSpeed ? t.fSpeed : this.velocity.forward;
            
            var step = modifier*this.velocity.forward;
                            
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
            this.velocity.reverse += t.accel * modifier;
            this.velocity.reverse = this.velocity.reverse > t.rSpeed ? t.rSpeed : this.velocity.reverse;
            
            var step = modifier*this.velocity.reverse;
            
            t.oX = t.oX +  (step)*Math.cos((t.hAngle+180)*Math.PI/180);
            t.oY = t.oY +  (step)*Math.sin((t.hAngle+180)*Math.PI/180);
            break;
        case 'forward-stop':
            this.velocity.forward -= (t.decel + extraBrake) * modifier;
            this.velocity.forward = this.velocity.forward < 0.0 ? 0.0 : this.velocity.forward;
            if (lockPoint === false) {
                t.oX = t.oX +  (modifier*this.velocity.forward)*Math.cos(t.hAngle*Math.PI/180);
                t.oY = t.oY +  (modifier*this.velocity.forward)*Math.sin(t.hAngle*Math.PI/180);
            }
            break;
        case 'reverse-stop':
            this.velocity.reverse -= (t.decel + extraBrake) * modifier;
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
            
            if (t.id == player.config.id) {
                if (powerups[i].config.slug == 'gold-coin') {
                    // update coin count in hud
                    $('#gold-count').html(t.coins);
                }
                
                if (powerups[i].config.slug == 'ammo') {
                    $('#ammo-count').html(t.ammo);
                }
            }
            
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
            t.colliding = {state: true, type: 'tank', object: tanks[j]};
            if (t.collision && tanks[j].config.collision) {
                // if both tanks have collision, reset coords back to where there isn't any
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
            else {
                // make both tanks ethereal
                t.collision = false;
                tanks[j].config.collision = false;
            }
            break;
            
        }
        else {
            t.colliding = {state: false, type: 'none', object: null};
        }
    }
    
    // now check if the tank collision flag is false and the collision setting of the tank is set to false,
    if (t.colliding.state === false && t.collision === false) {
        // then change tank collision state to true, newly spawned units will be ethereal until there is no more object to collide with
        t.collision = true;
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
    
    t.turretAnim.updatePos(t.oX, t.oY);

    this.events.emit('move');
};

Tank.prototype.fire = function () {
    var t = this.config;

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
    
    var proj = new Projectile({mods: this.projectile_mods, speed: t.pSpeed, damage: t.pDamage, critChance: t.critChance, critMultiplier: t.critMultiplier, angle:  t.tAngle, oX: _oX, oY: _oY, srcId: t.id, srcType: t.name});
    projectiles.push(proj);
    
    // take 1 ammo
    t.ammo--;
    
    // we just fired a round, let's reload
    this.reloading = true;
    var that = this; // save context
    setTimeout(function () { that.reload(); }, 1000 / t.fRate);
    
    visualeffects.push(new VisualEffect({name: 'explosion', oX: _oX, oY: _oY, width: 32, height: 32, scaleW: t.fireScale, scaleH: t.fireScale,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'explosion'}));
    
    var flash = new Light({
        name        : 'muzzle-flash',
        oX          : _oX,
        oY          : _oY,
        radius      : t.fireScale * 2,
        intensity   : 0.3
    });

    lights.push(flash);

    new Timer(function () {
        flash.config.active = false;
    }, 40);

    t.turretAnim.unPause();
    // play sound effect
    fireSound.get();

    this.events.emit('fire', {_oX: _oX, _oY: _oY});
};

Tank.prototype.reload = function () {
    var t = this.config;

    if (t.active === false) return;
    this.reloading = false;
};

Tank.prototype.draw = function (ctx, xView, yView) {
    var t = this.config;
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
    var shieldbarLen = (t.shield / t.maxShield) * t.width;
    
    ctx.fillStyle = 'blue';
    // draw shield bar
    ctx.fillRect((t.oX - shieldbarLen/2) - xView, (t.oY + t.cRadius + 12) - yView, shieldbarLen, 4);

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
    // draw health bar
    ctx.fillRect((t.oX - lifebarLen/2) - xView, (t.oY + t.cRadius + 8) - yView, lifebarLen, 4);

    this.events.emit('draw');
};

Tank.prototype.hit = function (projectile) {
    /* when tank is hit */
    var t = this.config;
    // calculate damage
    var p = projectile.config;
    
    var min = p.damage - 3;
    var max = p.damage + 3;
    var critical_hit = p.critChance > Math.random()*100 ? true : false; // crit chance, baseline is 5% @ 2x
    var raw_damage = p.damage; // raw damage
    var dmg_base_roll = Math.floor((Math.random() * max) + min);
    var mod_damage = critical_hit ? dmg_base_roll*p.critMultiplier : dmg_base_roll; // damage after mods/crit
    var oldShield = t.shield;
    var end_damage = mod_damage - oldShield;
    var damage_reduction = ((0.06 * t.armor) / (1 + 0.06 * t.armor));
    end_damage = t.invulnerable > 0 ? 0 : end_damage - (end_damage * damage_reduction);
    t.shield = t.invulnerable > 0 ? oldShield : t.shield - mod_damage;
    t.shield = t.shield < 0 ? 0 : t.shield;
    
    // play visual effect
    var hit_explosion_scale = Math.floor((Math.random() * 15) + 10);
    hit_explosion_scale = critical_hit ? hit_explosion_scale * 2 : hit_explosion_scale;
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
    
    if (t.id === player.config.id) {
        // screenshake effect everytime the player's tank gets hit
        if (critical_hit && (GLOBALS.settings.screenShake == 1 || GLOBALS.settings.screenShake == 3)) {
            $('#canvas-ui-wrap').stop().effect('shake', { distance: 6, times: 3 }, 100);
        }
        else if (GLOBALS.settings.screenShake == 2 || GLOBALS.settings.screenShake == 3) {
            $('#canvas-ui-wrap').stop().effect('shake', { distance: 2, times: 1 }, 20);
        }
    }
    
    var oldHealth = t.health;

    if (t.shield === 0) {
        // decrease health only if shields are down
        t.health = t.health < end_damage ? 0 : t.health - end_damage;
    }
    
    // Update combat log.
    //var crit_str = critical_hit ? '<span style="color: red">[CRITICAL HIT!]</span>' : '';
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
    
    // render extern, only do so if there are changes
    if (t.control === 'player' && (oldHealth !== t.health || oldShield !== t.shield)) {
        renderExtern();
    }

    this.events.emit('hit', {projectile: projectile});
}; 

Tank.prototype.death = function () {
    /* Move object offscreen. Set to inactive. */
    var t = this.config;

    t.active = false;
    GLOBALS.flags.clean.tanks++;
    t.turretAnim.end();

    visualeffects.push(new VisualEffect({name: 'explosion', oX: t.oX, oY: t.oY, width: 32, height: 32, scaleW: t.explodeScale, scaleH: t.explodeScale,  maxCols: 4, maxRows: 4, framesTillUpdate: 2, loop: false, spriteSheet: 'explosion'}));

    // screenshake effect everytime a tank explodes
    if (GLOBALS.settings.screenShake == 4) {
        $('#canvas-ui-wrap').stop().effect('shake', { distance: 4, times: 3 }, 50);
    }

    // show explosion flash
    var flash = new Light({
        name        : 'hit-flash',
        oX          : t.oX,
        oY          : t.oY,
        radius      : t.explodeScale,
        intensity   : 0.5
    });

    lights.push(flash);

    new Timer(function () {
        flash.config.active = false;
    }, 200);

    if (t.control === 'computer') {
        GLOBALS.map.wave.enemyCount -= 1;
        STAT.inc('total_tanks_destroyed', 1);
        STAT.inc('td_' + t.name, 1);
        hud_kill_count.innerHTML = STAT.get('total_tanks_destroyed');
        tanks[0].config.coins += t.coins;
        $('#gold-count').html(tanks[0].config.coins);
    }
    
    /* has a chance to spawn a random powerup on death */
    var lucky = (GLOBALS.map.current.dropRate + t.dropRate) > Math.random()*100;
    
    if (lucky) {
        // ok just got lucky, get a random powerup
        powerups.push(PUP.createRandom(t.oX, t.oY));
    }

    this.events.emit('death');
};

Tank.prototype.frame = function (modifier) {
    /* per frame callback */
    var t = this.config;
    if (!t.active) return;
    
    // regenerate shield
    t.shield += t.shieldRegen * modifier;
    t.shield = t.shield > t.maxShield ? t.maxShield : t.shield; // prevent shield from going beyond the max

    this.events.emit('frame', {modifier: modifier});
};