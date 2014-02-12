var grid = [];

var Coord = function (x, y) {
    return {
        x: typeof x === "undefined" ? null : x,
        y: typeof y === "undefined" ? null : y
    };
}

importScripts('graph.js');
importScripts('astar.js'); // https://github.com/bgrins/javascript-astar

function messageHandler(event) {
    var messageReceived = JSON.parse(event.data);
    
        switch (messageReceived.cmd) {
            case 'update_obstacles':
                var obstacles = messageReceived.data,
                    reply = {};
                
                updateGrid(obstacles);
                
                reply.cmd = 'update_ok';
                reply.data = grid;
                
                postMessage(JSON.stringify(reply));
                break;
            case 'get_waypoint':
                var path = getMoveList(messageReceived.data.start, messageReceived.data.goal, messageReceived.data.angle),
                    reply = {};
                
                reply.cmd = 'waypoint_ok';
                reply.data = path;
                
                postMessage(JSON.stringify(reply));
                break;
            default:
                break;
        }
}

function getMoveList(S, G, angle) {
    /* Search for a pth from S to G then convert to movelist for tank AI. */
    var graph = new Graph(grid);
    var s = transCanvasCoordsToGrid(S[0], S[1]);
    var g = transCanvasCoordsToGrid(G[0], G[1]);
    var start = graph.nodes[s.y][s.x];
    var end = graph.nodes[g.y][g.x];
    var coords = astar.search(graph.nodes, start, end, true);
    var path = [];
    
    // Convert grid coords to canvas coords
    for (var i = 0; i < coords.length; i++) {
        path.push(transGridToCanvasCoords(coords[i].y, coords[i].x));
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
        tanA = angleBetween < 0 ? angleBetween + 360 : angleBetween;
        tanA = tanA > lastAngle ? tanA - lastAngle : tanA + 360 - lastAngle;
    
        d_add = tanA;
        d_sub = Math.abs(360 - tanA);
        
        // push turn command
        if (d_add < d_sub) {
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
    
    return movelist;
}

function updateGrid(obs) {
    /* Construct an obstacle grid from destructible array. */
    
    grid = [];
    
    // Initialize grid. Create a 128--cell row
    var row = [];
    
    for (var i = 0; i < 128; i++) {
        row.push(1);
    }
    
    // Create a 128x76 grid by pushing a row 76 times
    for (i = 0; i < 76; i++) {
        grid.push(row.slice(0));
    }
    
    // Update grid.
    for (i = 0; i < obs.length; i++) {
        // -12, +12
        var c = transCanvasCoordsToGrid(obs[i][1] - 12, obs[i][2] + 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }
        
        // -4, +12
        c = transCanvasCoordsToGrid(obs[i][1] - 4, obs[i][2] + 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }

        // +4, +12
        c = transCanvasCoordsToGrid(obs[i][1] + 4, obs[i][2] + 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }

        // +12, +12
        c = transCanvasCoordsToGrid(obs[i][1] + 12, obs[i][2] + 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }
        
        // -12, +4
        c = transCanvasCoordsToGrid(obs[i][1] - 12, obs[i][2] + 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }
        
        // -4, +4
        c = transCanvasCoordsToGrid(obs[i][1] - 4, obs[i][2] + 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }

        // +4, +4
        c = transCanvasCoordsToGrid(obs[i][1] + 4, obs[i][2] + 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }

        // +12, +4
        c = transCanvasCoordsToGrid(obs[i][1] + 12, obs[i][2] + 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }
        
        // -12, -4
        c = transCanvasCoordsToGrid(obs[i][1] - 12, obs[i][2] - 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }
        
        // -4, -4
        c = transCanvasCoordsToGrid(obs[i][1] - 4, obs[i][2] - 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }

        // +4, -4
        c = transCanvasCoordsToGrid(obs[i][1] + 4, obs[i][2] - 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }

        // +12, -4
        c = transCanvasCoordsToGrid(obs[i][1] + 12, obs[i][2] - 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }
        
        // -12, -12
        c = transCanvasCoordsToGrid(obs[i][1] - 12, obs[i][2] - 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }
        
        // -4, -12
        c = transCanvasCoordsToGrid(obs[i][1] - 4, obs[i][2] - 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }

        // +4, -12
        c = transCanvasCoordsToGrid(obs[i][1] + 4, obs[i][2] - 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }

        // +12, -12
        c = transCanvasCoordsToGrid(obs[i][1] + 12, obs[i][2] - 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 0; }
    }
}

function withinBounds(x, y) {
    /* Check if grid coords within bounds */
    return x > -1 && x < 128 && y > -1 && y < 76;
}

function transCanvasCoordsToGrid(x, y) {
    /* Translates the canvas coords to affected grid coords. Based on a 128x76 memory grid. */
    return { x: Math.round(x/8), y: Math.abs(Math.round(y/8) - 75) };
}

function transGridToCanvasCoords(x, y) {
    /* Translates the grid coords to canvas coords. */
    return { x: x * 8, y: (75 - y) * 8 };
}
    
this.addEventListener('message', messageHandler, false);