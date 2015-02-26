var io = require('socket.io').listen(8082);
var games = {}; // gameId, players, status
var players = {};
var gc = 1;
var h = Math.random();
var gr = 0.618033988749895;

io.sockets.on('connection', function (socket) {
    h += gr;
    h %= 1;
    var rgb = HSVtoRGB(h, 0.5, 0.70);

    players[socket.id] = {
        nick  : 'Guest' + gc++,
        color : 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')', // assign random chat color
        game  : 0
    }
    socket.send('You have joined the lobby as <span style="color: ' + players[socket.id].color + '; font-weight: bold;">' + players[socket.id].nick + '</span>');
    socket.broadcast.send('<span style="color: ' + players[socket.id].color + '; font-weight: bold;">' + players[socket.id].nick + '</span> has joined the lobby.');
    console.log(players[socket.id].nick + ' has connected.');

    socket.on('message', function (msg) {
        io.sockets.send('<span style="color: ' + players[socket.id].color + '; font-weight: bold;">' + players[socket.id].nick + '</span>: ' + msg);
    });
    
    socket.on('changeNick', function (nick) {
        var oldNick = players[socket.id].nick;
        players[socket.id].nick = nick;
        io.send('<span style="color: ' + players[socket.id].color + '; font-weight: bold;">' + oldNick + '</span> is now known as <span style="color: ' + players[socket.id].color + '; font-weight: bold;">' + nick + '</span>');
    });
    
    socket.on('createGame', function () {
        // attempt to create a game
        // see if client is currently connected to a game
        if (players[socket.id].game) {
            socket.emit('currentlyInGame', 'You must first disconnect to create a game.');
        }
        else {
            // create a new game!
            var gameId = genUUID();
            games[gameId] = {
                players: [
                    socket.id
                ],
                status: 'waiting'
            };
            players[socket.id].game = gameId;
            
            // tell player that the game has been created, send the gameId
            socket.emit('gameCreated', gameId);
        }
        
    });
    
    socket.on('leaveGame', function () {
        leaveGame(socket);
    });
    
    socket.on('joinGame', function (gameId) {
        joinGame(gameId, socket);
    });
    
    socket.on('disconnect', function () {
        // remove player uuid
        console.log(players[socket.id].nick + ' has disconnected.');
        socket.broadcast.send('<span style="color: ' + players[socket.id].color + '; font-weight: bold;">' + players[socket.id].nick + '</span> has left the lobby.');
        leaveGame(socket); // leave game
        delete players[socket.id]; // remove player object
        socket.send('You have been disconnected.');
    });
    
    socket.on('startGame', function () {
        if (players[socket.id].game) {
            var game = games[players[socket.id].game];
            if (game.status !== 'started') {
                var ps = game.players;
                game.status = 'started';
                for (var i = 0; i < ps.length; i++) {
                    io.to(ps[i]).emit('gameStart', JSON.stringify({map: 'aurora', id: ps[i]}));
                }
            }
        }
        // tell the connected clients to start the game
        // first prepare the map
        // send the map to the clients, wait for response that map has been loaded
        // start the game on server,
        // emit game-started event
        // periodically send game state snapshots to clients every 60ms (taking client input)
    });
});

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}

function leaveGame(socket) {
    var gameId = players[socket.id].game;
    if (!gameId) return; // player not inside a game
    
    var index = games[gameId].players.indexOf(socket.id);
    
    if (index > -1) {
        games[gameId].players.splice(index, 1);
        players[socket.id].game = 0;
        socket.emit('leftGame', 'You have left the game.');
        // send game info to other clients in game
        var ps = games[gameId].players;
        for (var i = 0; i < ps.length; i++) {
            if (ps[i] === socket.id) continue; // broadcast only to the rest
            io.to(ps[i]).send(players[socket.id].nick + ' has left the game.');
            io.to(ps[i]).emit('updatePlayerList', JSON.stringify(games[gameId]));
        }
        // delete game if there are no more people
        if (ps.length === 0) {
            delete games[gameId];
        }
    }
}

function joinGame(id, socket) {
    if (players[socket.id].game) {
        socket.emit('joinGameFailed', 'Join Failed: You are currently connected to a game.');
    }
    else {
        if (games[id]) {
            if (games[id].players.length < 5 && games[id].status === 'waiting') {
                games[id].players.push(socket.id);
                players[socket.id].game = id;
                
                // let player know he have successfully joined the game
                socket.emit('joinedGame');
                
                // let everyone else know a player have joined the game
                var ps = games[id].players;
                for (var i = 0; i < ps.length; i++) {
                    if (ps[i] === socket.id) continue; // broadcast only to the rest
                    io.to(ps[i]).send(players[socket.id].nick + ' has joined the game.');
                    io.to(ps[i]).emit('updatePlayerList', JSON.stringify(games[i]));
                }
            }
            else {
                // failed to join game
                socket.emit('joinGameFailed', 'Join Failed: Game is full or has started already.');
            }
            
            return;
        }

        // game id doesn't exist
        socket.emit('joinGameFailed', 'Join Failed: Game does not exist!');
    }
}

function genUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
}