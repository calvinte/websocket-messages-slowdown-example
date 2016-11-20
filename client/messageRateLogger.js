define([], function() {
    var messageRateLogger = {
        lastRate: null,
        startTime: null,
        count: 0,
        cb: null,
        start: function(cb) {
            messageRateLogger.startTime = Date.now();
            messageRateLogger.cb = cb;
            setInterval(messageRateLogger.log, 2000);
        },
        onMessage: function() {
            messageRateLogger.count++;
        },
        log: function() {
            var currentTime = Date.now();
            var newRate = 1000 * messageRateLogger.count / (currentTime - messageRateLogger.startTime);
            messageRateLogger.count = 0;
            if (messageRateLogger.lastRate != null) {
                if (!messageRateLogger.cb) {
                    document.querySelector('.info').innerHTML = messageRateLogger.lastRate.toString();
                } else {
                    messageRateLogger.cb(messageRateLogger.lastRate);
                }
            }
            messageRateLogger.lastRate = newRate;
            messageRateLogger.startTime = currentTime;
        }
    };
    return messageRateLogger;
});
