/* Module: UTIL*/

/*
* Module : UTIL
*
* Hosts most of the common utility functions used by Battletanks
*/
var UTIL = (function () {
    var my = {};
    
    var _idInArray = function (array, id) {
        // Check if id exists in array.
        for (var i = 0; i < array.length; i++) {
            if (array[i].id == id) {
                return true;
            }
        }
        
        return false;
    };
    
    my.getMousePos = function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            mX: evt.clientX - rect.left,
            mY: (evt.clientY - rect.bottom) * (-1) // multiply by -1 since the plane is inversed vertically
        };
    };
    
    my.genArrayId = function (array) {
        // Generate a unique id for an array element.
        var id = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
        do {
            for( var i=0; i < 5; i++ )
                id += possible.charAt(Math.floor(Math.random() * possible.length));
        } while (_idInArray(array, id));
        
        return id;
    };
    
    my.writeToLog = function (message) {
        cLog.innerHTML = cLog.innerHTML + message + '<br>';
        cLog.scrollTop = document.getElementById('log-' + logNum).offsetTop;
        logNum++;
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
    }

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
    }

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
        /* Checks if point is inside rotated/unrotated rectangle. */
        
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
    *   an object which contains the parameters:
    *       yes       - a boolean true if an intersection is found, else a boolean false
    *       sideIndex - an integer representing the side of impact
    *       poi       - an object representing the point of impact                
    */
    my.lineAxPaSquareIntersect = function (square, line) {
        /* Checks if a line intersects any of the line segments representing an axis-parallel square, where
           square = { s: _, x: _, y: _ } and line = { Ax: _, Ay: _, Bx: _, By: _ } | line.Bx and line.By are points
           corresponding to lastX and lastY. */
           
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
        
        // Check each line segment if it intersects with the other line segment.
        for (var i = 0; i < lines.length; i++) {
            
            if (_linesIntersect(new Point(line.Ax, line.Ay), new Point(line.Bx, line.By), new Point(lines[i].A.x, lines[i].A.y), new Point(lines[i].B.x, lines[i].B.y))) {
                // If it intersects, get PoI, compare it with the nearest_line (if !null) otherwise save it.
                var poi = _getPofIntLines(lines[i], incidentLine),
                    dist = _getDistanceBetweenPoints(lastPoint, poi),
                    side, // Side of the square that was hit. top-right-bottom-left || 0-1-2-3
                    valid;

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
    
    my.getPofIntLines = function(A, B, C, D) {
        /* Utility wrapper. Takes 4 points: AB CD. */
        
        return _getPofIntLines(new Line(A, B), new Line(C, D));
    };
    
    my.getDistanceBetweenPoints = function(A, B) {
        /* Utility wrapper. */
        
        return _getDistanceBetweenPoints(A, B);
    };
    
    var _getDistanceBetweenPoints = function(A, B) {
        /* Return the distance between two points. */
        
        return Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2));
    };
    
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
    
    var _linesIntersect = function (A, B, C, D) {
        /* Checks if two lines each defined by two points, intersect. Parameters: A, B, C and D are all Point objects.
           This is based on the following assumption: A-B:C-D are line segment AB and CD respectively.*/

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
    
    var _getLineSegmentsFromSquare = function (side, x, y) {
        /*  Returns a list of Line Objects of the format: [T, R, B, L] */

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

// IMAGE LIBRARY
function ImageLibrary() {
    this.shelf = [];
 
    this.add = function(id, source) {
        this.tmp = new Image();
        this.tmp.id = id;
        this.tmp.onload = function() { this.ready = true; };
        this.tmp.src = source;
        this.shelf.push(this.tmp);
    };
    
    this.get = function(id) {
        for (var i = 0; i < this.shelf.length; i++) {
            if (this.shelf[i].id == id) {
                return this.shelf[i];
            }
        }
        return false;
    };
}

// SOUND POOL
function SoundPool(maxSize) {
    var size = maxSize; // max sounds allowed in pool
    var pool = [];
    this.pool = pool;
    var currSound = 0;
    
    this.init = function(object) {
        if (object == 'turret_fire') {
            for (var i = 0; i < size; i++) {
                // initialize the sound
                turret_fire = new Audio('sounds/turret_fire.wav');
                turret_fire.volume = 0.12;
                turret_fire.load();
                pool[i] = turret_fire;
            }
        }
        else if (object == 'explosion') {
            for (var i = 0; i < size; i++) {
                var explosion = new Audio('sounds/explosion.wav');
                explosion.volume = 0.1;
                explosion.load();
                pool[i] = explosion;
            }
        }
        else if (object == 'd_explosion') {
            for (var i = 0; i < size; i++) {
                var d_explosion = new Audio('sounds/destructible_hit.wav');
                d_explosion.volume = 0.1;
                d_explosion.load();
                pool[i] = d_explosion;
            }
        }
        else if (object == 'd_destroyed') {
            for (var i = 0; i < size; i++) {
                var d_destroyed = new Audio('sounds/destructible_destroyed.wav');
                d_destroyed.volume = 0.2;
                d_destroyed.load();
                pool[i] = d_destroyed;
            }
        }
        else if (object == 'tank_destroyed') {
            for (var i = 0; i < size; i++) {
                var t_destroyed = new Audio('sounds/tank_destroyed.wav');
                t_destroyed.volume = 0.2;
                t_destroyed.load();
                pool[i] = t_destroyed;
            }
        }
        else if (object == 'tank_destroyed2') {
            for (var i = 0; i < size; i++) {
                var t_destroyed2 = new Audio('sounds/tank_destroyed2.wav');
                t_destroyed2.volume = 0.2;
                t_destroyed2.load();
                pool[i] = t_destroyed2;
            }
        }
        else if (object == 'tank_destroyed3') {
            for (var i = 0; i < size; i++) {
                var t_destroyed3 = new Audio('sounds/tank_destroyed3.wav');
                t_destroyed3.volume = 0.2;
                t_destroyed3.load();
                pool[i] = t_destroyed3;
            }
        }
        else if (object == 'pick-powerup') {
            for (var i = 0; i < size; i++) {
                var pick_powerup = new Audio('sounds/pick-powerup.wav');
                pick_powerup.volume = 0.2;
                pick_powerup.load();
                pool[i] = pick_powerup;
            }
        }
    };
    
    this.get = function() {
        if(pool[currSound].currentTime === 0 || pool[currSound].ended) {
            pool[currSound].play();
        }
        currSound = (currSound + 1) % size;
    };
}