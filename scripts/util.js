/*
* Module : UTIL
*
* Hosts most of the common utility functions used by Battletanks
*/
var UTIL = (function () {
    var my = {};
    
    my.toTitleCase = function (str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
    
    /*
    * Private Method: _idInArray
    *
    * Checks if id is found in array
    *
    * Parameters:
    *   array - the array to be checked
    *   id    - value to compare to
    *
    * Returns:
    *   a boolean true if id is found in array, else a boolean false
    */
    var _idInArray = function (array, id) {
        // Check if id exists in array.
        for (var i = 0; i < array.length; i++) {
            if (array[i].id == id) {
                return true;
            }
        }
        
        return false;
    };
    
    /*
    * Public Method: getMousePos
    *
    * Retreives the current mouse coordinates within an element
    *
    * Parameters:
    *   element - the element
    *   evt     - the event
    *
    * Returns:
    *   an object with the following properties: mX, mY (which are the mouse coordinates)
    */
    my.getMousePos = function (element, evt) {
        var rect = element.getBoundingClientRect();
        return {
            mX: evt.clientX - rect.left,
            mY: (evt.clientY - rect.bottom) * (-1) // multiply by -1 since the plane is inversed vertically
        };
    };
    
    /*
    * Public Method: genArrayId
    *
    * Generates a unique id for an array element
    *
    * Parameters:
    *   array - the array
    *
    * Returns:
    *   a unique alphanumeric string
    */
    my.genArrayId = function (array) {
        var id = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
        do {
            for( var i=0; i < 5; i++ )
                id += possible.charAt(Math.floor(Math.random() * possible.length));
        } while (_idInArray(array, id));
        
        return id;
    };
    
    /*
    * Public Method: writeToLog
    *
    * Appends a string/message to the combat log, increments logNum (used for auto-scrolling)
    *
    * Parameters:
    *   message - the string to append
    */
    my.writeToLog = function (message) {
        if (!LOG_ENABLED) { return; }
        cLog.innerHTML = cLog.innerHTML + message + '<br>';
        cLog.scrollTop = document.getElementById('log-' + logNum).offsetTop;
        logNum++;
    };

    my.stopMusic = function (music) {
        music.pause();
        music.currentTime = 0;
    };
    
    my.pauseMusic = function (music) {
        music.pause();
    };
    
    my.playMusic = function (music) {
        if (music.readyState === 4) {
            music.play();
        }
    };
    
    my.getBotReference = function (id) {
        /* Return the reference to the bot matching the id from bots */
        for (var i = 0; i < bots.length; i++) {
            if (bots[i][0].config.id === id) {
                return bots[i];
            }
        }
    };
    
    my.levelCleared = function () {
        /* Check if all enemy tanks have been destroyed. */
        if (!GLOBALS.flags.initSpawn) {
            // if initial spawn hasn't started...
            return false;
        }
        
        for (var i = 0; i < bots.length; i++) {
            if (bots[i][0].config.active) {
                return false;
            }
        }
        
        return true;
    };
    
    my.post = function (url, data, callbackSuccess, callbackFailed) {
        /* POST request as JSON */
        var req = new XMLHttpRequest();
        
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if (req.status == 200 && req.status < 300) {
                    // process server response here
                    if (req.responseText !== 'ok') {
                        console.log(req.responseText);
                        callbackFailed();
                    }
                    else {
                        callbackSuccess();
                    }
                }
            }
        };
        
        req.open('POST', url);
        
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        req.send(data);
    };
    
    my.get = function (url, callbackSuccess, callbackFailed) {
        /* GET request */
            var req = new XMLHttpRequest();
            req.open('GET', url);
            
            req.onload = function () {
                if (req.status == 200) {
                    callbackSuccess(req.response);
                    //return req.response;
                }
                else {
                    callbackFailed();
                }
            };
            
            req.onerror = function () {
                callbackFailed();
            };
            
            req.send();
    };
    
    my.getPromise = function (url) {
        /* GET request using Promise. */
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);
            
            req.onload = function () {
                if (req.status == 200) {
                    resolve(req.response);
                }
                else {
                    reject(Error(req.statusText));
                }
            };
            
            req.onerror = function () {
                reject(Error('Network Error'));
            };
            
            req.send();
        });
    };
    
    my.fancyProgress = function (pseudoInc, callback) {
        /* Show a fake progress bar to annoy (or entertain?) the player. */
        STAT.reset();
        
        var fancyTalk = [
            'Playing Flappy Birds...',
            'Loading Workers...',
            'Loading Assets...',
            'Walking the dog...',
            'Walking the dog some more...',
            'Walking the human...',
            '<span style="color: orange;">Dendimon</span> has randomed Goblin Techies',
            'Nyx Nyx Nyx Nyx Nyx',
            'Let it go...',
            'Preparing the battlefield...',
            '<span style="font-family: \'Comic Sans\', \'Comic Sans MS\'; color: yellow">So doge</span>',
            '<span style="font-family: \'Comic Sans\', \'Comic Sans MS\'; color: pink">WOW</span>',
            '<span style="font-family: \'Comic Sans\', \'Comic Sans MS\'; color: purple">so progress</span>',
            '<span style="font-family: \'Comic Sans\', \'Comic Sans MS\'; color: green">such random</span>',
            'The <span style="color: orange">Cake</span> was a lie!'
        ];
        
        // Delay start to allow objects and workers to be initialized completely.
        progressBar.value = 0;
        progressText.innerHTML = 'Loading Game Objects... Please Wait...';
        var fti = 0, ftLen = fancyTalk.length, millisecSince = 0, msMin = 1100, msMax = 5000, gsc = 4;
        
        $('#progress').show();
        var preGameDelay = setInterval(function () {
            progressBar.value += pseudoInc + (Math.random() * 5);
            
            if (millisecSince > Math.floor(Math.random() * msMax) + msMin) {
                fti = Math.floor(Math.random() * ftLen);
                progressText.innerHTML = fancyTalk[fti];
                millisecSince = 0;
            }
            millisecSince += 50;
            
            if (progressBar.value === 100) {
                var gameStartCount = setInterval(function () {
                    progressText.innerHTML = 'Game starting in ' + (gsc - 1) + '...';
                    gsc--;
                    if (gsc === 1) {
                        setTimeout(function() {
                            callback();
                        }, 1000);
                        clearInterval(gameStartCount);
                    }
                }, 1000);
                clearInterval(preGameDelay);
            }
        }, 50);
    };
    
    my.pauseTimers = function () {
        for (var i = 0; i < timers.length; i++) {
            timers[i].pause();
        }
    };
    
    my.resumeTimers = function () {
        /* Resume all timers. */
        for (var i = 0; i < timers.length; i++) {
            timers[i].resume();
        }
    };
    
    my.killTimers = function () {
        /* Kill all running timers in the timers array. */
        for (var i = 0; i < timers.length; i++) {
            timers[i].clear();
        }
        
        timers.length = 0;
    };
    
    my.cleanTimers = function () {
        /* Remove all inactive timers in timers array. */
        timers = timers.filter(function (item) {
            return !item.isExpired();
        });
    };
    
    my.toggleMiniMap = function () {
        /* Toggles minimap visibility. */
        var minimap = document.getElementById('minimap');
        var minimap_bg = document.getElementById('minimap-bg');
        
        if (minimap.style.visibility === 'hidden') {
            minimap.style.visibility = 'visible';
            minimap_bg.style.visibility = 'visible';
        }
        else {
            minimap.style.visibility = 'hidden';
            minimap_bg.style.visibility = 'hidden';
        }
    };
    
    my.packDestructibles = function () {
        /* Save the active destructibles into a simple [x, y, size] array for the pathfinders. */
        var packedDestructibles = [];
        for (var i = 0; i < destructibles.length; i++) {
            if (destructibles[i].config.active) {
                packedDestructibles.push([
                    destructibles[i].config.name,
                    destructibles[i].config.oX,
                    destructibles[i].config.oY,
                    destructibles[i].config.size
                ]);
            }
        }
        
        return packedDestructibles;
    };
    
    my.getNearestEnemyTank = function (x, y, exceptions) {
        /* Get the nearest enemy tank to point. */
        
        if (tanks.length === 1) {
            // there's no enemy tank, so return -1
            return -1;
        }
        else if (tanks.length === 2) {
            // there's only 1 enemy tank, nothing else to compare to
            if (tanks[1].config.active) {
                return tanks[1];
            }
            else {
                return -1;
            }
        }
        
        var dist = 0;
        var _dist = 0;
        var nearest_tank = -1;
        
        for (var i = 1; i < tanks.length; i++) {
            if (!tanks[i].config.active) { continue; } // skip dead tanks
            
            // check if item is found in exceptions
            if (typeof exceptions !== 'undefined') {
                if (exceptions.indexOf(tanks[i].config.id) > -1) {
                    continue;
                }
            }
            
            _dist = UTIL.geometry.getDistanceBetweenPoints({x: x, y: y}, {x: tanks[i].config.oX, y: tanks[i].config.oY});
            
            if (_dist < dist) {
                // if this is nearer than the last, save it
                dist = _dist;
                nearest_tank = tanks[i];
            }
            else if (dist === 0) {
                dist = _dist;
                nearest_tank = tanks[i];
            }
        }
        
        return nearest_tank;
    };
        
    return my;
}());

