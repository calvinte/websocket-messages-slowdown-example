define([
    'underscore',
    'dom',
], function(_, domHelper) {
    var maxNumberOfElements = 500;
    var elementSize = 30;
    var elements = [];
    var messageCount = -1;
    var socket, url = '';
    if (window.location.href.split('://')[0] === 'https') {
        url = 'wss://' + window.location.hostname;
    } else {
        url = 'ws://' + window.location.hostname + ':' + _socketPort;
    }
    socket = new WebSocket(url);
    socket.onmessage = function(socketMessage) {
        var message, messageIndex, deferFn;
        try {
            message = JSON.parse(socketMessage.data);
        } catch (e) {
            return;
        }

        if (message.x && message.y) {
            deferFn = domHelper.drawEl(message.x + '' + message.y, ++messageCount);
            setTimeout(deferFn, 500);
        }

        message = socketMessage.data;
        if (message[2] === '|' && message.length === 5) {
        }
    };
    socket.onopen = function() {
        socket.send('ping');
    };
});

