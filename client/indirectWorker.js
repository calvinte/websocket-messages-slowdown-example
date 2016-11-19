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
            // Do stuff with data.
            for (i = message.dat.length - 1; i > -1; i--) {
                message.dat = message.dat.substr(0, i) + (message.dat[i - 1] || message.dat[i]) + message.dat.substr(i + 1);
            }
            queue += message.x + '' + message.y;
        }
    };

    socket.onopen = function() {
        postMessage(queue);
        queue = '';
        socket.send('ping');
    };
}


