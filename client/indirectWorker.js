importScripts('requirejs/require.js');
queue = '';
onmessage = function(e) {
    var connectStr = 'connect';
    var connectPort = null;
    if (e.data.indexOf(connectStr) === 0) {
        connectPort = e.data.slice(connectStr.length);
        connect(connectPort);
    } else if (e.data === 'provide' && queue.length) {
        postMessage(queue);
        queue = '';
    }
};

var connect = function(port) {
    if (connect.__orig) {
        setTimeout(function() {
            connect(port);
        }, 1000);
    }
};
connect.__orig = true;

require([
    'messageRateLogger',
    'load'
], function(messageRateLogger, load) {

    connect = function(url) {
        var socket = new WebSocket(url);

        socket.onmessage = function(socketMessage) {
            var message;
            try {
                message = JSON.parse(socketMessage.data);
            } catch (e) {
                return;
            }

            messageRateLogger.onMessage();

            if (message.x && message.y) {
                load.run(200);
                queue += message.x + '' + message.y;
            }
        };

        socket.onopen = function() {
            queue = '';
            postMessage(oldQueue);
            socket.send('ping');
        };
    }

    messageRateLogger.start(function(rate) {
        postMessage('rate:' + rate);
    });
    load.periodicLarge();
});