/*
* Module : UTIL
* Sub-module: Geometry
*
* A UTIL sub-module that handles geometry calculations
*/
UTIL.geometry = (function() {
    var my = {};
    
    /*  
    * Private Object: Point
    *
    * A UTIL.geometry point constructor
    *
    * Parameters:
    *   X - the x coordinate of the point
    *   Y - the Y coordinate of the point
    *
    * Note:
    *   All parameters default to null
    */
    var Point = function (x, y) {
        return {
            x: typeof x === "undefined" ? null : x,
            y: typeof y === "undefined" ? null : y
        };
    };

    /*  
    * Private Object: Line
    *
    * A UTIL.geometry point constructor
    *
    * Parameters:
    *   A - a Point object
    *   B - a Point object
    *
    * Note:
    *   all parameters default to null
    */
    var Line = function (A, B) {
        return {
            A: {
                x: typeof A.x === "undefined" ? null : A.x,
                y: typeof A.y === "undefined" ? null : A.y
            },
            B: {
                x: typeof B.x === "undefined" ? null : B.x,
                y: typeof B.y === "undefined" ? null : B.y
            }
        };
    };

    /*
    * Public Method: pointLiesInsidePointSquare
    *
    * Checks if a point is inside a square defined by the length of its side and a single central point
    *
    * Parameters:
    *   P  - coordinates of the point of the form: [x, y]
    *   Ps - coordinates of the central point of the square of the form: [x, y]
    *   w  - the width or length of one side of the square
    *
    * Returns:
    *   a boolean true if point lies inside, else a boolean false
    */
    my.pointLiesInsidePointSquare = function (P, Ps, w) {
        var _w = w;

        if (P[0] < Ps[0] + _w &&
            P[0] > Ps[0] - _w &&
            P[1] < Ps[1] + _w &&
            P[1] > Ps[1] - _w) {
            return true;
        }
        
        return false;
    };

    /*
    * Public Method: pointInsideRectangle
    * 
    * Checks if a point is inside a rotated or unrotated rectangle
    *
    * Parameters:
    *   rect - the rectangle object which has the following properties: w (width), h (height), a (angle), x and y
    *   P    - the point object which has the following properties: x and y
    *
    * Returns:
    *   a boolean true if point lies inside, else a boolean false
    */
    my.pointInsideRectangle = function (rect, P) {
        var c         = Math.cos(-rect.a*Math.PI/180);
        var s         = Math.sin(-rect.a*Math.PI/180);
        
        // UNrotate the point depending on the rotation of the rectangle.
        var rotatedX  = rect.x + c * (P.x - rect.x) - s * (P.y - rect.y);
        var rotatedY  = rect.y + s * (P.x - rect.x) + c * (P.y - rect.y);
        
        // Perform a normal check if the new point is inside the bounds of the UNrotated rectangle.
        var leftX     = rect.x - rect.w / 2;
        var rightX    = rect.x + rect.w / 2;
        var topY      = rect.y - rect.h / 2;
        var bottomY   = rect.y + rect.h / 2;
        
        return leftX <= rotatedX && rotatedX <= rightX && topY <= rotatedY && rotatedY <= bottomY;
    };
    
    /*
    * Public Method: lineAxPaSquareIntersect
    *
    * Checks if line intersects a square
    * 
    * Parameters:
    *   square - an object which contains the properties: s, x, and y;
    *               where:
    *                   s - is the length of one side
    *                   x - is the x coordinate of the line's center
    *                   y - is the y cooridnate of the line's center
    *   line   - an object which contains the properties: Ax, Ay, Bx, and By
    *               where:
    *                   Ax - is the x coordinate of the line's point A
    *                   Ay - is the y coordinate of the line's point A
    *                   Bx - is the x coordinate of the line's point B
    *                   By - is the y coordinate of the line's point B
    *
    * Returns:
    *   an object which contains the properties:
    *       yes       - a boolean true if an intersection is found, else a boolean false
    *       sideIndex - an integer representing the side of impact
    *       poi       - an object representing the point of impact                
    */
    my.lineAxPaSquareIntersect = function (square, line) {    
        // First retrieve the four line segments that compose the square.
        var lines = _getLineSegmentsFromSquare(square.s, square.x, square.y),
            lastPoint = new Point(line.Bx, line.By),
            currPoint = new Point(line.Ax, line.Ay),
            incidentLine = new Line(lastPoint, currPoint),
            nearest_line, // line first intersected (if projectile path intersected more than 1 line)
            nearest_dist, // distance from PoI to last point (line.Bx, line.By)
            nearest_poi;
            
        /* Validate possible sides of impact. The following are rules of validity:
           top    : lastPoint.y > lines[0].A.y,
           bottom : lastPoint.y < lines[2].A.y,
           left   : lastPoint.x < lines[3].A.x,
           right  : lastPoint.x > lines[1].A.x
        */
        
        var poi, dist, side, valid;
        
        // Check each line segment if it intersects with the other line segment.
        for (var i = 0; i < lines.length; i++) {
            
            if (_linesIntersect(new Point(line.Ax, line.Ay), new Point(line.Bx, line.By), new Point(lines[i].A.x, lines[i].A.y), new Point(lines[i].B.x, lines[i].B.y))) {
                // If it intersects, get PoI, compare it with the nearest_line (if !null) otherwise save it.
                poi = _getPofIntLines(lines[i], incidentLine);
                dist = _getDistanceBetweenPoints(lastPoint, poi);

                if (nearest_line) {
                    // Compare distance.
                    if (dist < nearest_dist) {
                        // Apply rules of validity.
                        
                        switch (i) {
                            case 0:
                                valid = lastPoint.y > lines[0].A.y;
                                break;
                            case 2:
                                valid = lastPoint.y < lines[2].A.y;
                                break;
                            case 3:
                                valid = lastPoint.x < lines[3].A.x;
                                break;
                            case 1:
                                valid = lastPoint.x > lines[1].A.x;
                                break;
                        }
                        
                        if (valid) {
                            nearest_dist = dist;
                            nearest_line = lines[i];
                            nearest_poi = poi;
                            side = i;
                        }
                    }
                }
                else {
                    nearest_line = lines[i];
                    nearest_dist = dist;
                    nearest_poi = poi;
                    side = i;
                }
            }
        }
        // Loop done, return object.
        
        if (nearest_line) {
            return { yes: true, sideIndex: side, PoI: poi };
        }
        else {
            return { yes: false, sideIndex: null, PoI: null };
        }
    };
    
    /*
    * Public Method: getPofIntLines
    *
    * Finds the point of intersection of two lines
    *
    * Parameters:
    *   A, B - points representing the first line
    *   C, D - points representing the second line
    *
    * Returns:
    *   the result of a call to the private method: _getPofIntLines
    */
    my.getPofIntLines = function(A, B, C, D) {
        return _getPofIntLines(new Line(A, B), new Line(C, D));
    };
    
    /*
    * Public Method: getDistanceBetweenPoints
    *
    * Finds the distance between two points
    *
    * Parameters:
    *   A, B - the two points
    *
    * Returns:
    *   the result of a call to a private method: _getDistanceBetweenPoints
    */
    my.getDistanceBetweenPoints = function(A, B) {
        return _getDistanceBetweenPoints(A, B);
    };
    
    my.getPointAtAngleFrom = function (x, y, angle, dist) {
        /* Returns the point at dist distance from the point (x, y) at angle angle. */
        var _y = y + (dist * Math.sin(angle*Math.PI/180));
        var _x = x + (dist * Math.cos(angle*Math.PI/180));
        
        return [_x, _y];
    };
    
    /*
    * Private Method: _getDistanceBetweenPoints
    *
    * Finds the distance between two points
    *
    * Parameters:
    *   A, B - the two points
    *
    * Returns:
    *   a floating point value, the distance
    */
    var _getDistanceBetweenPoints = function(A, B) {   
        return Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2));
    };
    
    /*
    * Private Method: _getPofIntLines
    *
    * Finds the point of intersection of two lines
    *
    * Parameters:
    *   lineA, lineB - Line objects
    *
    * Returns:
    *   an object which contains the properties:
    *       x, y - the x and y coordinates of the point of intersection
    */
    var _getPofIntLines = function (lineA, lineB) {
        /* Returns the point of intersection of two lines in the form: {x: _, y: _} parameters are Line objects. */
        
        var mA, mB, X, Y,
            xA = lineA.A.x,
            yA = lineA.A.y,
            xB = lineB.A.x,
            yB = lineB.A.y;
        
        // Check if any of the lines are vertical. Since the slope of a vertical line is undefined (special case fix)
        if (lineA.A.x === lineA.B.x) {
        
            // X is the same for both lines.
            X = lineA.A.x;
            
            // Get slope of lineB.
            mB = _getSlopeOfLine(lineB);
            
            // Solve for Y.
            Y = mB * (X - xB) + yB;
        }
        else if (lineB.A.x === lineB.B.x) {
        
            // X is the same for both lines.
            X = lineB.A.x;
            
            // Get slope of lineB.
            mA = _getSlopeOfLine(lineA);
            
            // Solve for Y.
            Y = mA * (X - xA) + yA;
        }
        else {
        
            // Get slope of lineA.
            mA = _getSlopeOfLine(lineA);
            
            // Get slope of lineB.
            mB = _getSlopeOfLine(lineB);
            
            // Solve for X via the point-slope formula.
            X = ((mA * xA) - yA - (mB * xB) + yB) / (mA - mB);
            
            // Solve for Y via the point-slope formula of one of the lines.
            Y = mA * (X - xA) + yA;
        }
        
        return {x: X, y: Y};
    };
    
    /*
    * Private Method: _linesIntersect
    *
    * Checks if two lines each defined by two points intersect
    *
    * Parameters:
    *   A, B - points belonging to the first line
    *   C, D - points belonging to the second line
    *
    * Returns:
    *   a boolean true if they intersect, else a boolean false
    */
    var _linesIntersect = function (A, B, C, D) {
        var CmP = new Point(C.x - A.x, C.y - A.y);
        var r   = new Point(B.x - A.x, B.y - A.y);
        var s   = new Point(D.x - C.x, D.y - C.y);
        
        var CmPxr = (CmP.x * r.y - CmP.y * r.x) * 1.0;
        var CmPxs = (CmP.x * s.y - CmP.y * s.x) * 1.0;
        var rxs   = (r.x * s.y - r.y * s.x) * 1.0;
        
        if (CmPxr === 0) {
            // Lines are collinear, and so intersect if they have any overlap.
            
            return ((C.x - A.x < 0) != (C.x - B.x < 0)) || ((C.y - A.y < 0) != (C.y - B.y < 0));
        }
        
        if (rxs === 0) {
            return false; // Lines are parallel.
        }
        
        var rxsr = 1.0 / rxs;
        var t = CmPxs * rxsr;
        var u = CmPxr * rxsr;
        
        return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
    };
    
    /*
    * Private Method: _getLineSegmentsFromSquare
    *
    * Retrieves the outer line segments defining a square
    *
    * Parameters:
    *   side - length of the square's side
    *   x, y - coordinates of the square's center point
    *
    * Returns:
    *   an array of lines following the format: [Top, Right, Bottom, Left]
    */
    var _getLineSegmentsFromSquare = function (side, x, y) {
        var hs = side/2.0;
        
        var pTL = new Point(x - hs, y + hs), // Top left.
            pTR = new Point(x + hs, y + hs), // Top right.
            pBR = new Point(x + hs, y - hs), // Bottom right.
            pBL = new Point(x - hs, y - hs); // Bottom left.
            
        return [new Line(pTL, pTR), new Line(pTR, pBR), new Line(pBL, pBR), new Line(pTL, pBL)];
    };
    
    var _getSlopeOfLine = function(line) {
        /* Returns the slope of the line. Takes a line parameter. */
        
        return (line.A.y - line.B.y) / (line.A.x - line.B.x);
    };
    
    return my;
}());

