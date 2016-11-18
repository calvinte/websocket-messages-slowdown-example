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
        }, 20);
    }
};

function connect(url) {
    var socket = new WebSocket(url);

    socket.onmessage = function(socketMessage) {
        var message = socketMessage.data;
        if (message[2] === '|' && message.length === 5) {
            queue += message;
        }
    };

    socket.onopen = function() {
        var oldQueue = queue;
        queue = '';
        setTimeout(function() {
            postMessage(oldQueue);
            oldQueue = null;
        }, 20);
        socket.send('ping');
    };
}


