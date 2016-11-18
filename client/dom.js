define([
    'underscore',
], function(_) {
    return {
        maxNumberOfElements: 500,
        elementSize: 30,
        elements: [],
        createNewElement: function(x, y) {
            var el = document.createElement('div');
            el.classList.add('dynamo');
            el.classList.add('hide');
            el.style.height = this.elementSize + 'px';
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.style.width = this.elementSize + 'px';
            el.style.backgroundColor = this.getBackgroundColor();
            document.body.appendChild(el);
            return el;
        },
        drawElsCount: -1,
        drawEls: function(messages, startIndex, cb) {
            var deferFns = [];
            var idx = ++this.drawElsCount;

            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;
            requestAnimationFrame(function() {
                if (idx !== this.drawElsCount) {
                    return;
                }

                _.each(messages, function(message, i) {
                    deferFns.push(this.drawEl(message, startIndex + i, windowWidth, windowHeight));
                }.bind(this));

                cb();

                setTimeout(function() {
                    _.each(deferFns, function(fn) {
                        fn();
                    });
                }, 500);

            }.bind(this));
        },
        drawEl: function(message, messageIndex, windowWidth, windowHeight) {
            var x, y, element = null;

            if (!(windowHeight && windowWidth)) {
                windowHeight = window.innerHeight;
                windowWidth = window.innerWidth;
            }

            x = Math.round(parseInt(message.slice(0, 2)) / (100 * this.elementSize) * windowWidth) * this.elementSize;
            y = Math.round(parseInt(message.slice(3, 5)) / (100 * this.elementSize) * windowHeight) * this.elementSize;


            if (this.elements.length < this.maxNumberOfElements) {
                element = this.createNewElement(x, y);
                return function() {
                    element.classList.remove('hide');
                    this.elements.push(element);
                }.bind(this);
            } else {
                element = this.elements[messageIndex % this.maxNumberOfElements];
                element.classList.add('hide');
                return function() {
                    element.classList.remove('hide');
                    element.style.backgroundColor = this.getBackgroundColor();
                    element.style.left = x + 'px';
                    element.style.top = y + 'px';
                }.bind(this);
            }
        },
        getBackgroundColor: function() {
            var now = Date.now();
            return 'hsl(' + Math.floor((360 * ((now / 10000 % now) % 1))) + ', 100%, 50%)';
        },
    };
});