UTIL.gui = (function () {
    var my = {};
    
    my.selectMap = function (dir) {
        /* Select next/prev maps. */
        var map = GLOBALS.map;
        var map_name = document.getElementById('ms-name');
        var map_desc = document.getElementById('ms-desc');
        
        switch (dir) {
            case 'next':
                map.index = map.index === maps.length - 1 ? 0 : map.index + 1;
                break;
            case 'prev':
                map.index = map.index === 0 ? maps.length - 1 : map.index - 1;
                break;
            default:
                break;
        }
        
        map.current = maps[map.index];
        
        map_name.innerHTML = map.current.name;
        map_desc.innerHTML = map.current.desc;
    };
    
    my.updateTankStats = function (dir) {
        /* Update the tank selection stats. */
        
        /*
        * Max values for stat comparison:
        *   firepower - 2000
        *   armor     - 500
        *   mobility  - 400
        *   size      - 100
        */
        
        var ts = GLOBALS.tankSelection;
        
        if (dir === 'next') {
            ts.selectedIndex = ts.selectedIndex !== ts.blueprints.length-1 ? ts.selectedIndex + 1 : 0;
        }
        else if (dir === 'prev') {
            ts.selectedIndex = ts.selectedIndex !== 0 ? ts.selectedIndex - 1 : ts.blueprints.length-1;
        }
        
        var firepower = ts.blueprints[ts.selectedIndex].pDamage,
            firing_rate = ts.blueprints[ts.selectedIndex].fRate,
            armor = ts.blueprints[ts.selectedIndex].armor,
            mobility = ts.blueprints[ts.selectedIndex].fSpeed,
            name = UTIL.toTitleCase((ts.blueprints[ts.selectedIndex].name).split('_').join(' ')),
            chassis_img_url = TankImages.get(ts.blueprints[ts.selectedIndex].bImage).src,
            turret_img_url = TankImages.get(ts.blueprints[ts.selectedIndex].tImage).src;
       
        var bar_cap = 420; // the ui bar max width
        
        $('#ts-firepower').animate({
            width: (firepower / 2000) * bar_cap
        });
        $('#ts-armor').animate({
            width: (armor / 500) * bar_cap
        });
        $('#ts-mobility').animate({
            width: (mobility / 400) * bar_cap
        });
        $('#ts-firingrate').animate({
            width: (firing_rate / 12) * bar_cap
        });
        $('#tank-name').html(name);
        $('#tank-chassis-img').css('backgroundImage', 'url(' + chassis_img_url + ')');
        $('#tank-turret-img').css('backgroundImage', 'url(' + turret_img_url + ')');
    };
    
    my.makeSelectOpts = function (arrayOfObjects, prop) {
        /* Convert array of objects' property to options (string) of a select element. */
        
        var opts = '<option value="default" selected>--Select One--</option>';
        
        for (var i = 0; i < arrayOfObjects.length; i++) {
            opts += '<option value="' + arrayOfObjects[i].name + '">' + UTIL.toTitleCase(arrayOfObjects[i][prop]) + '</option>';
        }
        
        return opts;
    };
    
    my.makeChildrenHTMLIntoArrayElements = function (elem) {
        /* Converts the html values of an element's children into array elements. */
        
        var array = [];
        
        $(elem).children().each(function (i, obj) {
            array.push($(obj).html());
        });
        
        return array;
    };
    
    my.makeChildrenATTRIntoArrayElements = function (elem, attr) {
        /* Converts the attribute values of an element's children into array elements. */
        
        var array = [];
        
        $(elem).children().each(function (i, obj) {
            array.push($(obj).attr(attr));
        });
        
        return array;
    };
    
    my.loadPediaContents = function () {
        /* Load gamepedia contents into pedia divs. */
        
        if (GLOBALS.flags.gamepediaLoaded) { return; }

        UTIL.get('json/gamepedia.json', function (response) {
            var pc = document.getElementById('pedia-content');
            var gp = JSON.parse(response);
            var pups = gp.powerups;

            for (var i = 0; i < pups.length; i++) {
                pc.innerHTML += '<div class="pc-item" data-name="' + pups[i].name + '" data-description="' + pups[i].description + '" data-image-url="' + pups[i].image + '" data-video-url="' + pups[i].video + '">' + pups[i].name + '</div>';
            }
            
            $('.pc-item').click(function () {
                $('.pc-item').removeClass('pc-item-active');
                $(this).addClass('pc-item-active');
                
                $('#cd-item-image').attr('src', $(this).data('image-url'));
                $('#cd-item-name').html($(this).data('name'));
                $('#cd-item-description').html($(this).data('description'));
                $('#cd-item-video').attr('src', $(this).data('video-url'));
                $('#cd-item-video').attr('controls', 'controls');
                $('#cd-item-video').get(0).play();
            });
            
            GLOBALS.flags.gamepediaLoaded = true;
        }, function () {
            
        });
    };
    
    return my;
}());

