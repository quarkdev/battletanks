var grid = [],
    MAX_COLS = 228,
    MAX_ROWS = 228;

var tank_size = 32;    
var graph = null;
var obstacles = null;
var msgQueue = [];

var Coord = function (x, y) {
    return {
        x: typeof x === "undefined" ? null : x,
        y: typeof y === "undefined" ? null : y
    };
};

importScripts('graph.js');
importScripts('astar.js'); // https://github.com/bgrins/javascript-astar

function messageHandler(event) {
    var messageReceived = JSON.parse(event.data);

    msgQueue.push(messageReceived);
}

function readMsg() {
    var messageReceived = {};
    var reply = {};
    var waypoint = [];

    if (msgQueue.length > 0) {
        messageReceived = msgQueue.shift();
        
        // handle message
        reply.sender = messageReceived.sender;
    
        switch (messageReceived.cmd) {
            case 'update_obstacles':
                obstacles = messageReceived.data;
                MAX_COLS = messageReceived.worldWidth / 8;
                MAX_ROWS = messageReceived.worldHeight / 8;
                tank_size = messageReceived.tankSize;
                
                clearGrid();
                updateGrid(obstacles);
                
                reply.cmd = 'update_ok';
                
                postMessage(JSON.stringify(reply));
                break;
            case 'rebuild_obstacles':
                obstacles = obstacles.filter(function (item) {
                    return item[1] !== messageReceived.x && item[2] !== messageReceived.y;
                });
                
                clearGrid();
                updateGrid(obstacles);
                
                reply.cmd = 'update_ok';
                
                postMessage(JSON.stringify(reply));
                break;
            case 'get_waypoint':
                waypoint = getMoveList(messageReceived.start, messageReceived.goal, messageReceived.angle);
                
                reply.cmd      = 'waypoint_ok';
                reply.waypoint = waypoint;
                
                postMessage(JSON.stringify(reply));
                break;
            case 'get_waypoint_random':
                waypoint = getRandomMoveList(messageReceived.start, messageReceived.angle);
                    
                reply.cmd      = 'waypoint_ok';
                reply.waypoint = waypoint;
                
                postMessage(JSON.stringify(reply));
                break;
            case 'get_line_of_sight':
                /* Check if bot can see player, if yes, return last known player location {los: true, x: x, y: y} else {los: false, x: null, y: null} */
                var lkl = checkLineOfSight(messageReceived.playerLoc, messageReceived.botLoc, messageReceived.lastKnown);
                
                reply.cmd = 'get_los_ok';
                reply.lkl = lkl;
                
                postMessage(JSON.stringify(reply));
                break;
            default:
                break;
        }
    }
}

function checkLineOfSight(A, B, C) {
    /* Check if there are no obstacles between point A and point B. {X: x, Y: y} */
    for (var i = 0; i < obstacles.length; i++) {
        var ob = obstacles[i];
        if (LineIntersectsRect(A, B, {x: ob[1], y: ob[2], w: 32, h: 32})) {
            return {los: false, x: C.x, y: C.y};
        }
    }
    return {los: true, x: A.x, y: A.y};
}

function LineIntersectsRect(p1, p2, r) {
    return (LineIntersectsLine(p1, p2, {x: r.x, y: r.y}, {x: r.x + r.w, y: r.y}) ||
           LineIntersectsLine(p1, p2, {x: r.x + r.w, y: r.y}, {x: r.x + r.w, y: r.y + r.h}) ||
           LineIntersectsLine(p1, p2, {x: r.x + r.w, y: r.y + r.h}, {x: r.x, y: r.y + r.h}) ||
           LineIntersectsLine(p1, p2, {x: r.x, y: r.y + r.h}, {x: r.x, y: r.y}) ||
           (pointInsideRectangle(r, p1) && pointInsideRectangle(r, p2)));
}

