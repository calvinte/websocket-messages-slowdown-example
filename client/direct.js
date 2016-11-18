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

        message = socketMessage.data;
        if (message[2] === '|' && message.length === 5) {
            deferFn = domHelper.drawEl(message, ++messageCount);
            setTimeout(deferFn, 500);
        }
    };
    socket.onopen = function() {
        socket.send('ping');
    };
});