/* UTIL.asset submodule. */
UTIL.asset = (function() {
    var my = {},
        loadQueue = [],
        loaded = 0,
        failed = 0,
        queued = 0;
        
    my.queue = function (type, args) {
        /* Equeue asset. args: [id, url, libObj] */
        loadQueue.push([type, args]);
        queued++;
    };
    
    my.getTotalQueued = function () {
        return queued;
    };
    
    my.getTotalLoaded = function () {
        return loaded;
    };
    
    my.getTotalFailed = function () {
        return failed;
    };
    
    my.clear = function () {
        /* Clears the loaded, failed, and queued vars for the next loading of assets. */
        loaded = 0;
        failed = 0;
        queued = 0;
    };
    
    my.load = function (onSuccess, onError) {
        /* Load one asset from front of queue. Call onSuccess if successful, else onError. */
        var item = loadQueue.shift();
        var type = item[0];
        var args = item[1];
        
        switch (type) {
            case 'image': // [id, url, library]
                args[2].add(args[0], args[1], function (id) {
                    loaded++;
                    onSuccess(id);
                }, function (error) {
                    failed++;
                    onError(error);
                });
                break;
            case 'soundpool': // [url, volume, poolmax, poolVar]
                args[1].init(function (soundLoc) {
                    loaded++;
                    onSuccess(soundLoc);
                });
                break;
            case 'audio': // [url, loop, volume, musicVar]
                var cpt = args[3].addEventListener('canplaythrough', function () {
                    loaded++;
                    onSuccess(args[0]);
                }, false);
                args[3].src = args[0];
                args[3].loop = args[1];
                args[3].volume = args[2];
                args[3].load();
                break;
            case 'blueprint': // url
                BLUEPRINT.addMulti(args[0], args[1], function(url) {
                    loaded++;
                    onSuccess(url);
                }, function (error) {
                    failed++;
                    onError(error);
                });
                break;
            default:
                break;
        }
    };
    
    my.loadAll = function (onSuccess, onError, onAllLoaded) {
        /*
        *  Load all assets in queue. Callbacks are called for each successfully loaded or failed asset.
        *  onAllLoaded is called after everything on queue has been loaded.
        */
        while (loadQueue.length > 0) {
            my.load(function (response) {
                onSuccess(response);
                // check if everything's been loaded
                if (loaded === queued) {
                    my.clear();
                    
                    onAllLoaded();
                }
                else {
                    
                }
            }, onError);
        }
    };
    
    return my;
}());

