var MULT = (function () {
    var m = {};
    
    m.connect = function () {
        m.socket = io('http://localhost:8082');

        m.socket.on('connect', function () {
            m.socket.on('message', function (msg) {
                log(msg);
            });
            
            m.socket.on('gameCreated', function (id) {
                log('Game created successfully! UUID: ' + id);
            });
            
            m.socket.on('currentlyInGame', function (msg) {
                log(msg);
            });
            
            m.socket.on('leftGame', function (msg) {
                log(msg);
            });
            
            m.socket.on('joinGameFailed', function (msg) {
                log(msg);
            });
            
            m.socket.on('joinedGame', function () {
                log('Successfully joined game.');
            });
            
            m.socket.on('gameStart', function (data) {
                var d = JSON.parse(data);
                GLOBALS.player.name = d.id;
                document.getElementById('start-game').click();
                document.getElementsByClassName('start-battle-ok')[0].click();
            });
        });
    };
    
    m.disconnect = function () {
        m.socket.emit('disconnect');
    };
    
    m.parseOutBound = function () {
        var cbox = document.getElementById('chatbox');
        var msg = cbox.value;
        
        // check if msg starts with '-'
        if (msg.charAt(0) === '-') {
            // this is a special command, parse the rest of the string
            var nodash = msg.substr(1);
            var parts = nodash.trim().split(' ');
            
            switch (parts[0]) {
                case 'nick':
                    if (parts[1] !== '' && parts.length === 2) {
                        m.socket.emit('changeNick', parts[1]);
                    }
                    break;
                case 'create':
                    if (parts.length === 1) {
                        m.socket.emit('createGame');
                    }
                    break;
                case 'join':
                    if (parts[1] !== '' && parts.length === 2) {
                        m.socket.emit('joinGame', parts[1]);
                    }
                    break;
                case 'start':
                    if (parts.length === 1) {
                        m.socket.emit('startGame');
                    }
                    break;
                case 'leave':
                    if (parts.length === 1) {
                        m.socket.emit('leaveGame');
                    }
                    break;
                default:
                    break;
            }
        }
        else {
            m.socket.send(msg);
        }
        
        cbox.value = '';
    };
    
    var log = function (msg) {
        var chatlog = document.getElementById('chatlog');
        chatlog.innerHTML += '<br>' + msg;
        chatlog.scrollTop = chatlog.scrollHeight;
    };
    
    return m;
}());