var MULT = (function () {
    var m = {};
    
    m.connect = function () {
        m.socket = io('http://localhost:8082');

        m.socket.on('connect', function () {
            m.socket.on('message', function (msg) {
                log(msg);
            });
            
            m.socket.on('gameCreated', function (id) {
                log('<span class="ch-green">Game created successfully! UUID: ' + id + '</span>');
            });
            
            m.socket.on('currentlyInGame', function (msg) {
                log('<span class="ch-red">' + msg + '</span>');
            });
            
            m.socket.on('leftGame', function (msg) {
                log('<span class="ch-grey">' + msg + '</span>');
            });
            
            m.socket.on('joinGameFailed', function (msg) {
                log('<span class="ch-red">' + msg + '</span>');
            });
            
            m.socket.on('joinedGame', function () {
                log('<span class="ch-green">Successfully joined game.</span>');
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
                        if (parts[1].length < 36) {
                            m.socket.emit('changeNick', parts[1]);
                        }
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
                case 'clear':
                    if (parts.length === 1) {
                        document.getElementById('chatlog').innerHTML = '';
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