/*
* Public Object: ImageLibrary
*
*  An image library constructor
*/
function ImageLibrary() {
    this.shelf = {};
    
    /*
    * Public Method: add
    *
    * Pushes a new image object into the shelf array
    */
    
    this.add = function (id, url, onSuccess, onError) {
        var tmp = new Image();
        tmp.id = id;
        tmp.onload = function () {
            this.ready = true;
            onSuccess(url);
            tmp.onload = null;
        };
        tmp.onerror = function () {
            onError('Error loading ' + id);
        };
        tmp.src = url;
        this.shelf[id] = tmp;
    };
    
    /*
    * Public Method: get
    *
    * Returns the image object which contains id
    */
    this.get = function(id) {
        return this.shelf[id];
    };
}

/*
* Public Object: SoundPool
*
* A sound pool constructor
*
* Parameters:
*   loc - location of the sound file
*   vol - sound volume
*   max - max number of sounds in pool
*/
function SoundPool(loc, vol, max) {
    var size = max,
        soundLoc = loc,
        soundVol = vol,
        soundIndex = 0;
    
    var pool = [];
    this.pool = pool;
    this.loaded = 0;
    
    /*
    * Public Method: init
    * 
    * Initializes the sound pool for later use
    */
    this.init = function (onSuccess) {
        var loaded = this.loaded;
        for (var i = 0; i < size; i++) {
            var sound = new Audio(soundLoc);
            var cpt = sound.addEventListener('canplaythrough', (function (scope) {
                scope.loaded++;
                if (scope.loaded === max) {
                    onSuccess(soundLoc);
                }
                removeEventListener('canplaythrough', cpt, false);
            }(this)), false);
            sound.volume = soundVol;
            sound.load();
            pool[i] = sound;
        }
    };
    
    /*
    * Public Method: get
    *
    * Plays a sound in the pool, shifts index
    */
    this.get = function () {
        if (pool[soundIndex].currentTime === 0 || pool[soundIndex].ended) {
            pool[soundIndex].play();
        }
        soundIndex = (soundIndex + 1) % size;
    };
}

