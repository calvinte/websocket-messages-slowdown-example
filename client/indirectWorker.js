queue = '';
onmessage = function(e) {
    var connectStr = 'connect';
    var oldQueue;
    var connectPort = null;
    if (e.data.indexOf(connectStr) === 0) {
        connectPort = e.data.slice(connectStr.length);
        connect(connectPort);
    } else if (e.data === 'provide' && queue.length) {
        oldQueue = queue;
        queue = '';

        setTimeout(function() {
            postMessage(oldQueue);
            oldQueue = null;
        }, 60);
    }
};

function connect(url) {
    var socket = new WebSocket(url);

    socket.onmessage = function(socketMessage) {
        var message;
        try {
            message = JSON.parse(socketMessage.data);
        } catch (e) {
            return;
        }
        if (message.x && message.y) {
            queue += message.x + '' + message.y;
        }
    };

    socket.onopen = function() {
        var oldQueue = queue;
        queue = '';
        setTimeout(function() {
            postMessage(oldQueue);
            oldQueue = null;
        }, 60);
        socket.send('ping');
    };
}


