/*
* Object: STAT
*
* Tracks game/level statistics
*/
function STAT() {

    this.statistics = []; // [fieldname, value]
    
    this.add = function (name) {
        /* Add new field. */
        // Check if field already exists
        var exists = false;
        
        for (var i = 0; i < this.statistics.length; i++) {
            if (this.statistics[i][0] === name) {
                exists = true;
                break;
            }
        }
        
        if (!exists) {
            // if it's not already in the stat pool, add it
            this.statistics.push([name, 0]);
        }
        
    };
    
    this.inc = function (name, value) {
        /* Increment value of matching field. */
        for (var i = 0; i < this.statistics.length; i++) {
            if (this.statistics[i][0] === name) {
                this.statistics[i][1] += value; 
            }
        }
    };
    
    this.dec = function (name, value) {
        /* Decrement value of matching field. */
        for (var i = 0; i < this.statistics.length; i++) {
            if (this.statistics[i][0] === name) {
                this.statistics[i][1] -= value; 
            }
        }
    };
    
    this.update = function (name, value) {
        /* Update value of matching field. */
        for (var i = 0; i < this.statistics.length; i++) {
            if (this.statistics[i][0] === name) {
                this.statistics[i][1] = value; 
            }
        }
    };
    
    this.reset = function () {
        /* Reset the values of all fields. */
        for (var i = 0; i < this.statistics.length; i++) {
            this.statistics[i][1] = 0; 
        }
    };
    
    this.get = function (name) {
        /* Retrieves the value of the matching field. */
        for (var i = 0; i < this.statistics.length; i++) {
            if (this.statistics[i][0] === name) {
                return this.statistics[i][1]; 
            }
        }
    };
    
};