function Stat() {

    var fields = {}; // [fieldname, value]
    
    this.add = function (name) {
        /* Add new field. */
        // Check if field already exists
        
        if (!(name in fields)) {
            fields[name] = 0;
        }   
    };
    
    this.inc = function (name, value) {
        /* Increment value of matching field. */
        fields[name] += value;
    };
    
    this.dec = function (name, value) {
        /* Decrement value of matching field. */
        fields[name] -= value;
    };
    
    this.update = function (name, value) {
        /* Update value of matching field. */
        fields[name] = value;
    };
    
    this.reset = function () {
        /* Reset the values of all fields. */
        for (field in fields) {
            fields[field] = 0;
        }
    };
    
    this.get = function (name) {
        /* Retrieves the value of the matching field. */
        return fields[name];
    };
    
    this.getAll = function () {
        /* Retrieves all the fields. */
        return fields;
    };
};

function Timer(callback, expire) {
    this.cb = function () {
        callback();
        dead = true;
    };
    
    var dead = false;
    this.remaining = expire;
    this.expire_init = expire;

    this.pause = function() {
        window.clearTimeout(this.timerId);
        this.remaining -= new Date() - this.start;
    };

    this.resume = function() {
        this.start = new Date();
        this.timerId = window.setTimeout(this.cb, this.remaining);
    };
    
    this.reset = function () {
        window.clearTimeout(this.timerId);
        this.start = new Date();
        this.timerId = window.setTimeout(this.cb, this.expire_init);
    };
    
    this.extend = function (extension) {
        window.clearTimeout(this.timerId);
        this.remaining = this.getRemaining() + extension;
        this.start = new Date();
        this.timerId = window.setTimeout(this.cb, this.remaining);
    };
    
    this.clear = function () {
        window.clearTimeout(this.timerId);
    };
    
    this.isExpired = function () {
        return dead;
    };
    
    this.getRemaining = function () {
        this.remaining -= new Date() - this.start;
        return this.remaining;
    };
    
    var thisTimer = this;
    timers.push(thisTimer);

    this.resume();
}