function LineIntersectsLine(l1p1, l1p2, l2p1, l2p2) {
    q = (l1p1.y - l2p1.y) * (l2p2.x - l2p1.x) - (l1p1.x - l2p1.x) * (l2p2.y - l2p1.y);
    d = (l1p2.x - l1p1.x) * (l2p2.y - l2p1.y) - (l1p2.y - l1p1.y) * (l2p2.x - l2p1.x);

    if ( d == 0 ) {
        return false;
    }

    r = q / d;

    q = (l1p1.y - l2p1.y) * (l1p2.x - l1p1.x) - (l1p1.x - l2p1.x) * (l1p2.y - l1p1.y);
    s = q / d;

    if ( r < 0 || r > 1 || s < 0 || s > 1 ) {
        return false;
    }

    return true;
}

function pointInsideRectangle(rect, P) {
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
}

function getRandomMoveList(S, angle) {
    /* Get a random goal point, then search for a path to it. */
    
    var row, col, goal_ok = false;
    
   while (!goal_ok) {
        row = Math.floor(Math.random() * MAX_ROWS);
        col = Math.floor(Math.random() * MAX_COLS);
        
        // Check if goal point is open
        goal_ok = grid[row][col] === 1;
    }
    
    var G = transGridToCanvasCoords(col, row);
    
    return getMoveList(S, [G.x, G.y], angle);
}

function getMoveList(S, G, angle) {
    /* Search for a path from S to G then convert to movelist for tank AI. */
    var s = transCanvasCoordsToGrid(S[0], S[1]);
    var g = transCanvasCoordsToGrid(G[0], G[1]);
    var start = graph.nodes[s.y][s.x];
    var end = graph.nodes[g.y][g.x];
    var coords = astar.search(graph.nodes, start, end, true);
    var path = [];
    
    // Convert grid coords to canvas coords
    for (var i = 0; i < coords.length; i++) {
        path.push(transGridToCanvasCoords(coords[i].y, coords[i].x)); // gridToNonOrigin will require prior string-pulling
    }
    
    // Create movelist (e.g. [[turn, cw, 90], [move, 100, 100], [turn, ccw 45]])
    var lastPoint = S,
        lastAngle = angle,
        movelist = [],
        angleBetween, dX, dY, d_add, d_sub;
        
    for (i = 0; i < path.length; i++) {
        // get angle between lastpoint and path[i]
        dX = path[i].x - lastPoint[0];
        dY = path[i].y - lastPoint[1];
        angleBetween = Math.atan2(dY, dX) * 180/Math.PI;
        angleBetween = angleBetween < 0 ? angleBetween + 360 : angleBetween;
        tanA = angleBetween > lastAngle ? angleBetween - lastAngle : angleBetween + 360 - lastAngle;
    
        d_add = tanA;
        d_sub = Math.abs(360 - tanA);
        
        // push turn command
        if (tanA === 360 || tanA === 0) {
            movelist.push(['turn', 'hold', angleBetween]);
        }
        else if (d_add < d_sub) {
            // turn ccw
            movelist.push(['turn', 'ccw', angleBetween]);
        }
        else if (d_add > d_sub) {
            // turn cw
            movelist.push(['turn', 'cw', angleBetween]);
        }
        
        lastAngle = angleBetween;
        lastPoint = [path[i].x, path[i].y];
        
        // push move command
        movelist.push(['move', path[i].x, path[i].y]);
    }
    
    return movelist.reverse(); // send a reversed movelist for easy popping
}

