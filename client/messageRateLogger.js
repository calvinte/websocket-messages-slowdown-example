define([], function() {
    var messageRateLogger = {
        lastRate: null,
        startTime: null,
        count: 0,
        start: function() {
            messageRateLogger.startTime = Date.now();
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
                document.querySelector('.info').innerHTML = messageRateLogger.lastRate.toString();
            }
            messageRateLogger.lastRate = newRate;
            messageRateLogger.startTime = currentTime;
        }
    };
    return messageRateLogger;
});
