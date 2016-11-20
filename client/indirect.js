define([
    'underscore',
    'dom',
], function(_, domHelper) {
    var messageCount = -1;
    var worker = new Worker(require.toUrl('indirectWorker.js'));
    var lastMessageTime = null;
    var forceProvideTimeout = 5000;
    var socketUrl = '';
    if (window.location.href.split('://')[0] === 'https') {
        socketUrl = 'wss://' + window.location.hostname;
    } else {
        socketUrl = 'ws://' + window.location.hostname + ':' + _socketPort;
    }

    worker.onmessage = function(e) {
        if (e.data.substring(0, 4) === 'rate') {
            document.querySelector('.info').innerHTML = e.data.substring(4);
            return;
        }

        var events = e.data.match(/.{1,4}/g);
        lastMessageTime = Date.now();
        domHelper.drawEls(events, messageCount, function() {
            worker.postMessage('provide');
        });

        if (events && events.length) {
            messageCount += events.length;
        }
    };

    setInterval(function() {
        if (Date.now() - lastMessageTime > forceProvideTimeout) {
            worker.postMessage('provide');
        };
    }, 1000);

    worker.postMessage('connect' + socketUrl);
});