function clearGrid() {
    /* Clear the grid */
    grid = [];
    
    // Initialize grid. Create a MAX_COLS--cell row
    var row = [];
    
    for (var i = 0; i < MAX_COLS; i++) {
        row.push(1);
    }
    
    // Create a MAX_COLSxMAX_ROWS grid by pushing a row MAX_ROWS times
    for (i = 0; i < MAX_ROWS; i++) {
        grid.push(row.slice(0));
    }
    
    // Pad the boundaries
    for (i = 0; i < MAX_COLS; i++) {
        grid[0][i] = 0;
        grid[1][i] = 0;
        grid[MAX_ROWS - 2][i] = 0;
        grid[MAX_ROWS - 1][i] = 0;
    }
    
    for (i = 0; i < MAX_ROWS; i++) {
        grid[i][0] = 0;
        grid[i][1] = 0;
        grid[i][MAX_COLS - 2] = 0;
        grid[i][MAX_COLS - 1] = 0;
    }
}

function updateGrid(obs) {
    /* Construct an obstacle grid from destructible array. */
    
    // Update grid.
    for (i = 0; i < obs.length; i++) {
        updateGridCell(obs[i][1], obs[i][2], obs[i][3], 0);
    }
    
    graph = new Graph(grid);
}

function updateGridCell(x, y, destructible_size, value) {
    /* Update grid area pertaining to obstacle index. tank_size is the tank chassis size. */
    
    var q = Math.ceil(destructible_size / 16) + Math.ceil(tank_size / 16); // # of cells (x/y) for each quadrant to update
    var c, row, col;
    
    // update first quadrant (+x, +y)
    for (row = 0; row < q; row++) {
        for (col = 0; col < q; col++) {
            c = transCanvasCoordsToGrid(x + (4 + (col * 8)), y + (4 + (row * 8)));
            if (withinBounds(c.y, c.x)) { grid[c.y][c.x] = value; }
        }
    }
    
    // update second quadrant (-x, +y)
    for (row = 0; row < q; row++) {
        for (col = 0; col < q; col++) {
            c = transCanvasCoordsToGrid(x - (4 + (col * 8)), y + (4 + (row * 8)));
            if (withinBounds(c.y, c.x)) { grid[c.y][c.x] = value; }
        }
    }
    
    // update third quadrant (-x, -y)
    for (row = 0; row < q; row++) {
        for (col = 0; col < q; col++) {
            c = transCanvasCoordsToGrid(x - (4 + (col * 8)), y - (4 + (row * 8)));
            if (withinBounds(c.y, c.x)) { grid[c.y][c.x] = value; }
        }
    }
    
    // update last quadrant (+x, -y)
    for (row = 0; row < q; row++) {
        for (col = 0; col < q; col++) {
            c = transCanvasCoordsToGrid(x + (4 + (col * 8)), y - (4 + (row * 8)));
            if (withinBounds(c.y, c.x)) { grid[c.y][c.x] = value; }
        }
    }
}

function withinBounds(x, y) {
    /* Check if grid coords within bounds */
    return x > -1 && x < MAX_COLS && y > -1 && y < MAX_ROWS;
}

function transCanvasCoordsToGrid(x, y) {
    /* Translates the canvas coords to affected grid coords. Based on a MAX_COLSxMAX_ROWS memory grid. */
    return { x: Math.round(x/8), y: Math.abs(Math.round(y/8) - (MAX_ROWS - 1)) };
}

function transGridToCanvasCoords(x, y) {
    /* Translates the grid coords to canvas coords. NOTE: swap the x is grid col, y is grid row */
    return { x: x * 8, y: (MAX_ROWS - 1 - y) * 8 };
}

function gridToNonOrigin(x, y) {
    /* Translates the grid coords to a non-origin point in grid cell relative to canvas representation. */
    var offset = Math.floor(Math.random() * 4);
    var signX = Math.floor((Math.random() * 2) + 1) === 1 ? 1 : -1;
    var signY = Math.floor((Math.random() * 2) + 1) === 1 ? 1 : -1;
    
    var _x = x * 8;
    var _y = (MAX_ROWS - 1 - y) * 8;
    
    _x = _x + (signX * offset);
    _y = _y + (signY * offset);
    
    return { x: _x, y: _y };
}
    
this.addEventListener('message', messageHandler, false);

setInterval(function() {
    readMsg();
}, 1);