/*
* Module: STAT
*
* Tracks game/level statistics
*/
var STAT = (function () {
    var my = {};
    
    var statistics = []; // [fieldname, value]
    
    my.add = function (name) {
        /* Add new field. */
        // Check if field already exists
        var exists = false;
        
        for (var i = 0; i < statistics.length; i++) {
            if (statistics[i][0] === name) {
                exists = true;
                break;
            }
        }
        
        if (!exists) {
            // if it's not already in the stat pool, add it
            statistics.push([name, 0]);
        }
        
    };
    
    my.inc = function (name, value) {
        /* Increment value of matching field. */
        for (var i = 0; i < statistics.length; i++) {
            if (statistics[i][0] === name) {
                statistics[i][1] += value; 
            }
        }
    };
    
    my.dec = function (name, value) {
        /* Decrement value of matching field. */
        for (var i = 0; i < statistics.length; i++) {
            if (statistics[i][0] === name) {
                statistics[i][1] -= value; 
            }
        }
    };
    
    my.update = function (name, value) {
        /* Update value of matching field. */
        for (var i = 0; i < statistics.length; i++) {
            if (statistics[i][0] === name) {
                statistics[i][1] = value; 
            }
        }
    };
    
    my.reset = function () {
        /* Reset the values of all fields. */
        for (var i = 0; i < statistics.length; i++) {
            statistics[i][1] = 0; 
        }
    };
    
    my.get = function (name) {
        /* Retrieves the value of the matching field. */
        for (var i = 0; i < statistics.length; i++) {
            if (statistics[i][0] === name) {
                return statistics[i][1]; 
            }
        }
    };
    
    return my;
}());