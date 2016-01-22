function Timeout(t) {
    this.interval = t;
    this.timer = null;
    this.subscriber = null;
}
Timeout.prototype = {
    then: function (fn) {
    	if (fn.trigger) {
    		return this.subscriber = fn;
    	} else {
        	return this.subscriber = new Chainable(fn);
        }
    },
    trigger: function () {
        var that = this;
        this.timer = setTimeout(function(){
            that.timer = null;
            that.resolve(arguments);
        }, this.interval, arguments);
    },
    resolve: function () {
        if (this.subscriber) {
            this.subscriber.trigger.apply(this.subscriber, arguments);
        }
    },
    cancel : function () {
        clearTimeout(this.timer);
        this.timer = null;
    }
};

function Interval(t) {
    var that = this;
    this.subscriber = null;
    setInterval(Interval.resolve, t, this);
}
Interval.prototype = Chainable.prototype;
Interval.prototype.constructor = Interval;