define([], function() {
    var load = {
        run: function(size) {
            var iRoot = {};
            for (var i = 0; i < size; i++) {
                iRoot[i] = 123;
            }
            var root = {};
            for (i = 0; i < size; i++) {
                root[i] = JSON.parse(JSON.stringify(iRoot));
            }
            root = JSON.parse(JSON.stringify(root));
            var keyCount = 0;
            Object.keys(root).forEach(function(inner) {
                Object.keys(inner).forEach(function() {
                    keyCount++;
                });
            });
        },
        periodicLarge: function() {
            load.run(350);

            setTimeout(function() {
                load.periodicLarge();
            }, 1000);
        }
    };
    return load;
});
