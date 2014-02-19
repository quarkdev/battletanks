/* Module: BLUEPRINT */

var BLUEPRINT = (function () {
    "use strict";
    var my = {},
        library = [];

    my.add = function (data) {
        // Add new blueprint. Form: {identifier: 'value', ...} Must contain a 'name' identifier.
        library.push(data);
    };
    my.get = function (name) {
        // Try to retrieve blueprint. If found, return it
        for (var i = 0; i < library.length; i++) {
            if (library[i].name === name) {
                return library[i];
            }
        }
    };

    return my;
}());

BLUEPRINT.add({
    name     : 'm4_sherman',           // tank name
    type     : 'medium',               // tanks type (light/medium/heavy/destroyer/howitzer)
    bImage   : 'm4_sherman_chassis',   // chassis image
    tImage   : 'm4_sherman_turret',    // turret image
    health   : 25.0,                   // tank health
    armor    : 20.0,                   // tank armor
    bSize    : 32.0,                   // tank body Size (in px, must be square)
    tSize    : 46.0,                   // tank turret Size (in px, must be square)
    sSpeed   : 150.0,                  // chassis turn speed
    width    : 32.0,                   // chassis width 
    height   : 32.0,                   // chassis height
    tWidth   : 52.0,                   // turret width
    tHeight  : 52.0,                   // turret height
    tSpeed   : 120.0,                  // turret turn Speed (in degrees / sec)
    fSpeed   : 200.0,                  // tank forward Speed (in pixels / sec)
    rSpeed   : 180.0,                  // tank reverse Speed
    accel    : 1.0,                    // acceleration
    pSpeed   : 520.0,                  // Projectile speed
    pDamage  : 52.5,                   // Projectile damage
    ammo     : 98.0,                   // ammunition
    fRate    : 2.0,                    // Firing rate
    hAngle   : 90.0,                   // tank head angle (the direction it is currently facing)
    tAngle   : 45.0                   // tank turret angle (the direction the turret is facing)
});

BLUEPRINT.add({
    name     : 'm4_sherman_blue',           // tank name
    type     : 'medium',               // tanks type (light/medium/heavy/destroyer/howitzer)
    bImage   : 'm4_sherman_chassis_blue',   // chassis image
    tImage   : 'm4_sherman_turret_blue',    // turret image
    health   : 25.0,                   // tank health
    armor    : 20.0,                   // tank armor
    bSize    : 32.0,                   // tank body Size (in px, must be square)
    tSize    : 46.0,                   // tank turret Size (in px, must be square)
    sSpeed   : 150.0,                  // chassis turn speed
    width    : 32.0,                   // chassis width 
    height   : 32.0,                   // chassis height
    tWidth   : 52.0,                   // turret width
    tHeight  : 52.0,                   // turret height
    tSpeed   : 120.0,                  // turret turn Speed (in degrees / sec)
    fSpeed   : 200.0,                  // tank forward Speed (in pixels / sec)
    rSpeed   : 180.0,                  // tank reverse Speed
    accel    : 1.0,                    // acceleration
    pSpeed   : 520.0,                  // Projectile speed
    pDamage  : 52.5,                   // Projectile damage
    ammo     : 98.0,                   // ammunition
    fRate    : 2.0,                    // Firing rate
    hAngle   : 90.0,                   // tank head angle (the direction it is currently facing)
    tAngle   : 45.0                  // tank turret angle (the direction the turret is facing)
});

BLUEPRINT.add({
    name     : 'jagdpanther',          // tank name
    type     : 'destroyer',            // tanks type (light/medium/heavy/destroyer/howitzer)
    bImage   : 'jagdpanther_chassis',  // chassis image
    tImage   : 'jagdpanther_turret',   // turret image
    health   : 50.0,                   // tank health
    armor    : 50.0,                   // tank armor
    bSize    : 32.0,                   // tank body Size (in px, must be square)
    tSize    : 46.0,                   // tank turret Size (in px, must be square)
    sSpeed   : 80.0,
    width    : 32.0,
    height   : 32.0,
    tWidth   : 52.0,
    tHeight  : 52.0,
    tSpeed   : 0.0,                    // turret turn Speed (in degrees / sec)
    fSpeed   : 120.0,                  // tank forward Speed (in pixels / sec)
    rSpeed   : 100.0,                  // tank reverse Speed
    accel    : 0.85,                   // acceleration
    pSpeed   : 860.0,                  // Projectile speed
    pDamage  : 150.0,                  // Projectile damage
    ammo     : 50.0,
    fRate    : 1.0,                    // Firing rate
    hAngle   : 90.0,                   // tank head angle (the direction it is currently facing)
    tAngle   : 90.0                   // tank turret angle (the direction the turret is facing)
});

BLUEPRINT.add({
    name     : 'brick_explosive',
    nImage   : 'brick_explosive',      // object normal image file
    dImage   : 'brick_explosive',      // damaged image file
    size     : 32,                     // object size
    health   : 25,                     // hitpoints
    armor    : 12,                     // armor
    mod      : 'explosive'             // special modifier, can be: (immortal, rubber, explosive, etc)
});

BLUEPRINT.add({
    name     : 'wall_rubber',
    nImage   : 'wall_rubber',          // object normal image file
    dImage   : 'wall_rubber',          // damaged image file
    size     : 32,                     // object size
    health   : 25,                     // hitpoints
    armor    : 12,                     // armor
    mod      : 'rubber'                // special modifier, can be: (immortal, rubber, explosive, etc)
});

BLUEPRINT.add({
    name     : 'heavy_rubber',
    nImage   : 'heavy_rubber',         // object normal image file
    dImage   : 'heavy_rubber',         // damaged image file
    size     : 32,                     // object size
    health   : 100,                    // hitpoints
    armor    : 12,                     // armor
    mod      : 'rubber'                // special modifier, can be: (immortal, rubber, explosive, etc)
});

BLUEPRINT.add({
    name     : 'concrete',
    nImage   : 'concrete',             // object normal image file
    dImage   : 'concrete',             // damaged image file
    size     : 32,                     // object size
    health   : 35,                     // hitpoints
    armor    : 20,                     // armor
    mod      : 'normal'                // special modifier, can be: (immortal, rubber, explosive, etc) 
});

BLUEPRINT.add({
    name     : 'riveted_iron',
    nImage   : 'riveted_iron',         // object normal image file
    dImage   : 'riveted_iron',         // damaged image file
    size     : 32,                     // object size
    health   : 50,                     // hitpoints
    armor    : 50,                     // armor
    mod      : 'normal'                // special modifier, can be: (immortal, rubber, explosive, etc) 
});