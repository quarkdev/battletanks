// worker test: http://blogs.msdn.com/b/davrous/archive/2011/07/15/introduction-to-the-html5-web-workers-the-javascript-multithreading-approach.aspx

var obstacles = [];

function messageHandler(event) {
    var messageReceived = JSON.parse(event.data),
    
        switch (messageReceived.cmd) {
            case 'update_obstacles':
                obstacles = messageReceived.data;
                break;
            case 'find_path':
                
                break;
            default:
                break;
        }
}

function findPathToPoint(S, G) {
    /* Find optimal path to point. S & G are source and goal points. */
    
    // GOAL: Project a fixed-length line towards the goal point and check for intersections, if intersections are found, adjust angle to the left and right respectively until no intersection is found.
    
    // 1. Find the angle between the two points
    var dX = S.x - G.x;
    var dY = S.y - G.y;
    
    var angleBetweenPoints = Math.atan2(dY, dX) * 180/Math.PI;
    
    // 2. 
    //var _oY = this.config.oY + (32 * Math.sin(this.config.tAngle*Math.PI/180));
    //var _oX = this.config.oX + (32 * Math.cos(this.config.tAngle*Math.PI/180));
}

/*
* Module : GEOMETRY
* For: Pathfinder
*
* A Module that handles geometry calculations
*/
var GEOMETRY = (function() {
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

this.addEventListener('message', messageHandler, false);