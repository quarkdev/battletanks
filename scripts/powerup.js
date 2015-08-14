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
        {slug: 'gold-coin', cost: 50, desc: 'Gives 500 gold.'},
        {slug: 'increased-critical-chance', cost: 40, desc: 'Increases critical hit chance by 5% per stack.'},
        {slug: 'kinetic-shell', cost: 30, desc: 'Adds a knockback to projectile attacks. Knockback distance is (projectile speed / 100) units, resets movement velocities to zero on hit.'},
        {slug: 'time-dilation-sphere', cost: 40, desc: 'Reduces the speed of projectiles within a 175-unit radius of the host tank by 90%.'},
        {slug: 'nuke', cost: 1000, desc: 'Deals massive damage to enemy tanks within effective radius. Damage diminishes with distance.'},
        {slug: 'deflect', cost: 100, desc: 'Uses 50% less shield energy to deflect incoming projectiles. Temporarily gives 1000 shield and 200 shield regen. Bonus is halved when stacked.'},
        {slug: 'point-defense-laser', cost: 100, desc: 'Uses lasers to destroy incoming projectiles. Temporarily gives 1000 shield and 200 shield regen. Bonus is halved when stacked.'},
        {slug: 'impulse-shell', cost: 150, desc: 'Deals extra damage based on distance travelled by projectile.'},
        {slug: 'mine', cost: 10, desc: 'Plants an anti-tank mine on the ground that becomes armed after 3 seconds. Deals moderate damage.'},
        {slug: 'carpet-bomb', cost: 100, desc: 'Calls a C-130 Carpet Bomber to lay waste on an area. Direction is relies on turret facing angle.'},
        {slug: 'armor-piercing-shell', cost: 100, desc: 'Each projectile hit reduces enemy armor by 5.'},
        {slug: 'high-explosive-shell', cost: 100, desc: 'Each projectile hit deals an extra Area-of-Effect damage.'},
        {slug: 'chaos-shell', cost: 100, desc: 'Has 10% chance to fire a projectile that deals 10 - 5000 percent damage.'},
        {slug: 'vampiric-shell', cost: 500, desc: '1% of the shell damage is returned to the source as health.'},
        {slug: 'emp-shell', cost: 500, desc: 'Causes the target tank\'s shield to burst dealing additional damage.'},
        {slug: 'pocket-tank', cost: 100, desc: 'Spawns 1 friendly tank to fight for you. Spawned tanks are destroyed on spawner\'s death.'}
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
            case 'point-defense-laser':
                return new PointDefenseLaser(x, y);
            case 'impulse-shell':
                return new ImpulseShell(x, y);
            case 'mine':
                return new Mine(x, y);
            case 'carpet-bomb':
                return new CarpetBomb(x, y);
            case 'armor-piercing-shell':
                return new ArmorPiercingShell(x, y);
            case 'high-explosive-shell':
                return new HighExplosiveShell(x, y);
            case 'chaos-shell':
                return new ChaosShell(x, y);
            case 'vampiric-shell':
                return new VampiricShell(x, y);
            case 'emp-shell':
                return new EMPShell(x, y);
            case 'pocket-tank':
                return new PocketTank(x, y);
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
    
    function MissileTurret(x, y) {
        /* Drops a stationary missile turret at current location. Turret attacks nearby enemy tanks. */
        this.config = {
            name    : 'Missile Turret',
            slug    : 'missile-turret',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('missile-turret')
        };
        
        this.use = function (tank) {
        }
    }
    
    function PocketTank(x, y) {
        /* Spawns 1 random friendly tank at your location. */
        this.config = {
            name    : 'Pocket Tank',
            slug    : 'pocket-tank',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('pocket-tank')
        };
        
        this.use = function (tank) {
            // add the spawn vortex effect
            var x = tank.config.oX;
            var y = tank.config.oY;
            var vfx = new VisualEffect({
                name: 'spawn_vortex',
                oX: x,
                oY: y,
                width: 128,
                height: 128,
                scaleW: 128,
                scaleH: 128,
                maxCols: 8,
                maxRows: 4,
                framesTillUpdate: 0,
                loop: true,
                vom: true,
                spriteSheet: 'wf-2'
            });
            visualeffects.push(vfx);
        
            new Timer(function () {
                vfx.end();
                if (!tank.config.active) { return; } // don't spawn if spawner dies before timer 
                // randomly select a tank blueprint
                GLOBALS.abotCount++;
                var bp = BLUEPRINT.getByType('tanks');
                bp = bp[Math.floor(Math.random() * bp.length)];
                var tId = 'abot' + GLOBALS.abotCount;
                var t = new Tank(bp, tId, 'computer_p', x, y, tank.config.faction);
                tanks.push(t);
                var _x = Math.floor(Math.random() * WORLD_WIDTH);
                var _y = Math.floor(Math.random() * WORLD_HEIGHT);
                bots.push([t, [], 'waiting', 'patrol', {los: false, x: _x, y: _y}, null, null]);
                LOAD.worker.pathFinder(GLOBALS.packedDestructibles, tId, t.config.id, t.config.width);
                // spawned tanks explode when their spawner is destroyed
                tank.events.listen('death', function () {
                    t.death();
                });
            }, 1500);
        }
    }
    
    function EMPShell(x, y) {
        /* Causes the target tank's shield to burst dealing additional damage. Also causes tanks to emit an EMP on death. */
        this.config = {
            name    : 'EMP Shell',
            slug    : 'emp-shell',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('emp-shell')
        };
        
        this.use = function (tank) {
            if (typeof tank.ems === 'undefined') {
                tank.ems = {};
                
                var empShell = function (projectile) {
                    if (typeof projectile.emsActive === 'undefined') {
                        projectile.emsActive = true;
                        projectile.events.listen('tank_hit', function () {
                            visualeffects.push(new VisualEffect({name: 'shield-burst', oX: projectile.config.oX, oY: projectile.config.oY, width: 128, height: 128, angle: Math.random() * 360, scaleW: 96, scaleH: 96, maxCols: 8, maxRows: 3, framesTillUpdate: 0, loop: false, spriteSheet: 'flash-burst-5'}));
                            // calculate 0.5% of target's shield
                            var target = projectile.config.objectHit.obj;
                            var bv = target.config.maxShield * 0.005;
                            // check how much shield energy left
                            var sl = target.config.shield;
                            // calculate final burst value
                            bv = sl > bv ? bv : sl;
                            // remove shield energy
                            target.config.shield -= bv;
                            // deal damage to tank (ignores armor and shield)
                            target.config.health -= bv;
                            target.config.health = target.config.health > 0 ? target.config.health : 0;
                        });
                    }
                };
                empShell.id = 'empShell';
                
                var empWave = function (projectile) {
                    projectile.events.listen('tank_hit', function () {
                        var t = projectile.config.objectHit.obj;
                        if (typeof t.empwflagged === 'undefined') {
                            t.empwflagged = true;
                            t.events.listen('death', function () {
                                // start implosion animation
                                visualeffects.push(new VisualEffect({name: 'emp-implode', oX: t.config.oX, oY: t.config.oY, width: 256, height: 256, scaleW: t.config.width * 3, scaleH: t.config.width * 3, maxCols: 8, maxRows: 7, framesTillUpdate: 0, loop: false, spriteSheet: 'implode-3', endCallBack: function () {
                                    // start wave animation
                                    visualeffects.push(new VisualEffect({name: 'emp-wave', oX: t.config.oX, oY: t.config.oY, width: 128, height: 128, scaleW: t.config.width * 6, scaleH: t.config.width * 6, maxCols: 4, maxRows: 2, framesTillUpdate: 0, loop: false, spriteSheet: 'blast-wave-2'}));
                                    // deal damage to nearby tanks based on total energy
                                    UTIL.dealAreaDamage({x: t.config.oX, y: t.config.oY}, t.config.maxShield, 200);
                                }}));
                            });
                        }
                    });
                };
                empWave.id = 'empWave';
                
                tank.projectile_mods.push(empShell);
                tank.projectile_mods.push(empWave);
                
                tank.ems.timeout = new Timer(function () {
                    delete tank.ems;
                    tank.projectile_mods = tank.projectile_mods.filter(function (item) { return item.id != 'empShell' && item.id != 'empWave'; });
                }, 6000);
            }
            else {
                tank.ems.timeout.extend(3000);
            }
        };
    }
    
    function VampiricShell(x, y) {
        /* 1% of the shell's damage heals the source. */
        this.config = {
            name    : 'Vampiric Shell',
            slug    : 'vampiric-shell',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('vampiric-shell')
        };
        
        this.use = function (tank) {
            if (typeof tank.vs === 'undefined') {
                tank.vs = {};
                
                tank.vs.vfx = new VisualEffect({name: 'vampiric-aura', oX: tank.config.oX, oY: tank.config.oY, width: 128, height: 128, scaleW: tank.config.tSize * 2, scaleH: tank.config.tSize * 2, maxCols: 8, maxRows: 4, framesTillUpdate: 0, loop: true, spriteSheet: 'halo-5'});
                visualeffects.push(tank.vs.vfx);
                
                var vsAnim = function () {
                    tank.vs.vfx.updatePos(tank.config.oX, tank.config.oY);
                };
                tank.events.listen('frame', vsAnim);
                
                var vsAnimEnd = function () {
                    tank.vs.vfx.end();
                };
                tank.events.listen('death', vsAnimEnd);
                
                var vampiricShell = function (projectile) {
                    if (typeof projectile.vsActive === 'undefined') {
                        projectile.vsActive = true;
                        projectile.events.listen('death', function () {
                            if (projectile.config.objectHit.type !== 'tank') { return; }

                            //visualeffects.push(new VisualEffect({name: 'explosion', oX: projectile.config.oX, oY: projectile.config.oY, width: 256, height: 256, angle: Math.random() * 360, scaleW: r, scaleH: r, maxCols: 8, maxRows: 6, framesTillUpdate: 0, loop: false, spriteSheet: 'ms-exp-7'}));
                            
                            tank.config.health += (projectile.config.damage * 0.01);
                            tank.config.health = tank.config.health > tank.config.maxHealth ? tank.config.maxHealth : tank.config.health;
                            renderExtern();
                        });
                    }
                };
                vampiricShell.id = 'vampiricShell';
                
                tank.projectile_mods.push(vampiricShell);
                
                tank.vs.timeout = new Timer(function () {
                    tank.events.unlisten('frame', vsAnim);
                    tank.events.unlisten('death', vsAnimEnd);
                    tank.vs.vfx.end();
                    delete tank.vs;
                    tank.projectile_mods = tank.projectile_mods.filter(function (item) { return item.id != 'vampiricShell'; });
                }, 12000);
            }
            else {
                tank.vs.timeout.extend(6000);
            }
        };
    }
    
    function ChaosShell(x, y) {
        /* has 10% chance to fire a chaos shell that deals 10%-5000% damage */
        this.config = {
            name    : 'Chaos Shell',
            slug    : 'chaos-shell',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('chaos-shell')
        };
        
        this.use = function (tank) {
            if (typeof tank.csh === 'undefined') {
                tank.csh = {};
                
                var chaosShell = function (projectile) {
                    var p = projectile.config;
                    
                    if (typeof p.csh_flagged === 'undefined') {
                        // roll
                        p.csh_flagged = true;
                        var roll = Math.random();
                        if (roll < 0.1) {
                            p.csh_active = true;
                        }
                    }
                    
                    if (p.active && p.csh_active) {
                        if (typeof p.cshvfx === 'undefined') {
                            var random = Math.floor(Math.random() * (5000 - 10 + 1)) + 10;
                            p.damage = p.damage * (random / 100.0);
                            var size = 196 + ((random / 100) * 3);
                            p.cshvfx = new VisualEffect({name: 'csh-flare', oX: p.oX, oY: p.oY, width: 256, height: 256, scaleW: size, scaleH: size,  maxCols: 8, maxRows: 4, framesTillUpdate: 0, loop: true, spriteSheet: 'bflaree'});
                            visualeffects.push(p.cshvfx);
                            projectile.events.listen('death', function () {p.cshvfx.end(); });
                        }
                        else {
                            p.cshvfx.config.oX = p.oX;
                            p.cshvfx.config.oY = p.oY;
                        }
                    }
                };
                chaosShell.id = 'chaosShell';
                
                tank.projectile_mods.push(chaosShell);
                
                tank.csh.timeout = new Timer(function () {
                    delete tank.csh;
                    tank.projectile_mods = tank.projectile_mods.filter(function (item) { return item.id != 'chaosShell'; });
                }, 12000);
            }
            else {
                tank.csh.timeout.extend(6000);
            }
        };
    }
    
    function HighExplosiveShell(x, y) {
        /* shells will do extra area damage on hit. */
        this.config = {
            name    : 'High Explosive Shell',
            slug    : 'high-explosive-shell',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('high-explosive-shell')
        };
        
        this.use = function (tank) {
            if (typeof tank.hes === 'undefined') {
            
                tank.hes = {};
                
                var makeExplosive = function (projectile) {
                    if (typeof projectile.hesActive === 'undefined') {
                        projectile.hesActive = true;
                        projectile.events.listen('death', function () {
                            if (projectile.config.objectHit.type === 'boundary') { return; }
                            
                            var _f = Math.random();
                            var _d = _f * 56;
                            var r = 200 + _d;
                            visualeffects.push(new VisualEffect({name: 'explosion', oX: projectile.config.oX, oY: projectile.config.oY, width: 256, height: 256, angle: Math.random() * 360, scaleW: r, scaleH: r, maxCols: 8, maxRows: 6, framesTillUpdate: 0, loop: false, spriteSheet: 'ms-exp-7'}));
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
                            
                            UTIL.dealAreaDamage({x: projectile.config.oX, y: projectile.config.oY}, projectile.config.damage * (0.50 + (_f * 0.25)), r, r * 0.6, false);
                        });
                    }
                };
                makeExplosive.id = 'makeExplosive';
                
                tank.projectile_mods.push(makeExplosive);
                
                tank.hes.timeout = new Timer(function () {
                    delete tank.hes;
                    tank.projectile_mods = tank.projectile_mods.filter(function (item) { return item.id != 'makeExplosive'; });
                }, 12000);
            }
            else {
                tank.hes.timeout.extend(8000);
            }
        };
    }
    
    function ArmorPiercingShell(x, y) {
        /* reduce enemy armor for every hit. */
        this.config = {
            name    : 'Armor Piercing Shell',
            slug    : 'armor-peircing-shell',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('armor-piercing-shell')
        };
        
        this.use = function (tank) {
            if (typeof tank.aps === 'undefined') {
                tank.aps = {};
                
                var apShell = function (projectile) {
                    var p = projectile.config;
                    
                    if (p.active) {
                        if (typeof p.apsvfx === 'undefined') {
                            p.apsvfx = new VisualEffect({name: 'aps-flare', oX: p.oX, oY: p.oY, width: 128, height: 128, scaleW: 64, scaleH: 64,  maxCols: 8, maxRows: 4, framesTillUpdate: 0, loop: true, spriteSheet: 'flicker-flare'});
                            visualeffects.push(p.apsvfx);
                            projectile.events.listen('death', function () { p.apsvfx.end(); });
                        }
                        else {
                            p.apsvfx.config.oX = p.oX;
                            p.apsvfx.config.oY = p.oY;
                        }
                    }
                    
                    if (p.objectHit.type === 'tank') {
                        var t = p.objectHit.obj.config;
                        var da = 5; // debuff amount
                        
                        if (typeof t.debuffs.aps === 'undefined') {
                            // apply base debuff
                            t.debuffs.aps = {};
                            t.debuffs.aps.stacks = 1;
                            
                            t.armor -= da;
                            
                            t.debuffs.aps.timeout = new Timer(function () {
                                // restore debuffed stats
                                t.armor += t.debuffs.aps.stacks * da;
                                
                                delete t.debuffs.aps;
                            }, 8000);
                        }
                        else {
                            t.debuffs.aps.stacks++;
                            t.armor -= da;
                            
                            t.debuffs.aps.timeout.reset();
                        }
                    }
                };
                apShell.id = 'apShell';
                
                tank.projectile_mods.push(apShell);
                
                tank.aps.timeout = new Timer(function () {
                    delete tank.aps;
                    tank.projectile_mods = tank.projectile_mods.filter(function (item) { return item.id != 'apShell'; });
                }, 12000);
            }
            else {
                tank.aps.timeout.extend(6000);
            }
        };
    }
    
    function CarpetBomb(x, y) {
        /* call a carpet-bombing run on an area. */
        this.config = {
            name    : 'Carpet Bomb',
            slug    : 'carpet-bomb',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('carpet-bomb')
        };
        
        this.use = function (tank) {
            // aux fn fly
            var fly = function (dy) {
                var d = 360 * dy.delta;
                var P = UTIL.geometry.getPointAtAngleFrom(dy.config.oX, dy.config.oY, dy.config.angle, d);
                
                // move dummy
                dy.config.oX = dy.vfx.config.oX = P[0];
                dy.config.oY = dy.vfx.config.oY = P[1];
            };
        
            // aux fn drop bomb
            var dropBomb = function (dy) {
                // check if distance to target < 500 units and drop is not on cooldown
                if (UTIL.geometry.getDistanceBetweenPoints(dy.target, {x: dy.config.oX, y: dy.config.oY}) < 500 && !dy.dbcd) {
                    dy.dbcd = true; // drop bomb cooldown
                    dy.bombingStarted = true;
                
                    new Timer(function () {
                        dy.dbcd = false;
                    }, 50);
                
                    // cause an explosion anywhere within 160 radius
                    var r = 128 + (Math.random() * 84)
                    var a = Math.random() * 360;
                    var d = Math.random() * 160;
                    var offset = UTIL.geometry.getPointAtAngleFrom(dy.config.oX, dy.config.oY, dy.config.angle + 180, 100);
                    var P = UTIL.geometry.getPointAtAngleFrom(offset[0], offset[1], a, d);
                    
                    // deal damage to tanks/destructibles/proc chainExplode dummies
                    UTIL.dealAreaDamage({x: P[0], y: P[1]}, 1800, 200, 90);
                    
                    // show explosion flash
                    var flash = new Light({
                        name        : 'x-flash',
                        oX          : P[0],
                        oY          : P[1],
                        radius      : r - 100,
                        intensity   : 0.4,
                        duration    : 200
                    });

                    lights.push(flash);
                    
                    // push explosion vfx
                    visualeffects.push(new VisualEffect({name: 'explosion', oX: P[0], oY: P[1], width: 256, height: 256, angle: a, scaleW: r, scaleH: r,  maxCols: 8, maxRows: 4, framesTillUpdate: 0, loop: false, vom: true, spriteSheet: 'sq-exp'}));
                
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
                else if (UTIL.geometry.getDistanceBetweenPoints(dy.target, {x: dy.config.oX, y: dy.config.oY}) > 1200 && dy.bombingStarted) {
                    // destroy dummy
                    dy.vfx.end();
                    dy.config.active = false;
                }
            };
        
            // create dummy object just outside the tank's vision
            var _P = UTIL.geometry.getPointAtAngleFrom(tank.config.oX, tank.config.oY, tank.config.tAngle + 180, 1200); // b2 bomber point of origin
            var _T = UTIL.geometry.getPointAtAngleFrom(tank.config.oX, tank.config.oY, tank.config.tAngle, 1000); // b2 bomber target 1000 units ahead
             
            var dummy = new Dummy({name: 'c130-carpet-bomber', mods: [fly, dropBomb], oX: _P[0], oY: _P[1]});
            
            dummy.target = {
                x: _T[0],
                y: _T[1]
            };
            
            dummy.dbcd = false;
            dummy.bombingStarted = false;
            dummy.config.angle = tank.config.tAngle;
            dummy.vfx = new VisualEffect({name: 'c130-sil', oX: dummy.config.oX, oY: dummy.config.oY, width: 365, height: 533, angle: tank.config.tAngle, scaleW: 365, scaleH: 533,  maxCols: 1, maxRows: 1, framesTillUpdate: 0, loop: false, paused: true, vom: true, spriteSheet: 'c130-sil'});
            visualeffects.push(dummy.vfx);
            c130_sound.get();
            
            dummies.push(dummy);
        };
    }
    
    function Mine(x, y) {
        /* It's a trap! */
        this.config = {
            name    : 'Mine',
            slug    : 'mine',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('mine')
        };
        
        this.use = function (tank) {
            // drops a landmine in an area that becomes active after 3 seconds
            
            var loc = {
                x: tank.config.oX,
                y: tank.config.oY
            };
            
            // nearby tank/destructible detection
            var search_area = function (dy) {
            
                var my = {};
                
                my.explode = function () {
                    visualeffects.push(new VisualEffect({name: 'mine_exp', oX: dy.config.oX, oY: dy.config.oY, width: 256, height: 256, angle: Math.random() * 360, scaleW: 256, scaleH: 256,  maxCols: 8, maxRows: 6, framesTillUpdate: 0, loop: false, spriteSheet: 'cloud-exp-2'}));

                    // show explosion flash
                    var flash = new Light({
                        name        : 'x-flash',
                        oX          : dy.config.oX,
                        oY          : dy.config.oY,
                        radius      : 160,
                        intensity   : 0.5,
                        duration    : 200
                    });

                    lights.push(flash);
                    
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
                    
                    UTIL.dealAreaDamage(loc, 8000, 220, 90);
                };

                if (dy.config.active && dy.armed) {
                    var procced = false;

                    for (var i = 0; i < tanks.length; i++) {
                        var d = UTIL.geometry.getDistanceBetweenPoints(loc, {x: tanks[i].config.oX, y: tanks[i].config.oY});
                        if (d > 60) { continue; } // trigger distance
                        
                        // found a victim!
                        procced = true;
                        break;
                    }

                    if (procced || dy.chainExplode) {
                        // boom!
                        my.explode();
                        
                        // disarm mine
                        dy.vfx.end();
                        dy.config.active = false;
                        dy.armed = false;
                    }
                }
                
                return my;
            };
            
            // create a projectile dummy for our landmine
            var dummy = new Dummy({name: 'mine', mods: [search_area], oX: loc.x, oY: loc.y, explosive: true});
            dummies.push(dummy);
            
            // show a landmine vfx at projectile location (paused)
            dummy.vfx = new VisualEffect({name: 'mine', oX: loc.x, oY: loc.y, width: 40, height: 40, scaleW: 20, scaleH: 20,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: true, resettable: true, paused: true, spriteSheet: 'mine'});
            visualeffects.push(dummy.vfx);

            // activate landmine after 3 seconds
            new Timer(function () {
                dummy.vfx.unPause();
                dummy.armed = true;
            }, 3000);
        };
    }
    
    function ImpulseShell(x, y) {
        /* Deals extra damage based on distance. */
        this.config = {
            name    : 'Impulse Shell',
            slug    : 'impulse-shell',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('impulse-shell')
        };
        
        this.use = function (tank) {
            var active = typeof tank.is !== 'undefined';
            
            if (!active) {
                tank.is = {};
                
                var impulseShell = function (projectile) {
                    var p = projectile.config;
                    
                    // increase damage per distance travelled
                    var _dt = UTIL.geometry.getDistanceBetweenPoints(p.lastPos, {x: p.oX, y: p.oY}); // distance travelled per frame
                    var _dmult = 1.5;
                    
                    _dt = isNaN(_dt) ? 0 : _dt; // quick-fix: swallow non-number calcs
                    
                    p.dt = typeof p.dt !== 'undefined' ? p.dt + _dt : 0; // total distance travelled
                    p.damage += _dt * _dmult * (GLOBALS.map.wave.current + 1);
                    
                    // increase vfx size based on distance
                    var _growth = p.dt / 100;
                    _growth = _growth > 6 ? 6 : _growth; // clamp at 6
                    
                    // show trail vfx
                    visualeffects.push(new VisualEffect({name: 'impulse_trail', oX: p.oX, oY: p.oY, width: 32, height: 32, scaleW: 6 + _growth, scaleH: 6 + _growth,  maxCols: 2, maxRows: 2, framesTillUpdate: 0, loop: false, spriteSheet: 'impulse_glow'}));
                };
                impulseShell.id = 'impsh';
                
                tank.projectile_mods.push(impulseShell);
                
                tank.is.timeout = new Timer(function () {
                    delete tank.is;
                    tank.projectile_mods = tank.projectile_mods.filter(function (item) { return item.id != 'impsh'; });
                }, 12000);
            }
            else {
                tank.is.timeout.extend(8000);
            }
        };
    }
    
    function PointDefenseLaser(x, y) {
        /* pdls projectiles. */
        this.config = {
            name    : 'Point Defense Laser',
            slug    : 'point-defense-laser',
            oX      : x,
            oY      : y,
            size    : 32,
            cRadius : 16,
            image   : PowerUpImages.get('point-defense-laser')
        };
        
        this.use = function (tank) {
            var active = typeof tank.pdl !== 'undefined';
            
            if (!active) {
                tank.pdl = {};
                tank.pdl.vfx = []; // active pdl hit animations
                tank.pdl.shield = 1000; // bonus shield
                tank.pdl.shieldRegen = 200; // bonus shield regen
                tank.config.maxShield += 1000;
                tank.config.shieldRegen += 200;
                
                var areapdl = function () {
                    tank.pdl.vfx = tank.pdl.vfx.filter(function(item) {
                        return item.config.active;
                    });
                
                    // update vfx position
                    for (var i = 0; i < tank.pdl.vfx.length; i++) {
                        tank.pdl.vfx[i].updatePos(tank.config.oX, tank.config.oY);
                    }
                
                    // loop through all active projectiles
                    for (var i = 0; i < projectiles.length; i++) {
                        if (projectiles[i].config.srcId === tank.config.id) continue; // doesn't affect user projectiles
                        if (!projectiles[i].config.active) continue; // skip inactive projectiles
                        
                        // check if projectile is within AOE (fixed radius of 175)
                        var dist = UTIL.geometry.getDistanceBetweenPoints({x: tank.config.oX, y: tank.config.oY}, {x: projectiles[i].config.oX, y: projectiles[i].config.oY});
                        var rndD = Math.floor(Math.random() * (60 - 20)) + 20;
                        
                        if (dist > tank.config.cRadius + rndD) {
                            continue;
                        }
                        
                        // if projectile within AOE, apply pdl flag if not already applied (tested via a unique property)
                        if (typeof projectiles[i].flaggedpdl === 'undefined') {
                            projectiles[i].flaggedpdl = tank.config.id; // set flag owner
                            // check if tank has enough shield energy to pdl the projectile
                            var _pdmg = projectiles[i].config.damage / 4; // pdl barrier consumes less shield energy than default shield
                            
                            if (tank.config.shield < _pdmg) {
                                // if remaining shield energy is not enough, projectile is not destroyed
                                continue;
                            }
                            
                            // else, we deplete the shield energy to use pdl
                            tank.config.shield -= _pdmg;
                            
                            // do an explosion on point of intersection
                            var poi = UTIL.geometry.getLineCircleIntersectionPoints(
                                projectiles[i].config.origin,
                                {x: projectiles[i].config.oX, y: projectiles[i].config.oY},
                                {x: tank.config.oX, y: tank.config.oY},
                                tank.config.cRadius + rndD
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
                            
                            (function (x, y, tx, ty) {
                                // explosion vfx
                                var hit_explosion_scale = Math.floor((Math.random() * 15) + 10);
                                visualeffects.push(new VisualEffect({name: 'hit_explosion', oX: x, oY: y, width: 32, height: 32, scaleW: hit_explosion_scale, scaleH: hit_explosion_scale,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'explosion'}));
                                
                                // hit vfx
                                var poia = UTIL.geometry.getAngleBetweenLineAndHAxis({x: tx, y: ty}, {x: x, y: y});
                                var shield_vfx = new VisualEffect({name: 'laser-strike', oX: tx, oY: ty, width: 125, height: 125, angle: poia, scaleW: (tank.config.cRadius+rndD)*2, scaleH: (tank.config.cRadius+rndD)*2,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'point-defense-laser'});
                                
                                // show hit flash
                                var flash = new Light({
                                    name        : 'hit-flash',
                                    oX          : x,
                                    oY          : y,
                                    radius      : hit_explosion_scale,
                                    intensity   : 0.3,
                                    duration    : 40
                                });

                                lights.push(flash);
                                
                                tank.pdl.vfx.push(shield_vfx);
                                visualeffects.push(shield_vfx);
                            })(poi[ri].x, poi[ri].y, tank.config.oX, tank.config.oY);
                            
                            laser_impact_sound.get();
                            explodeSound.get();
                            
                            // deactivate projectile
                            projectiles[i].death();
                        }
                    }
                };
                tank.events.listen('frame', areapdl)
                
                tank.pdl.timeout = new Timer(function() {
                    tank.events.unlisten('frame', areapdl);
                    tank.config.maxShield -= tank.pdl.shield;
                    tank.config.maxShield = Math.max(tank.config.maxShield, 0);
                    tank.config.shield = tank.config.shield > tank.config.maxShield ? tank.config.maxShield : tank.config.shield;
                    tank.config.shieldRegen -= tank.pdl.shieldRegen;
                    delete tank.pdl;
                }, 10000);
            }
            else {
                tank.config.maxShield += 500;
                tank.config.shieldRegen += 100;
                tank.pdl.shield += 500;
                tank.pdl.shieldRegen += 100;
                tank.pdl.timeout.extend(5000);
            }
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
                        if (typeof projectiles[i].flaggedDeflect === 'undefined') {
                            projectiles[i].flaggedDeflect = tank.config.id; // set flag owner
                            // check if tank has enough shield energy to deflect the projectile
                            var _pdmg = projectiles[i].config.damage / 2; // deflect barrier consumes less shield energy than default shield
                            
                            if (tank.config.shield < _pdmg) {
                                // if remaining shield energy is not enough, projectile is not deflected
                                continue;
                            }
                            
                            // else, we deplete the shield energy to use deflect
                            tank.config.shield -= _pdmg;
                            
                            // calculate point of intersection
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
                    tank.config.maxShield = Math.max(tank.config.maxShield, 0);
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
                vom: true,
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
                
                visualeffects.push(new VisualEffect({name: 'nuke-blast', oX: loc.x, oY: loc.y, width: 256, height: 256, scaleW: 2048, scaleH: 2048, maxCols: 16, maxRows: 14, framesTillUpdate: 0, loop: false, vom: true, spriteSheet: 'ms-exp-4'}));

                new Timer(function () { flash.config.radius = 4500; flash.config.intensity -= 0.2; }, 100);
                new Timer(function () { flash.config.radius = 4000; flash.config.intensity -= 0.2; }, 200);
                new Timer(function () { flash.config.radius = 3500; flash.config.intensity -= 0.2; }, 300);
                new Timer(function () { flash.config.radius = 3000; flash.config.intensity -= 0.05; }, 400);
                new Timer(function () { flash.config.radius = 3000; flash.config.intensity -= 0.05; }, 425);
                new Timer(function () { flash.config.radius = 3000; flash.config.intensity -= 0.05; }, 450);
                new Timer(function () { flash.config.radius = 3000; flash.config.intensity -= 0.05; }, 475);
                new Timer(function () { flash.config.active = false; core.config.active = false; }, 500);
                
                UTIL.dealAreaDamage(loc, 20000, 10000, 800);
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
                    if (typeof tank.tds !== 'undefined') {
                        tank.tds.vfx.end();
                        // remove owned flags
                        for (var i = 0; i < projectiles.length; i++) {
                            if (typeof projectiles[i].flaggedAreaSlow !== 'undefined') {
                                // check if you own the flag, can only remove owned flags
                                if (projectiles[i].flagASId === tank.config.id) {
                                    // restore lost speed then remove flag
                                    projectiles[i].config.speed += projectiles[i].flaggedAreaSlow;
                                    
                                    delete projectiles[i].flaggedAreaSlow;
                                }
                            }
                        }
                        tank.events.unlisten('frame', areaSlow);
                        tank.tds.timeout.clear();
                        delete tank.tds;
                        visualeffects.push(new VisualEffect({name: 'time-dilation-off', oX: tank.config.oX, oY: tank.config.oY, width: 350, height: 350, scaleW: 350, scaleH: 350,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'time-dilation-off'}));
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
                            if (typeof projectiles[i].flaggedAreaSlow !== 'undefined') {
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
                        if (typeof projectiles[i].flaggedAreaSlow === 'undefined') {
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
                        if (typeof projectiles[i].flaggedAreaSlow !== 'undefined') {
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
            tank.config.coins += 500;
            visualeffects.push(new VisualEffect({name: 'coin-burst', oX: tank.config.oX, oY: tank.config.oY, width: 128, height: 128, scaleW: 128, scaleH: 128,  maxCols: 8, maxRows: 3, framesTillUpdate: 0, loop: false, spriteSheet: 'coin-burst-1'}));
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
                        projectile.jumps = 5;
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
                    
                    if (nearest_dist > 400) { return; }
                    
                    // Determine which way to adjust projectile angle.
                    var dX = nearest_tank.config.oX - p.oX;
                    var dY = nearest_tank.config.oY - p.oY;
                    
                    var tanA = Math.atan2(dY, dX) * 180/Math.PI;
                    
                    // retrieve starting point for new jump
                    var newp_coords = UTIL.geometry.getPointAtAngleFrom(p.objectHit.obj.config.oX, p.objectHit.obj.config.oY, tanA, (nearest_tank.config.width/2) + 2);
                
                    // fire new projectile towards new target
                    var speed = typeof projectile.flagASId !== 'undefined' ? p.speed + projectile.flaggedAreaSlow : p.speed; // restore speed caused by area slow (so that generated shrapnel gets flagged correctly)
                    var cProj = new Projectile({mods: projectile.mods, speed: speed, damage: p.damage * 0.80, critChance: p.critChance, angle: tanA, oX: newp_coords[0], oY: newp_coords[1], srcId: p.srcId, srcType: 'chain'});
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
                    if (distance_travelled > explode_distance || (p.objectHit.type !== 'boundary' && p.objectHit.type !== 'none')) {
                        // if projectile has travelled 500 units, split into multiple lesser projectiles with 25% dmg each (5-degree angle offset)
                        var stacks = tank.fw_stacks || 12;
                        var offset = 360 / stacks;
                        var rotate_offset = Math.random() * 360;
                        var speed = typeof projectile.flagASId !== 'undefined' ? p.speed + projectile.flaggedAreaSlow : p.speed; // restore speed caused by area slow (so that generated shrapnel gets flagged correctly)
                        
                        for (var i = 0; i < stacks; i++) {
                            projectiles.push(new Projectile({mods: [], speed: speed, damage: p.damage * 0.25, critChance: p.critChance, angle:  (i * offset) + rotate_offset, oX: p.oX, oY: p.oY, srcId: p.srcId, srcType: 'firework'}));
                        }
                        
                        var scale = Math.floor(Math.random() * 18) + 64;
                        
                        visualeffects.push(new VisualEffect({name: 'fireworks-exp', oX: p.oX, oY: p.oY, width: 256, height: 256, scaleW: scale, scaleH: scale,  maxCols: 8, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'cloud-blast-4'}));
                        
                        // show explosion flash
                        var flash = new Light({
                            name        : 'explosion-flash',
                            oX          : p.oX,
                            oY          : p.oY,
                            radius      : scale,
                            intensity   : 0.3,
                            duration    : 40
                        });

                        lights.push(flash);

                        if (explode_distance > 500) {
                            fireSound.get();
                        }
                        else {
                            explodeSound.get();
                        }
                        
                        projectile.death(); // destroy main projectile
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
                    
                    visualeffects.push(new VisualEffect({name: 'orb_trail', oX: p.oX, oY: p.oY, width: 32, height: 32, scaleW: 8, scaleH: 8,  maxCols: 2, maxRows: 2, framesTillUpdate: 0, loop: false, spriteSheet: 'concussive_glow'}));
                    
                    if (p.objectHit.type === 'tank') {
                        var t = p.objectHit.obj;
                        var tc = t.config;
                        var da = 5; // debuff amount
                        var debuff_active = typeof t.debuff_cs_active !== 'undefined';
                        
                        if (!debuff_active) {
                            // apply base debuff
                            t.debuff_cs_active = true;
                            t.debuff_cs_stacks = 0;
                            
                            if (tc.sSpeed > da && tc.tSpeed > da && tc.fSpeed > da && tc.rSpeed > da) {
                                tc.sSpeed -= da;
                                tc.tSpeed -= da;
                                tc.fSpeed -= da;
                                tc.rSpeed -= da;
                                t.debuff_cs_stacks++;
                            }
                            
                            t.debuff_cs_timeout = new Timer(function () {
                                // restore debuffed stats
                                t.config.sSpeed += da * t.debuff_cs_stacks;
                                t.config.tSpeed += da * t.debuff_cs_stacks;
                                t.config.fSpeed += da * t.debuff_cs_stacks;
                                t.config.rSpeed += da * t.debuff_cs_stacks;
                                
                                delete t.debuff_cs_active;
                                delete t.debuff_cs_stacks;
                                delete t.debuff_cs_timeout;
                            }, 8000);
                        }
                        else {
                            if (tc.sSpeed > da && tc.tSpeed > da && tc.fSpeed > da && tc.rSpeed > da) {
                                tc.sSpeed -= da;
                                tc.tSpeed -= da;
                                tc.fSpeed -= da;
                                tc.rSpeed -= da;
                                t.debuff_cs_stacks++;
                            }
                            
                            t.debuff_cs_timeout.reset();
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
                        if (tank.config.ammo >= 2) {
                            projectiles.push(new Projectile({mods: tank.projectile_mods, speed: tank.config.pSpeed, damage: tank.config.pDamage, critChance: tank.config.critChance, critMultiplier: tank.config.critMultiplier, angle:  tank.config.tAngle - (2 * i), oX: _oX, oY: _oY, srcId: tank.config.id, srcType: tank.config.name}));
                            projectiles.push(new Projectile({mods: tank.projectile_mods, speed: tank.config.pSpeed, damage: tank.config.pDamage, critChance: tank.config.critChance, critMultiplier: tank.config.critMultiplier, angle:  tank.config.tAngle + (2 * i), oX: _oX, oY: _oY, srcId: tank.config.id, srcType: tank.config.name}));
                            tank.config.ammo -= 2;
                        }
                        else {
                            break;
                        }
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

                    var retProj = new Projectile({mods: args.projectile.mods, speed: p.speed * 2, damage: p.damage, critChance: p.critChance, angle: (p.angle + 180) % 360, oX: p.lastPos.x, oY: p.lastPos.y, srcId: tank.config.srcId, objectHit: {type: 'none', obj: null}, srcType: 'ricochet'});
                    projectiles.push(retProj);
                    // show return vfx
                    visualeffects.push(new VisualEffect({name: 'return-wave', oX: p.oX, oY: p.oY, width: 128, height: 128, angle: Math.random() * 360, scaleW: 64, scaleH: 64,  maxCols: 4, maxRows: 3, framesTillUpdate: 0, loop: false, spriteSheet: 'blast-wave-1'}));
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
            
                var incBarrier = function (args) {
                    if (typeof tank.pBarrier === 'undefined') { return; }
                    // Increases the barrier projectile count
                    var angle = UTIL.geometry.getAngleBetweenLineAndHAxis({x: tank.config.oX, y: tank.config.oY}, {x: args.projectile.config.oX, y: args.projectile.config.oY});
                    var tmp = new Projectile({speed: 0, damage: tank.config.pDamage, critChance: tank.config.critChance, angle: angle, oX: tank.config.oX + tank.pb_radius, oY: tank.config.oY, srcId: tank.config.id, srcType: 'projectile-barrier'});
                    projectiles.push(tmp);
                    tank.pBarrier.push([tmp, angle]);
                };
                tank.events.listen('hit', incBarrier);
                
                var updateBarrierSpin = function (args) {
                    if (typeof tank.pBarrier === 'undefined') { return; }
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
                
                var de_pb = function () {
                    if (typeof tank.pBarrier === 'undefined') { return; }
                    // deactivate all projectiles in projectile barrier
                    for (var i = 0; i < tank.pBarrier.length; i++) {
                        tank.pBarrier[i][0].death();
                    }
                    
                    tank.events.unlisten('hit', incBarrier);
                    tank.events.unlisten('frame', updateBarrierSpin);
                    delete tank.pBarrier; // remove temp variable
                    delete tank.pb_radius;
                    delete tank.pb_timeout;
                    delete tank.pb_active;
                };
                tank.events.listen('death', de_pb);
                
                tank.pb_timeout = new Timer(function () {    
                    de_pb();
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
                tank.config.accel += 50;
                tank.config.decel += 50;
                
                tank.h_active = true;
                tank.h_stacks = 1;
                
                tank.h_timeout = new Timer(function () {
                    tank.config.fSpeed -= 100 * tank.h_stacks;
                    tank.config.rSpeed -= 100 * tank.h_stacks;
                    tank.config.tSpeed -= 40 * tank.h_stacks;
                    tank.config.sSpeed -= 20 * tank.h_stacks;
                    tank.config.accel -= 50 * tank.h_stacks;
                    tank.config.decel -= 50 * tank.h_stacks;
                    
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
                tank.config.accel += 50;
                tank.config.decel += 50;
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
        /* increases the damage */
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
        /* renders tank invulnerable until it gets hit by a set amount of projectiles */
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
                tank.hitsTaken = 0;
                tank.maxHits = 36; // base max hits taken
                tank.as_break = function () {
                    // fire the number of absorbed projectiles in all directions
                    var cAngle = 0;
                    var x = 0;
                    var y = 0;
                    
                    var fireTrailFX = function (projectile) {
                        visualeffects.push(new VisualEffect({name: 'explosion', oX: projectile.config.oX, oY: projectile.config.oY, width: 32, height: 32, scaleW: 12, scaleH: 12,  maxCols: 4, maxRows: 4, framesTillUpdate: 0, loop: false, spriteSheet: 'explosion'}));
                    }
                    
                    var _dmg = tank.config.pDamage + (tank.config.pDamage * tank.hitsTaken / 36);
                    var _ps = Math.max(tank.config.pSpeed, Math.max(tank.config.fSpeed, tank.config.rSpeed));
                    
                    for (var i = 0; i < 36; i++) {
                        // determine starting coordinates of projectile based on vector info
                        x = tank.config.oX + (Math.cos(cAngle * Math.PI/180) * (tank.config.cRadius+20));
                        y = tank.config.oY + (Math.sin(cAngle * Math.PI/180) * (tank.config.cRadius+20));
                        
                        // create new projectile
                        var proj = new Projectile({ speed: _ps, damage: _dmg, critChance: tank.config.critChance, angle:  cAngle, oX: x, oY: y, srcId: tank.config.id, srcType: 'blast'});
                        proj.mods.push(fireTrailFX);
                        
                        // add projectile to array
                        projectiles.push(proj);
                        
                        // set cAngle
                        cAngle += 10;
                    }
                    
                    tank.config.invulnerable--;
                    tank.as_vfx.end();
                    
                    tank.events.unlisten('hit', absorbHit);
                    tank.events.unlisten('frame', asAnim);
                    d_explodeSound.get(); // play explode sound
                    tank.as_timeout.clear();
                    
                    delete tank.maxHits;
                    delete tank.hitsTaken; // remove temp variable
                    delete tank.as_active;
                    delete tank.as_vfx;
                    delete tank.as_break;
                    delete tank.as_timeout;
                };
                
                tank.as_vfx = new VisualEffect({name: 'aphotic_shield', oX: tank.config.oX, oY: tank.config.oY, width: 256, height: 256, scaleW: tank.config.tSize * 2, scaleH: tank.config.tSize * 2, maxCols: 8, maxRows: 4, framesTillUpdate: 0, loop: true, spriteSheet: 'shalo-2'});
                visualeffects.push(tank.as_vfx);
                tank.config.invulnerable++;
                
                var absorbHit = function () {
                    // keep count of hits taken
                    tank.hitsTaken += 1;
                    
                    if (tank.hitsTaken >= tank.maxHits) {
                        // break barrier
                        tank.as_break();
                    }
                };
                tank.events.listen('hit', absorbHit);
                
                var asAnim = function () {
                    // update animation position
                    tank.as_vfx.updatePos(tank.config.oX, tank.config.oY);
                };
                tank.events.listen('frame', asAnim);
                
                tank.as_timeout = new Timer(function () {
                    if (tank.as_break) {
                        tank.as_break();
                    }
                }, 6000);
            }
            else {
                tank.maxHits += 12;
                tank.as_timeout.extend(3000);
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
                tank.regen.rate = tank.config.maxHealth * 0.001 * tank.regen.stacks; // 10% per second

                tank.regen.interval = new Interval(function () {
                    tank.config.health = tank.config.maxHealth - tank.config.health < tank.regen.rate ? tank.config.maxHealth : tank.config.health + tank.regen.rate;
                    tank.config.health = Math.min(tank.config.health, tank.config.maxHealth);
                    renderExtern();
                    if (tank.config.health >= tank.config.maxHealth) {
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