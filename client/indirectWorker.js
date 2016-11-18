queue = '';
onmessage = function(e) {
    var connectStr = 'connect';
    var connectPort = null;
    if (e.data.indexOf(connectStr) === 0) {
        connectPort = e.data.slice(connectStr.length);
        connect(connectPort);
    } else if (e.data === 'provide' && queue.length) {
        setTimeout(function() {
            postMessage(queue);
        }, 20);
        queue = '';
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
        setTimeout(function() {
            postMessage(queue);
        }, 20);
        queue = '';
        socket.send('ping');
    };
}


