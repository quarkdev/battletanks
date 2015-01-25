/*-------- Powerups --------*/
var PUP = (function() {
    var my = {};
    
    var pSlugs = [
        {slug: 'random', cost: 10, desc: 'Activates a random powerup on use.'},
        {slug: 'haste', cost: 20, desc: 'Increases the movement speed by 100, chassis rotation speed by 20, and turret traverse speed by 40.'},
        {slug: 'ammo', cost: 50, desc: 'Increases ammunition.'},
        {slug: 'projectile-barrier', cost: 100, desc: 'Incoming projectiles are repurposed into a deadly ring surrounding the host tank. +1 invulnerability.'},
        {slug: 'aphotic-shield', cost: 100, desc: 'Incoming projectiles are absorbed and released after shield expires. +1 invulnerability.'},
        {slug: 'increased-armor', cost: 5, desc: 'Increases armor by 50 per stack.'},
        {slug: 'reactive-armor', cost: 30, desc: 'Each hit received increases armor by 20.'},
        {slug: 'regeneration', cost: 20, desc: 'Regenerates 5% of health per second until maximum or host is hit.'},
        {slug: 'rapid-fire', cost: 30, desc: 'Increases firing rate by 5 rounds a second per stack.'},
        {slug: 'faster-projectile', cost: 5, desc: 'Increases projectile speed by 200 per stack.'},
        {slug: 'increased-damage', cost: 5, desc: 'Increases damage by 50 per stack.'},
        {slug: 'return', cost: 20, desc: 'Each projectile hit received is returned to it\'s origin.'},
        {slug: 'multi-shot', cost: 50, desc: 'Fires 2 extra projectiles per stack. Maximum of 16 stacks.'},
        {slug: 'homing-missile', cost: 30, desc: 'Projectiles home into nearby targets. Default maximum tracking distance is 200 units.'},
        {slug: 'concussive-shell', cost: 40, desc: 'Applies a stacking slow on hit. Slow amount is 5 per hit.'},
        {slug: 'fireworks', cost: 10, desc: 'Projectiles explode into multiple smaller projectiles after reaching 440-560 units terminus distance. Each lesser projectile deal 25% of the host projectile\'s damage.'},
        {slug: 'chain', cost: 30, desc: 'Projectiles jump to nearby tanks. Maximum jump distance is 300 units. Maximum of 4 jumps.'},
        {slug: 'gold-coin', cost: 50, desc: 'Gives 50 gold.'},
        {slug: 'increased-critical-chance', cost: 40, desc: 'Increases critical hit chance by 5% per stack.'},
        {slug: 'kinetic-shell', cost: 30, desc: 'Adds a knockback to projectile attacks. Knockback distance is (projectile speed / 100) units, resets movement velocities to zero on hit.'},
        {slug: 'time-dilation-sphere', cost: 40, desc: 'Reduces the speed of projectiles within a 175-unit radius of the host tank by 90%.'},
        {slug: 'nuke', cost: 1000, desc: 'Deals 8000 + (wave * 200) max pure damage to enemy tanks within effective radius. Damage diminishes with distance.'},
        {slug: 'deflect', cost: 100, desc: 'Uses 50% less shield energy to deflect incoming projectiles. Temporarily gives 1000 shield and 200 shield regen. Bonus is halved when stacked.'}
    ];
    
    my.getSlug = function (slug) {
        for (var i = 0; i < pSlugs.length; i++) {
            if (pSlugs[i].slug === slug) {
                return pSlugs[i];
            }
        }
    };
    
    my.getSlugs = function () {
        return pSlugs;
    };
    
    my.create = function (name, x, y) {
        switch (name) {
            case 'random':
                return new Random(x, y);
            case 'haste':
                return new Haste(x, y);
            case 'ammo':
                return new Ammo(x, y);
            case 'projectile-barrier':
                return new ProjectileBarrier(x, y);
            case 'aphotic-shield':
                return new AphoticShield(x, y);
            case 'increased-armor':
                return new IncreasedArmor(x, y);
            case 'reactive-armor':
                return new ReactiveArmor(x, y);
            case 'regeneration':
                return new Regeneration(x, y);
            case 'rapid-fire':
                return new RapidFire(x, y);
            case 'faster-projectile':
                return new FasterProjectile(x, y);
            case 'increased-damage':
                return new IncreasedDamage(x, y);
            case 'return':
                return new Return(x, y);
            case 'multi-shot':
                return new MultiShot(x, y);
            case 'homing-missile':
                return new HomingMissile(x, y);
            case 'concussive-shell':
                return new ConcussiveShell(x, y);
            case 'fireworks':
                return new Fireworks(x, y);
            case 'chain':
                return new Chain(x, y);
            case 'gold-coin':
                return new GoldCoin(x, y);
            case 'increased-critical-chance':
                return new IncreasedCriticalChance(x, y);
            case 'kinetic-shell':
                return new KineticShell(x, y);
            case 'time-dilation-sphere':
                return new TimeDilationSphere(x, y);
            case 'nuke':
                return new Nuke(x, y);
            case 'deflect':
                return new Deflect(x, y);
            default:
                break;
        }
    };
    
    my.createRandom = function (x, y) {
        var index = Math.floor(Math.random() * pSlugs.length);
        
        return PUP.create(pSlugs[index].slug, x, y);
    };
    
    // POWERUP OBJECTS
    
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
        };
    }
    
    function Deflect(x, y) {
        /* Deflects projectiles. */
        this.config = {
            name    : 'Deflect',
            slug    : 'deflect',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('deflect')
        };
        
        this.use = function (tank) {
            var active = typeof tank.deflect !== 'undefined';
            
            // play sfx
            //pup_deflect_sound.get();
            
            if (!active) {
                tank.deflect = {};
                tank.deflect.vfx = []; // active deflect hit animations
                tank.deflect.shield = 1000; // bonus shield
                tank.deflect.shieldRegen = 200; // bonus shield regen
                tank.config.maxShield += 1000;
                tank.config.shieldRegen += 200;
                
                // vfx
                //visualeffects.push(new VisualEffect({name: 'deflect-on', oX: tank.config.oX, oY: tank.config.oY, width: 125, height: 125, scaleW: (tank.config.cRadius+40)*2, scaleH: (tank.config.cRadius+40)*2,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'deflect_on'}));
                
                var areaDeflect = function () {
                    tank.deflect.vfx = tank.deflect.vfx.filter(function(item) {
                        return item.config.active;
                    });
                
                    // update vfx position
                    for (var i = 0; i < tank.deflect.vfx.length; i++) {
                        tank.deflect.vfx[i].updatePos(tank.config.oX, tank.config.oY);
                    }
                
                    // loop through all active projectiles
                    for (var i = 0; i < projectiles.length; i++) {
                        if (projectiles[i].config.srcId === tank.config.id) continue; // doesn't affect user projectiles
                        if (!projectiles[i].config.active) continue; // skip inactive projectiles
                        
                        // check if projectile is within AOE (fixed radius of 175)
                        var dist = UTIL.geometry.getDistanceBetweenPoints({x: tank.config.oX, y: tank.config.oY}, {x: projectiles[i].config.oX, y: projectiles[i].config.oY});
                        
                        if (dist > tank.config.cRadius + 40) {
                            continue;
                        }
                        
                        // if projectile within AOE, apply deflect flag if not already applied (tested via a unique property)
                        if (!projectiles[i].hasOwnProperty('flaggedDeflect')) {
                            projectiles[i].flaggedDeflect = tank.config.id; // set flag owner
                            // check if tank has enough shield energy to deflect the projectile
                            var _pdmg = projectiles[i].config.damage / 2; // deflect barrier consumes less shield energy than default shield
                            
                            if (tank.config.shield < _pdmg) {
                                // if remaining shield energy is not enough, projectile is not deflected
                                continue;
                            }
                            
                            // else, we deplete the shield energy to use deflect
                            tank.config.shield -= _pdmg;
                            
                            // do an explosion on point of intersection
                            var poi = UTIL.geometry.getLineCircleIntersectionPoints(
                                projectiles[i].config.origin,
                                {x: projectiles[i].config.oX, y: projectiles[i].config.oY},
                                {x: tank.config.oX, y: tank.config.oY},
                                tank.config.cRadius + 40
                            );
                            
                            var ri = 0; // real intersect index
                            
                            if (poi.length === 0) {
                                continue;
                            }
                            else if (poi.length === 1) {
                                // one intersection
                                ri = 0;
                            }
                            else if (poi.length === 2) {
                                // two intersections, find the closest one to origin
                                var dA = UTIL.geometry.getDistanceBetweenPoints(projectiles[i].config.origin, poi[0]);
                                var dB = UTIL.geometry.getDistanceBetweenPoints(projectiles[i].config.origin, poi[1]);
                                
                                if (dA < dB) {
                                    // first poi is the real point of impact
                                    ri = 0;
                                }
                                else {
                                    ri = 1;
                                }
                            }
                        
                            // hit vfx
                            var poia = UTIL.geometry.getAngleBetweenLineAndHAxis({x: tank.config.oX, y: tank.config.oY}, {x: poi[ri].x, y: poi[ri].y});
                            var shield_vfx = new VisualEffect({name: 'shield_glimpse', oX: tank.config.oX, oY: tank.config.oY, width: 125, height: 125, angle: poia, scaleW: (tank.config.cRadius+40)*2, scaleH: (tank.config.cRadius+40)*2,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'shield_glimpse'});
                            tank.deflect.vfx.push(shield_vfx);
                            visualeffects.push(shield_vfx);
                        
                            // calculate projectile bounce angle
                            var tangent_slope = UTIL.geometry.getSlopeOfTangentLineToCircle({x: tank.config.oX, y: tank.config.oY}, poi[ri]);
                            var surface_angle = 180 - (Math.atan2(tangent_slope.y, tangent_slope.x) * (180 / Math.PI));
                            var incoming_angle = projectiles[i].config.angle;
                            
                            var bounce_angle = UTIL.geometry.getBounceAngle(surface_angle, incoming_angle);
                            
                            // redirect projectile
                            projectiles[i].config.angle = bounce_angle;
                            projectiles[i].config.oX = poi[ri].x;
                            projectiles[i].config.oY = poi[ri].y;
                        }
                    }
                };
                tank.events.listen('frame', areaDeflect)
                
                tank.deflect.timeout = new Timer(function() {
                    tank.events.unlisten('frame', areaDeflect);
                    tank.config.maxShield -= tank.deflect.shield;
                    tank.config.shield = tank.config.shield > tank.config.maxShield ? tank.config.maxShield : tank.config.shield;
                    tank.config.shieldRegen -= tank.deflect.shieldRegen;
                    delete tank.deflect;
                }, 10000);
            }
            else {
                tank.config.maxShield += 500;
                tank.config.shieldRegen += 100;
                tank.deflect.shield += 500;
                tank.deflect.shieldRegen += 100;
                tank.deflect.timeout.extend(5000);
            }
        };
    }
    
    function Nuke(x, y) {
        /* Fires a single projectile that explodes after travelling a set distance or on impact. Deals massive AOE damage. */
        this.config = {
            name    : 'Nuke',
            slug    : 'nuke',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('nuke')
        };
        
        this.use = function (tank) {
            // deal 8000 - (distance * 10) pure damage to enemy units
            // add the calldown effect
            var vfx = new VisualEffect({
                name: 'nuke_calldown',
                oX: tank.config.oX,
                oY: tank.config.oY,
                width: 64,
                height: 64,
                scaleW: 64,
                scaleH: 64,
                maxCols: 4,
                maxRows: 4,
                framesTillUpdate: 1,
                loop: true,
                spriteSheet: 'calldown'
            });
            
            visualeffects.push(vfx);
            
            var loc = {
                x: tank.config.oX,
                y: tank.config.oY
            };
            
            nuke_siren_sound.get();
            
            // deal damage to all tanks within 500 radius after 5 seconds
            new Timer(function () {
                vfx.end();
                nuke_explosion_sound.get();
                // show explosion flash
                var flash = new Light({
                    name        : 'nuke-flash',
                    oX          : loc.x,
                    oY          : loc.y,
                    radius      : 5000,
                    intensity   : 1
                });
                
                var core = new Light({
                    name        : 'nuke-core',
                    oX          : loc.x,
                    oY          : loc.y,
                    radius      : 2000,
                    intensity   : 1
                });

                lights.push(flash);
                lights.push(core);
                
                new Timer(function () { flash.config.radius = 2000; flash.config.intensity -= 0.05; }, 500);
                new Timer(function () { flash.config.radius = 1900; flash.config.intensity -= 0.05; }, 550);
                new Timer(function () { flash.config.radius = 1800; flash.config.intensity -= 0.05; }, 600);
                new Timer(function () { flash.config.radius = 1700; flash.config.intensity -= 0.05; }, 650);
                new Timer(function () { flash.config.radius = 1600; flash.config.intensity -= 0.05; }, 700);
                new Timer(function () { flash.config.radius = 1500; flash.config.intensity -= 0.05; }, 750);
                new Timer(function () { flash.config.radius = 1400; flash.config.intensity -= 0.05; }, 800);
                new Timer(function () { flash.config.radius = 1200; flash.config.intensity -= 0.05; }, 850);
                new Timer(function () { flash.config.radius = 1000; flash.config.intensity -= 0.05; }, 900);

                new Timer(function () { flash.config.radius = 800; flash.config.intensity -= 0.0125; }, 1400);
                new Timer(function () { flash.config.radius = 795; flash.config.intensity -= 0.0125; }, 1450);
                new Timer(function () { flash.config.radius = 790; flash.config.intensity -= 0.0125; }, 1500);
                new Timer(function () { flash.config.radius = 785; flash.config.intensity -= 0.0125; }, 1550);
                new Timer(function () { flash.config.radius = 780; flash.config.intensity -= 0.0125; }, 1600);
                new Timer(function () { flash.config.radius = 775; flash.config.intensity -= 0.0125; }, 1650);
                new Timer(function () { flash.config.radius = 770; flash.config.intensity -= 0.0125; }, 1700);
                new Timer(function () { flash.config.radius = 765; flash.config.intensity -= 0.0125; }, 1750);
                new Timer(function () { flash.config.radius = 760; flash.config.intensity -= 0.0125; }, 1800);
                new Timer(function () { flash.config.radius = 755; flash.config.intensity -= 0.0125; }, 1850);
                new Timer(function () { flash.config.radius = 750; flash.config.intensity -= 0.0125; }, 1900);
                new Timer(function () { flash.config.radius = 745; flash.config.intensity -= 0.0125; }, 1950);
                new Timer(function () { flash.config.radius = 740; flash.config.intensity -= 0.0125; }, 2000);
                new Timer(function () { flash.config.radius = 735; flash.config.intensity -= 0.0125; }, 2050);
                new Timer(function () { flash.config.radius = 730; flash.config.intensity -= 0.0125; }, 2100);
                new Timer(function () { flash.config.radius = 725; flash.config.intensity -= 0.0125; }, 2150);
                new Timer(function () { flash.config.radius = 720; flash.config.intensity -= 0.0125; }, 2200);
                
                new Timer(function () { flash.config.radius = 715; flash.config.intensity -= 0.0125; }, 2250);
                new Timer(function () { flash.config.radius = 710; flash.config.intensity -= 0.0125; }, 2300);
                new Timer(function () { flash.config.radius = 705; flash.config.intensity -= 0.0125; }, 2350);
                new Timer(function () { flash.config.radius = 700; flash.config.intensity -= 0.0125; }, 2400);
                new Timer(function () { flash.config.radius = 695; flash.config.intensity -= 0.0125; }, 2450);
                new Timer(function () { flash.config.radius = 690; flash.config.intensity -= 0.0125; }, 2500);
                new Timer(function () { flash.config.radius = 685; flash.config.intensity -= 0.0125; }, 2550);
                new Timer(function () { flash.config.radius = 680; flash.config.intensity -= 0.0125; core.config.intensity -= 0.1; }, 2600);
                new Timer(function () { flash.config.radius = 675; flash.config.intensity -= 0.0125; core.config.intensity -= 0.1; }, 2650);
                new Timer(function () { flash.config.radius = 670; flash.config.intensity -= 0.0125; core.config.intensity -= 0.1; }, 2700);
                new Timer(function () { flash.config.radius = 665; flash.config.intensity -= 0.0125; core.config.intensity -= 0.1; }, 2750);
                new Timer(function () { flash.config.radius = 660; flash.config.intensity -= 0.0125; core.config.intensity -= 0.1; }, 2800);
                new Timer(function () { flash.config.radius = 655; flash.config.intensity -= 0.0125; core.config.intensity -= 0.1; }, 2850);
                new Timer(function () { flash.config.radius = 650; flash.config.intensity -= 0.0125; core.config.intensity -= 0.1; }, 2900);
                new Timer(function () { flash.config.radius = 645; flash.config.intensity -= 0.0125; core.config.intensity -= 0.1; }, 2950);
                new Timer(function () { flash.config.radius = 640; flash.config.intensity -= 0.0125; core.config.intensity -= 0.1; }, 3000);
                new Timer(function () { flash.config.radius = 635; flash.config.intensity -= 0.0125; core.config.intensity -= 0.1; }, 3050);

                new Timer(function () { flash.config.active = false; core.config.active = false; }, 3050);
                
                for (var i = 0; i < tanks.length; i++) {
                    if (tanks[i].config.invulnerable > 0) {
                        continue;
                    }
                
                    // calculate the damage dealt
                    var d = UTIL.geometry.getDistanceBetweenPoints(loc, {x: tanks[i].config.oX, y: tanks[i].config.oY});
                    var dmg = (8000 + (GLOBALS.map.wave.current * 200)) - (d * 10);
                    dmg = dmg < 0 ? 0 : dmg;
                    
                    tanks[i].config.health -= dmg;
                    tanks[i].config.health = tanks[i].config.health < 0 ? 0 : tanks[i].config.health;
                    
                    // animate player health if hit
                    if (tanks[i].config.control === 'player') {
                        renderExtern();
                    }
                    
                    // if tank has 0 health, destroy the tank
                    if (tanks[i].config.health === 0) {
                        tanks[i].death();
                    }
                }
                
                for (var i = 0; i < destructibles.length; i++) {
                    if (destructibles[i].config.mod === 'immortal') {
                        continue;
                    }
                
                    // calculate the damage dealt
                    var d = UTIL.geometry.getDistanceBetweenPoints(loc, {x: destructibles[i].config.oX, y: destructibles[i].config.oY});
                    var dmg = (8000 + (GLOBALS.map.wave.current * 200)) - (d * 10);
                    dmg = dmg < 0 ? 0 : dmg;
                    
                    destructibles[i].config.health -= dmg;
                    destructibles[i].config.health = destructibles[i].config.health < 0 ? 0 : destructibles[i].config.health;
                    
                    // if tank has 0 health, destroy the tank
                    if (destructibles[i].config.health === 0) {
                        destructibles[i].death();
                    }
                }
            }, 6000);
        };
    }
    
    function TimeDilationSphere(x, y) {
        /* Slows down projectiles that enter radius. */
        this.config = {
            name    : 'Time Dilation Sphere',
            slug    : 'time-dilation-sphere',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('time-dilation-sphere')
        };
        
        this.use = function (tank) {
            var active = typeof tank.tds !== 'undefined';
            
            // play sfx
            pup_tds_sound.get();
            
            if (!active) {
                tank.tds = {};
                
                // vfx
                visualeffects.push(new VisualEffect({name: 'time-dilation-on', oX: tank.config.oX, oY: tank.config.oY, width: 350, height: 350, scaleW: 350, scaleH: 350,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'time-dilation-on'}));
                tank.tds.vfx = new VisualEffect({name: 'time-dilation', oX: tank.config.oX, oY: tank.config.oY, width: 350, height: 350, scaleW: 350, scaleH: 350,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: true, spriteSheet: 'time-dilation'});
                visualeffects.push(tank.tds.vfx);
                tank.events.listen('death', function () {
                    if (tank.hasOwnProperty('tds')) {
                        tank.tds.vfx.end();
                        // remove owned flags
                        for (var i = 0; i < projectiles.length; i++) {
                            if (projectiles[i].hasOwnProperty('flaggedAreaSlow')) {
                                // check if you own the flag, can only remove owned flags
                                if (projectiles[i].flagASId === tank.config.id) {
                                    // restore lost speed then remove flag
                                    projectiles[i].config.speed += projectiles[i].flaggedAreaSlow;
                                    
                                    delete projectiles[i].flaggedAreaSlow;
                                }
                            }
                        }
                    }
                });
                
                var areaSlow = function () {
                    // update vfx position
                    tank.tds.vfx.updatePos(tank.config.oX, tank.config.oY);
                
                    // loop through all active projectiles
                    for (var i = 0; i < projectiles.length; i++) {
                        if (projectiles[i].config.srcId === tank.config.id) continue; // doesn't affect user projectiles
                        if (!projectiles[i].config.active) continue; // skip inactive projectiles
                        
                        // check if projectile is within AOE (fixed radius of 175)
                        var dist = UTIL.geometry.getDistanceBetweenPoints({x: tank.config.oX, y: tank.config.oY}, {x: projectiles[i].config.oX, y: projectiles[i].config.oY});
                        
                        if (dist > 175) {
                            // not within AOE, check if it is flagged
                            if (projectiles[i].hasOwnProperty('flaggedAreaSlow')) {
                                // check if you own the flag, can only remove owned flags
                                if (projectiles[i].flagASId === tank.config.id) {
                                    // restore lost speed then remove flag
                                    projectiles[i].config.speed += projectiles[i].flaggedAreaSlow;
                                    
                                    delete projectiles[i].flaggedAreaSlow;
                                }
                            }
                            
                            continue;
                        }
                        
                        // if projectile within AOE, apply slow debuff if not already applied (tested via a unique property)
                        if (!projectiles[i].hasOwnProperty('flaggedAreaSlow')) {
                            // only apply debuff on unflagged projectiles
                            var lostSpeed = projectiles[i].config.speed * 0.90;
                            projectiles[i].flaggedAreaSlow = lostSpeed; // set flag
                            projectiles[i].flagASId = tank.config.id; // set flag owner
                            projectiles[i].config.speed -= lostSpeed; // reduce projectile speed by 90%
                        }
                    }
                };
                tank.events.listen('frame', areaSlow)
                
                tank.tds.timeout = new Timer(function() {
                    // remove owned flags
                    for (var i = 0; i < projectiles.length; i++) {
                        if (projectiles[i].hasOwnProperty('flaggedAreaSlow')) {
                            // check if you own the flag, can only remove owned flags
                            if (projectiles[i].flagASId === tank.config.id) {
                                // restore lost speed then remove flag
                                projectiles[i].config.speed += projectiles[i].flaggedAreaSlow;
                                
                                delete projectiles[i].flaggedAreaSlow;
                            }
                        }
                    }
                    tank.tds.vfx.end();
                    tank.events.unlisten('frame', areaSlow);
                    delete tank.tds;
                    visualeffects.push(new VisualEffect({name: 'time-dilation-off', oX: tank.config.oX, oY: tank.config.oY, width: 350, height: 350, scaleW: 350, scaleH: 350,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'time-dilation-off'}));
                }, 10000);
            }
            else {
                tank.tds.timeout.extend(5000);
            }
        };
    }
    
    function KineticShell(x, y) {
        /* Knocks tanks back on hit. */
        this.config = {
            name    : 'Kinetic Shell',
            slug    : 'kinetic-shell',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('kinetic-shell')
        };
        
        this.use = function (tank) {
            var active = typeof tank.ks !== 'undefined';
            
            if (!active) {
                tank.ks = {};
                
                var knockback = function (projectile) {
                    var p = projectile.config;
                    
                    // show trailing blue fire
                    visualeffects.push(new VisualEffect({name: 'kinetic_trail', oX: p.oX, oY: p.oY, width: 32, height: 32, scaleW: 8, scaleH: 8,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'blue_explosion'}));
                    
                    // check if a tank has been hit
                    if (p.objectHit.type !== 'tank') { return; }
                    
                    // knock tank
                    var newPos = UTIL.geometry.getPointAtAngleFrom(p.objectHit.obj.config.oX, p.objectHit.obj.config.oY, p.angle, p.speed/100);
                    
                    // correct knockback point if tank goes out of world bounds
                    if (newPos[0] < 0 + p.objectHit.obj.config.cRadius) {
                        newPos[0] = 0 + p.objectHit.obj.config.cRadius;
                    }
                    else if (newPos[0] > WORLD_WIDTH - p.objectHit.obj.config.cRadius) {
                        newPos[0] = WORLD_WIDTH - p.objectHit.obj.config.cRadius;
                    }
                    
                    if (newPos[1] < 0 + p.objectHit.obj.config.cRadius) {
                        newPos[1] = 0 + p.objectHit.obj.config.cRadius;
                    }
                    else if (newPos[1] > WORLD_HEIGHT - p.objectHit.obj.config.cRadius) {
                        newPos[1] = WORLD_HEIGHT - p.objectHit.obj.config.cRadius;
                    }
                    
                    // apply new tank position
                    p.objectHit.obj.config.oX = newPos[0];
                    p.objectHit.obj.config.oY = newPos[1];
                    
                    // reset tank velocities
                    p.objectHit.obj.velocity.forward = 0;
                    p.objectHit.obj.velocity.reverse = 0;
                    
                    // show kinetic impact fx
                    visualeffects.push(new VisualEffect({name: 'kinetic_hit', oX: p.oX, oY: p.oY, width: 32, height: 32, scaleW: 32, scaleH: 32,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'blue_explosion'}));
                }
                knockback.id = 'knockback';
                
                tank.projectile_mods.push(knockback);
                
                tank.ks.timeout = new Timer(function () {
                    delete tank.ks;
                    tank.projectile_mods = tank.projectile_mods.filter(function (item) { return item.id != 'knockback'; });
                }, 12000);
            }
            else {
                tank.ks.timeout.extend(6000);
            }
        };
    }

    function IncreasedCriticalChance(x, y) {
        /* Increases the critical strike roll of a tank. */
        this.config = {
            name    : 'Increased Critical Chance',
            slug    : 'increased-critical-chance',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('increased-critical-chance')
        };

        this.use = function (tank) {
            var active = typeof tank.inccc !== 'undefined';

            if (!active) {
                tank.inccc = {};
                tank.inccc.stacks = 1;

                tank.inccc.timeout = new Timer(function() {
                    tank.config.critChance -= tank.inccc.stacks * 5;
                    delete tank.inccc;
                }, 12000);
            }
            else {
                tank.config.critChance += 5;
                tank.inccc.stacks += 1;
                tank.inccc.timeout.extend(3000);
            }
        };
    }
    
    function GoldCoin(x, y) {
        /* Increases the tank's gold. (which can be used to buy upgrades). Tank gold is dropped on death. Doesn't randomly drop. */
        this.config = {
            name    : 'Gold Coin',
            slug    : 'gold-coin',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('gold-coin')
        };
        
        this.use = function (tank) {
            tank.config.coins += 50;
            gold_pick_sound.get();
        };
    }
    
    function Chain(x, y) {
        /* Projectiles chain into nearby targets on hit. */
        this.config = {
            name    : 'Chain',
            slug    : 'chain',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('chain')
        };
        
        this.use = function (tank) {
            var active = typeof tank.chain !== 'undefined';
            
            if (!active) {
                tank.chain = {};
                
                var jump = function (projectile) {
                    var p = projectile.config;
                    
                    // check if a tank has been hit
                    if (p.objectHit.type !== 'tank') { return; }
                    
                    // check if projectile has jumps left, add the max jumps if undefined
                    if (typeof projectile.jumps === 'undefined') {
                        projectile.jumps = 4;
                    }
                    else if (projectile.jumps === 0) {
                        return;
                    }
                    else if (projectile.jumps > 0) {
                        projectile.jumps -= 1;
                    }
                    
                    // Get nearest tank. Ignore both the tank that was hit and the source.
                    var nearest_tank = UTIL.getNearestTank(p.oX, p.oY, [p.objectHit.obj.config.id, p.srcId], [tank.config.faction]);
                    
                    if (nearest_tank === -1) { return; }
                    
                    // Check if it is near enough to jump to
                    var nearest_dist = UTIL.geometry.getDistanceBetweenPoints({x: p.oX, y: p.oY}, {x: nearest_tank.config.oX, y: nearest_tank.config.oY});
                    
                    if (nearest_dist > 300) { return; }
                    
                    // Determine which way to adjust projectile angle.
                    var dX = nearest_tank.config.oX - p.oX;
                    var dY = nearest_tank.config.oY - p.oY;
                    
                    var tanA = Math.atan2(dY, dX) * 180/Math.PI;
                    
                    // retrieve starting point for new jump
                    var newp_coords = UTIL.geometry.getPointAtAngleFrom(p.objectHit.obj.config.oX, p.objectHit.obj.config.oY, tanA, (nearest_tank.config.width/2) + 2);
                
                    // fire new projectile towards new target
                    var cProj = new Projectile({mods: projectile.mods, speed: p.speed, damage: p.damage * 0.80, critChance: p.critChance, angle: tanA, oX: newp_coords[0], oY: newp_coords[1], srcId: p.srcId, srcType: 'chain'});
                    cProj.jumps = projectile.jumps; // save the jumps remaining for the new projectile
                    
                    projectiles.push(cProj);
                };
                jump.id = 'jump';
                
                tank.projectile_mods.push(jump);
                
                tank.chain.timeout = new Timer(function () {
                    delete tank.chain;
                    tank.projectile_mods = tank.projectile_mods.filter(function (item) { return item.id != 'jump'; });
                }, 12000);
            }
            else {
                tank.chain.timeout.extend(3000);
            }
        };
    }
    
    function Fireworks(x, y) {
        /* Projectiles split into two lesser projectiles after a set distance. */
        this.config = {
            name    : 'Fireworks',
            slug    : 'fireworks',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('fireworks')
        };
        
        this.use = function (tank) {
            var active = typeof tank.fw_active !== 'undefined';
            
            if (!active) {
                tank.fw_active = true;
                tank.fw_stacks = 12;
                
                var split = function (projectile) {
                    var p = projectile.config;
                    
                    var distance_travelled = UTIL.geometry.getDistanceBetweenPoints(p.origin, {x: p.oX, y: p.oY});
                    var explode_distance = Math.floor(Math.random() * 560) + 440;
                    if (distance_travelled > explode_distance) {
                        // if projectile has travelled 500 units, split into multiple lesser projectiles with 25% dmg each (5-degree angle offset)
                        var offset = 360 / tank.fw_stacks;
                        var rotate_offset = Math.random() * 360;
                        var speed = projectile.hasOwnProperty('flagASId') ? p.speed + projectile.flaggedAreaSlow : p.speed; // restore speed caused by area slow (so that generated shrapnel gets flagged correctly)
                        
                        for (var i = 0; i < tank.fw_stacks; i++) {
                        
                            projectiles.push(new Projectile({mods: [], speed: speed, damage: p.damage * 0.25, critChance: p.critChance, angle:  (i * offset) + rotate_offset, oX: p.oX, oY: p.oY, srcId: p.srcId, srcType: 'firework'}));
                        }
                        
                        var scale = Math.floor(Math.random() * 18) + 12;
                        
                        visualeffects.push(new VisualEffect({name: 'explosion', oX: p.oX, oY: p.oY, width: 32, height: 32, scaleW: scale, scaleH: scale,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'explosion'}));
                        
                        // show explosion flash
                        var flash = new Light({
                            name        : 'explosion-flash',
                            oX          : p.oX,
                            oY          : p.oY,
                            radius      : scale,
                            intensity   : 0.3
                        });

                        lights.push(flash);

                        new Timer(function () {
                            flash.config.active = false;
                        }, 40);

                        if (explode_distance > 500) {
                            fireSound.get();
                        }
                        else {
                            explodeSound.get();
                        }
                        
                        p.active = false; // set projectile to inactive
                    }
                };
                split.id = 'split';
                
                tank.projectile_mods.push(split);
                
                tank.fw_timeout = new Timer(function () {
                    delete tank.fw_active;
                    delete tank.fw_timeout;
                    delete tank.fw_stacks;
                    tank.projectile_mods = tank.projectile_mods.filter(function (item) { return item.id != 'split'; });
                }, 12000);
            }
            else {
                tank.fw_stacks += 1;
                tank.fw_timeout.extend(3000);
            }
        };
    }
    
    function ConcussiveShell(x, y) {
        /* Slows down targets that are hit. */
        this.config = {
            name    : 'Concussive Shell',
            slug    : 'concussive-shell',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('concussive-shell')
        };
        
        this.use = function (tank) {
            var active = typeof tank.cs_active !== 'undefined';
            
            if (!active) {
                tank.cs_active = true;
                
                var concussiveShell = function (projectile) {
                    var p = projectile.config;
                    
                    var orb = new Light({
                        name        : 'concussive-orb',
                        oX          : p.oX,
                        oY          : p.oY,
                        radius      : 5,
                        intensity   : 1
                    });
                    
                    lights.push(orb);
                    new Timer(function () { orb.config.active = false }, 10);
                    
                    if (p.objectHit.type === 'tank') {
                        var t = p.objectHit.obj;
                        var debuff_amount = 5;
                        var debuff_min = 12;
                        var debuff_active = typeof t.debuff_cs_active !== 'undefined';
                        
                        if (!debuff_active) {
                            // apply base debuff
                            t.debuff_cs_active = true;
                            t.debuff_cs_stacks = 1;
                            
                            t.config.sSpeed = t.config.sSpeed < debuff_amount+debuff_min ? debuff_min : t.config.sSpeed - debuff_amount;
                            t.config.tSpeed = t.config.tSpeed < debuff_amount+debuff_min ? debuff_min : t.config.tSpeed - debuff_amount;
                            t.config.fSpeed = t.config.fSpeed < debuff_amount+debuff_min ? debuff_min : t.config.fSpeed - debuff_amount;
                            t.config.rSpeed = t.config.rSpeed < debuff_amount+debuff_min ? debuff_min : t.config.rSpeed - debuff_amount;
                            
                            t.debuff_cs_timeout = new Timer(function () {
                                // restore debuffed stats
                                t.config.sSpeed += debuff_amount * t.debuff_cs_stacks;
                                t.config.tSpeed += debuff_amount * t.debuff_cs_stacks;
                                t.config.fSpeed += debuff_amount * t.debuff_cs_stacks;
                                t.config.rSpeed += debuff_amount * t.debuff_cs_stacks;
                                
                                delete t.debuff_cs_active;
                                delete t.debuff_cs_stacks;
                                delete t.debuff_cs_timeout;
                            }, 6000);
                        }
                        else {
                            t.debuff_cs_stacks++;
                            t.config.sSpeed = t.config.sSpeed < debuff_amount+debuff_min ? debuff_min : t.config.sSpeed - debuff_amount;
                            t.config.tSpeed = t.config.tSpeed < debuff_amount+debuff_min ? debuff_min : t.config.tSpeed - debuff_amount;
                            t.config.fSpeed = t.config.fSpeed < debuff_amount+debuff_min ? debuff_min : t.config.fSpeed - debuff_amount;
                            t.config.rSpeed = t.config.rSpeed < debuff_amount+debuff_min ? debuff_min : t.config.rSpeed - debuff_amount;
                            
                            t.debuff_cs_timeout.extend(1500);
                        }
                    }
                };
                concussiveShell.id = 'concussiveShell';
                
                tank.projectile_mods.push(concussiveShell);
                
                tank.cs_timeout = new Timer(function () {
                    delete tank.cs_active;
                    delete tank.cs_timeout;
                    tank.projectile_mods = tank.projectile_mods.filter(function (item) { return item.id != 'concussiveShell'; });
                }, 12000);
            }
            else {
                tank.cs_timeout.extend(6000);
            }
        };
    }
    
    function HomingMissile(x, y) {
        /* Projectiles home into the nearest target. */
        this.config = {
            name    : 'Homing Missile',
            slug    : 'homing-missile',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('homing-missile')
        };
        
        this.use = function (tank) {
            var active = typeof tank.hm_active !== 'undefined';
            
            if (!active) {
                tank.hm_active = true;
                tank.hm_tracking_dist = 200;
                
                var homingMissile = function (projectile) {
                    var p = projectile.config;
                    
                    // Get nearest tank.
                    var nearest_tank = UTIL.getNearestTank(p.oX, p.oY, [p.srcId], [tank.config.faction]);
                    
                    if (nearest_tank === -1) { return; }
                    
                    // Check if it is near enough for tracking (can only home into tanks less than 512 units away)
                    var nearest_dist = UTIL.geometry.getDistanceBetweenPoints({x: p.oX, y: p.oY}, {x: nearest_tank.config.oX, y: nearest_tank.config.oY});
                    
                    if (nearest_dist > tank.hm_tracking_dist) { return; }
                    
                    // Determine which way to adjust projectile angle.
                    var dX = nearest_tank.config.oX - p.oX;
                    var dY = nearest_tank.config.oY - p.oY;
                    var angle_adj = 5;
                    
                    var tanA = Math.atan2(dY, dX) * 180/Math.PI;
                    tanA = tanA < 0 ? tanA + 360 : tanA;
                    tanA = tanA > p.angle ? tanA - p.angle : tanA + 360 - p.angle;
                    
                    var d_add = tanA;
                    var d_sub = Math.abs(360 - tanA);
                    
                    if (tanA === 360 || tanA === 0) {
                        // nothing
                    }
                    else if (d_add < d_sub) {
                        // turn left
                        p.angle = tanA < angle_adj ? tanA + p.angle : p.angle + angle_adj;
                    }
                    else if (d_add > d_sub) {
                        // turn right
                        p.angle = 360-tanA < angle_adj ? tanA + p.angle : p.angle - angle_adj;
                    }
                    
                    p.angle = p.angle % 360;
                    if (p.angle < 0) {
                        p.angle += 360;
                    }  
                };
                homingMissile.id = 'homingMissile';
                
                tank.projectile_mods.push(homingMissile);
                
                tank.hm_timeout = new Timer(function () {
                    delete tank.hm_active;
                    delete tank.hm_timeout;
                    delete tank.hm_tracking_dist;
                    tank.projectile_mods = tank.projectile_mods.filter(function (item) { return item.id != 'homingMissile'; });
                }, 12000);
            }
            else {
                tank.hm_tracking_dist += 20;
                tank.hm_timeout.extend(6000);
            }
        };
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
            
                var multiShot = function (args) {
                    var _oX = args._oX;
                    var _oY = args._oY;
                    for (var i = 1; i < tank.ts_stack + 1; i++) {
                        projectiles.push(new Projectile({mods: tank.projectile_mods, speed: tank.config.pSpeed, damage: tank.config.pDamage, critChance: tank.config.critChance, critMultiplier: tank.config.critMultiplier, angle:  tank.config.tAngle - (2 * i), oX: _oX, oY: _oY, srcId: tank.config.id, srcType: tank.config.name}));
                        projectiles.push(new Projectile({mods: tank.projectile_mods, speed: tank.config.pSpeed, damage: tank.config.pDamage, critChance: tank.config.critChance, critMultiplier: tank.config.critMultiplier, angle:  tank.config.tAngle + (2 * i), oX: _oX, oY: _oY, srcId: tank.config.id, srcType: tank.config.name}));
                    }
                };
                tank.events.listen('fire', multiShot);
                
                tank.ts_timeout = new Timer(function () {
                    delete tank.ts_active;
                    delete tank.ts_timeout;
                    delete tank.ts_stack;
                    tank.events.unlisten('fire', multiShot);
                }, 30000);
            }
            else {
                tank.ts_stack = tank.ts_stack > 16 ? tank.ts_stack : tank.ts_stack + 1; // cap at 16 stacks
                tank.ts_timeout.extend(12000);
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
                
                var returnHit = function(args) {
                    var p = args.projectile.config;
                
                    if (p.srcType === 'ricochet') {
                        return; // bounce once only please
                    }

                    var retProj = new Projectile({speed: p.speed, damage: p.damage, critChance: p.critChance, angle: (p.angle + 180) % 360, oX: p.oX, oY: p.oY, srcId: p.srcId, srcType: 'ricochet'});
                    projectiles.push(retProj);
                };
                tank.events.listen('hit', returnHit);
                
                tank.r_timeout = new Timer(function () {
                    delete tank.r_active;
                    delete tank.r_timeout;
                    tank.events.unlisten('hit', returnHit);
                }, 20000);
            }
            else {
                tank.r_timeout.extend(12000);
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
                tank.pb_radius = tank.config.width;
                tank.pb_active = true;
                tank.config.invulnerable++;
            
                var incBarrier = function (args) {
                    // Increases the barrier projectile count
                    var angle = UTIL.geometry.getAngleBetweenLineAndHAxis({x: tank.config.oX, y: tank.config.oY}, {x: args.projectile.config.oX, y: args.projectile.config.oY});
                    var tmp = new Projectile({speed: 0, damage: tank.config.pDamage, critChance: tank.config.critChance, angle: angle, oX: tank.config.oX + tank.pb_radius, oY: tank.config.oY, srcId: tank.config.id, srcType: 'projectile-barrier'});
                    projectiles.push(tmp);
                    tank.pBarrier.push([tmp, angle]);
                };
                tank.events.listen('hit', incBarrier);
                
                var updateBarrierSpin = function (args) {
                    // Updates the position of each projectile tethered to the tank

                    for (var i = 0; i < tank.pBarrier.length; i++) {
                        var newAngle = tank.pBarrier[i][1] + (360 * args.modifier);
                        newAngle = newAngle % 360;
                        var newLoc = UTIL.geometry.getPointAtAngleFrom(tank.config.oX, tank.config.oY, newAngle, tank.pb_radius);
                        tank.pBarrier[i][0].config.oX = newLoc[0];
                        tank.pBarrier[i][0].config.oY = newLoc[1];
                        tank.pBarrier[i][1] = newAngle;
                    }
                };
                tank.events.listen('frame', updateBarrierSpin);
                
                tank.pb_timeout = new Timer(function () {    
                    // deactivate all projectiles in pBarrier
                    for (var i = 0; i < tank.pBarrier.length; i++) {
                        tank.pBarrier[i][0].config.active = false;
                    }
                    
                    tank.config.invulnerable--;
                    delete tank.pBarrier; // remove temp variable
                    delete tank.pb_radius;
                    delete tank.pb_timeout;
                    delete tank.pb_active;
                    tank.events.unlisten('hit', incBarrier);
                    tank.events.unlisten('frame', updateBarrierSpin);
                }, 20000);
            }
            else {
                tank.pb_radius += 5; // increase projectile barrier radius
                tank.pb_timeout.extend(6000); // reset timer
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
            var active = typeof tank.rf_active !== 'undefined';
            
            if (!active) {
                tank.config.fRate += 5;
                
                tank.rf_active = true;
                tank.rf_stacks = 1;
                
                tank.rf_timeout = new Timer(function () {
                    tank.config.fRate -= 5 * tank.rf_stacks;
                    delete tank.rf_active;
                    delete tank.rf_stacks;
                    delete tank.rf_timeout;
                }, 12000);
            }
            else {
                tank.config.fRate += 5;
                tank.rf_stacks++;
                tank.rf_timeout.extend(12000);
            }
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
            var active = typeof tank.h_active !== 'undefined';
        
            if (!active) {
                tank.config.fSpeed += 100;
                tank.config.rSpeed += 100;
                tank.config.tSpeed += 40;
                tank.config.sSpeed += 20;
                
                tank.h_active = true;
                tank.h_stacks = 1;
                
                tank.h_timeout = new Timer(function () {
                    tank.config.fSpeed -= 100 * tank.h_stacks;
                    tank.config.rSpeed -= 100 * tank.h_stacks;
                    tank.config.tSpeed -= 40 * tank.h_stacks;
                    tank.config.sSpeed -= 20 * tank.h_stacks;
                    
                    delete tank.h_active;
                    delete tank.h_stacks;
                    delete tank.h_timeout;
                }, 20000);
            }
            else {
                tank.config.fSpeed += 100;
                tank.config.rSpeed += 100;
                tank.config.tSpeed += 40;
                tank.config.sSpeed += 20;
                tank.h_stacks++;
                tank.h_timeout.extend(3000);
            }
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
            var active = typeof tank.fp_active !== 'undefined';
            
            if (!active) {
                tank.config.pSpeed += 200;
                
                tank.fp_active = true;
                tank.fp_stacks = 1;
                
                tank.fp_timeout = new Timer(function () {
                    tank.config.pSpeed -= 200 * tank.fp_stacks;
                    
                    delete tank.fp_active;
                    delete tank.fp_stacks;
                    delete tank.fp_timeout;
                }, 30000);
            }
            else {
                tank.config.pSpeed += 200;
                tank.fp_stacks++;
                tank.fp_timeout.extend(6000);
            }
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
            var active = typeof tank.ia_active !== 'undefined';
            
            if (!active) {
                tank.config.armor += 50;
                
                tank.ia_active = true;
                tank.ia_stacks = 1;
                
                tank.ia_timeout = new Timer(function () {
                    tank.config.armor -= 50 * tank.ia_stacks;
                    
                    delete tank.ia_active;
                    delete tank.ia_stacks;
                    delete tank.ia_timeout;
                }, 30000);
            }
            else {
                tank.config.armor += 50;
                tank.ia_stacks++;
                tank.ia_timeout.extend(12000);
            }
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
            var active = typeof tank.id_active !== 'undefined';
            
            if (!active) {
                tank.config.pDamage += 50;
                
                tank.id_active = true;
                tank.id_stacks = 1;
                
                tank.id_timeout = new Timer(function () { 
                    tank.config.pDamage -= 50 * tank.id_stacks;

                    delete tank.id_active;
                    delete tank.id_stacks;
                    delete tank.id_timeout;
                }, 30000);
            }
            else {
                tank.config.pDamage += 50;
                tank.id_stacks++;
                tank.id_timeout.extend(12000);
            }
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
                tank.hitsTaken = tank.hitsTaken > 0 ? tank.hitsTaken : 8;
                
                tank.as_vfx = new VisualEffect({name: 'aphotic_shield', oX: tank.config.oX, oY: tank.config.oY, width: 32, height: 32, scaleW: 52, scaleH: 52, maxCols: 4, maxRows: 4, framesTillUpdate: 2, loop: true, spriteSheet: 'aphotic_shield'});
                visualeffects.push(tank.as_vfx);
                tank.config.invulnerable++;
                
                var absorbHit = function () {
                    // keep count of hits taken
                    tank.hitsTaken += 4;
                };
                tank.events.listen('hit', absorbHit);
                
                var asAnim = function () {
                    // update animation position
                    tank.as_vfx.updatePos(tank.config.oX, tank.config.oY);
                };
                tank.events.listen('frame', asAnim);
                
                tank.as_timeout = new Timer(function () {
                    // fire the number of absorbed projectiles in all directions
                    var aFactor = 360/tank.hitsTaken;
                    var cAngle = 0;
                    var x = 0;
                    var y = 0;
                    
                    var fireTrailFX = function (projectile) {
                        visualeffects.push(new VisualEffect({name: 'explosion', oX: projectile.config.oX, oY: projectile.config.oY, width: 32, height: 32, scaleW: 12, scaleH: 12,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'explosion'}));
                    }
                    
                    for (var i = 0; i < tank.hitsTaken; i++) {
                        // determine starting coordinates of projectile based on vector info
                        x = tank.config.oX + Math.cos(cAngle * Math.PI/180) * (tank.config.cRadius+10);
                        y = tank.config.oY + Math.sin(cAngle * Math.PI/180) * (tank.config.cRadius+10);
                        
                        // create new projectile
                        var proj = new Projectile({ speed: tank.config.pSpeed * 1.25, damage: tank.config.pDamage, critChance: tank.config.critChance, angle:  cAngle, oX: x, oY: y, srcId: tank.config.id, srcType: 'blast'});
                        proj.mods.push(fireTrailFX);
                        
                        // add projectile to array
                        projectiles.push(proj);
                        
                        // set cAngle
                        cAngle += aFactor;
                    }
                    
                    tank.config.invulnerable--;
                    tank.as_vfx.end();
                    
                    tank.events.unlisten('hit', absorbHit);
                    tank.events.unlisten('frame', asAnim);
                    d_explodeSound.get(); // play explode sound
                    
                    delete tank.hitsTaken; // remove temp variable
                    delete tank.as_active;
                    delete tank.as_vfx;
                    delete tank.as_timeout;
                }, 8000);
            }
            else {
                tank.as_timeout.extend(6000);
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
                tank.armorAdd = 20;
                
                var increaseArmorWhenHit = function () {
                    // increase armor each hit
                    tank.armorBuff += tank.armorAdd;
                    tank.config.armor += tank.armorAdd;
                };
                tank.events.listen('hit', increaseArmorWhenHit);
                
                tank.ra_timeout = new Timer(function () {
                    tank.config.armor -= tank.armorBuff;
                    delete tank.armorBuff; // remove temp variable
                    delete tank.ra_timeout; // remove temp variable
                    delete tank.ra_active;
                    delete tank.armorAdd;
                    tank.events.unlisten('hit', increaseArmorWhenHit);
                }, 20000);
            }
            else {
                tank.armorAdd += 20;
                tank.ra_timeout.extend(6000);
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
            var active = typeof tank.regen !== 'undefined';
            
            if (!active) {
                tank.regen = {};
                tank.regen.stacks = 1;
                tank.regen.rate = tank.config.maxHealth * 0.0005 * tank.regen.stacks; // 5% per second

                tank.regen.interval = new Interval(function () {
                    tank.config.health = tank.config.maxHealth - tank.config.health < tank.regen.rate ? tank.config.maxHealth : tank.config.health + tank.regen.rate;
                    renderExtern();
                    if (tank.config.health === tank.config.maxHealth) {
                        tank.regen.interval.clear();
                        tank.events.unlisten('hit', dispellRegen);
                        delete tank.regen;
                    }
                }, 10);

                var dispellRegen = function () {
                    // dispell regen
                    tank.regen.interval.clear();
                    tank.events.unlisten('hit', dispellRegen);
                    delete tank.regen;
                };
                tank.events.listen('hit', dispellRegen);
            }
            else {
                tank.regen.stacks += 1;
                tank.regen.rate = tank.config.maxHealth * 0.0005 * tank.regen.stacks;
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
            tank.config.ammo += 100;
        };
    }
    
    return my;
}());