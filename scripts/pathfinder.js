// worker test: http://blogs.msdn.com/b/davrous/archive/2011/07/15/introduction-to-the-html5-web-workers-the-javascript-multithreading-approach.aspx
var grid = [];

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
            case 'find_path': 
                break;
            default:
                break;
        }
}

function findPathTo(x, y) {
    /* Find path to point. */
    
    // Find equivalent grid cell for point
    var cell = transCanvasCoordsToGrid(x, y);
    
    // Check if goal point is open/reachable.
    if (grid[cell[0] + 2][cell[1] + 2] === 1 ||
        grid[cell[0] + 1][cell[1] + 2]  === 1 ||
        grid[cell[0] - 1][cell[1] + 2]  === 1 ||
        grid[cell[0] - 2][cell[1] + 2] === 1 ||
        
        grid[cell[0] + 2][cell[1] + 1]  === 1 ||
        grid[cell[0] + 1][cell[1] + 1]   === 1 ||
        grid[cell[0] - 1][cell[1] + 1]   === 1 ||
        grid[cell[0] - 2][cell[1] + 1]  === 1 ||
        
        grid[cell[0] + 2][cell[1] - 1]  === 1 ||
        grid[cell[0] + 1][cell[1] - 1]   === 1 ||
        grid[cell[0] - 1][cell[1] - 1]   === 1 ||
        grid[cell[0] - 2][cell[1] - 1]  === 1 ||
        
        grid[cell[0] + 2][cell[1] - 2] === 1 ||
        grid[cell[0] + 1][cell[1] - 2]  === 1 ||
        grid[cell[0] - 1][cell[1] - 2]  === 1 ||
        grid[cell[0] - 2][cell[1] - 2] === 1) {
        
        return []; // path closed/unreachable
    }
}

function updateGrid(obs) {
    /* Construct an obstacle grid. */
    
    grid = [];
    
    // Initialize grid. Create a 128--cell row
    var row = [];
    
    for (var i = 0; i < 128; i++) {
        row.push(0);
    }
    
    // Create a 128x76 grid by pushing a row 76 times
    for (i = 0; i < 76; i++) {
        grid.push(row.slice(0));
    }
    
    // Update grid.
    for (i = 0; i < obs.length; i++) {
        // -12, +12
        var c = transCanvasCoordsToGrid(obs[i][1] - 12, obs[i][2] + 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }
        
        // -4, +12
        c = transCanvasCoordsToGrid(obs[i][1] - 4, obs[i][2] + 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }

        // +4, +12
        c = transCanvasCoordsToGrid(obs[i][1] + 4, obs[i][2] + 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }

        // +12, +12
        c = transCanvasCoordsToGrid(obs[i][1] + 12, obs[i][2] + 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }
        
        // -12, +4
        c = transCanvasCoordsToGrid(obs[i][1] - 12, obs[i][2] + 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }
        
        // -4, +4
        c = transCanvasCoordsToGrid(obs[i][1] - 4, obs[i][2] + 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }

        // +4, +4
        c = transCanvasCoordsToGrid(obs[i][1] + 4, obs[i][2] + 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }

        // +12, +4
        c = transCanvasCoordsToGrid(obs[i][1] + 12, obs[i][2] + 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }
        
        // -12, -4
        c = transCanvasCoordsToGrid(obs[i][1] - 12, obs[i][2] - 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }
        
        // -4, -4
        c = transCanvasCoordsToGrid(obs[i][1] - 4, obs[i][2] - 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }

        // +4, -4
        c = transCanvasCoordsToGrid(obs[i][1] + 4, obs[i][2] - 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }

        // +12, -4
        c = transCanvasCoordsToGrid(obs[i][1] + 12, obs[i][2] - 4);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }
        
        // -12, -12
        c = transCanvasCoordsToGrid(obs[i][1] - 12, obs[i][2] - 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }
        
        // -4, -12
        c = transCanvasCoordsToGrid(obs[i][1] - 4, obs[i][2] - 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }

        // +4, -12
        c = transCanvasCoordsToGrid(obs[i][1] + 4, obs[i][2] - 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }

        // +12, -12
        c = transCanvasCoordsToGrid(obs[i][1] + 12, obs[i][2] - 12);
        if (withinBounds(c.x, c.y)) { grid[c.y][c.x] = 1; }
    }
}

function withinBounds(x, y) {
    /* Check if grid coords within bounds */
    return x > -1 && x < 128 && y > -1 && y < 76;
}

function transCanvasCoordsToGrid(x, y) {
    /* Translates the canvas coords to affected grid coords. Based on a 128x76 memory grid. */
    return {x: Math.round(x/8), y: Math.abs(Math.round(y/8) - 76)};
}

this.addEventListener('message', messageHandler, false);