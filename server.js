var fs = require('fs');
var express = require('express');
var crypto = require('crypto');
var app = express();
var WebSocket = require('ws');
var _ = require('underscore');
var Url = require('url');
var http = require('http');

var port = process.env.PORT || '3000';
var socketClients = [];

var server = http.createServer(app);
server.listen(port);

var socketServer = new WebSocket.Server({
    server: server,
});
socketServer.on('connection', handleServerConnection);

app.use(express.static('src'));
app.use(express.static('client'));
app.use(express.static('node_modules'));

app.get('/', function(req, res) {
    var query = Url.parse(req.url).query;
    if (query && query.indexOf('useWebWorker=true') > -1) {
        res.status(200).send(fs.readFileSync('client/client.html', 'utf8').replace('___SOCKETPORT___', port).replace('__SOCKETSCRIPT__', 'indirect.js'));
    } else {
        res.status(200).send(fs.readFileSync('client/client.html', 'utf8').replace('___SOCKETPORT___', port).replace('__SOCKETSCRIPT__', 'direct.js'));
    }
});

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
                clientSocket.send(JSON.stringify({x:x, y:y, dat:crypto.randomBytes(1e+3).toString('hex')}));
            }
        });
    }

    setTimeout(updateSockets, 3 + Math.random() * 3);
}, 30);

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

