define([
    'underscore',
    'dom',
], function(_, domHelper) {
    var messageCount = -1;
    var worker = new Worker(require.toUrl('indirectWorker.js'));
    var lastMessageTime = null;
    var forceProvideTimeout = 600;

    worker.onmessage = function(e) {
        var events = JSON.parse(e.data);
        lastMessageTime = Date.now();
        domHelper.drawEls(events, ++messageCount, function() {
            worker.postMessage('provide');
        });
    };

    setInterval(function() {
        if (Date.now() - lastMessageTime > forceProvideTimeout) {
            worker.postMessage('provide');
        };
    }, 100);

    worker.postMessage('connect' + _socketPort);
});

