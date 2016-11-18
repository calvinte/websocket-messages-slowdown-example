define([
    'underscore',
    'dom',
], function(_, domHelper) {
    var messageCount = -1;
    var worker = new Worker(require.toUrl('indirectWorker.js'));

    worker.onmessage = function(e) {
        var events = JSON.parse(e.data);
        domHelper.drawEls(events, ++messageCount, function() {
            worker.postMessage('provide');
        });
    };

    worker.postMessage('connect' + _socketPort);
});

