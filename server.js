var fs = require('fs');
var express = require('express');
var app = express();
var WebSocket = require('ws');
var _ = require('underscore');
var Url = require('url');

var socketPort = process.env.PORT || '3002';
var socketClients = [];
var socketServer = new WebSocket.Server({
    port: socketPort,
});

socketServer.on('connection', handleServerConnection);

app.use(express.static('src'));
app.use(express.static('client'));
app.use(express.static('node_modules'));

app.get('/', function(req, res) {
    var query = Url.parse(req.url).query;
    if (query && query.indexOf('useWebWorker=true') > -1) {
        res.status(200).send(fs.readFileSync('client/client.html', 'utf8').replace('___SOCKETPORT___', socketPort).replace('__SOCKETSCRIPT__', 'indirect.js'));
    } else {
        res.status(200).send(fs.readFileSync('client/client.html', 'utf8').replace('___SOCKETPORT___', socketPort).replace('__SOCKETSCRIPT__', 'direct.js'));
    }
});
app.listen(process.env.PORT || '3000');

setTimeout(function updateSockets() {
    if (socketClients.length) {
        _.each(socketClients, function(clientSocket, i) {
            var x, y;

            if (!clientSocket) {
                socketClients.splice(i, 1);
                return;
            }

            x = Math.random().toString().slice(2, 4);
            y = Math.random().toString().slice(2, 4);

            if (clientSocket.readyState === 1) {
                clientSocket.send(x + '|' + y);
            }
        });
    }

    setTimeout(updateSockets, Math.random() * 10);
}, 3);

function handleServerConnection(clientSocket) {
    socketClients.push(clientSocket);

    clientSocket.on('close', handleClientClose);
    clientSocket.on('message', handleClientMessage);
};

function handleClientClose(event) {
    var clientSocketIndex = socketClients.indexOf(this);

    if (clientSocketIndex === -1) {
        return
    }

    socketClients[clientSocketIndex] = null;
    socketClients = socketClients.splice(clientSocketIndex, 1);
};

function handleClientMessage(message) {
    var clientSocketIndex = socketClients.indexOf(this);

    if (clientSocketIndex === -1) {
        return;
    }

    if (message === 'ping') {
        this.send('pong');
    }
};

