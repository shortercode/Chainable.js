function EventLink(object, event, trace) {
    if (this instanceof EventLink) {
        var link = this;
        this.trigger = function () {
            link.trace("Triggering");
            if (link.subscriber) {
                link.subscriber.trigger.apply(link.subscriber, arguments);
            }
        };
        this.label = trace;
        this.subscriber = null;
        if (typeof object.on === "function") {
            object.on(event,  this.trigger);
        }
        else if (typeof object.addEventListener === "function") {
            object.addEventListener(event,  this.trigger, false);
        }
        else if (typeof object.attachEvent === "function") {
            object.attachEvent("on" + event, this.trigger);
        }
    } else {
        return new EventLink(object, event, trace);
    }
}
EventLink.prototype = {
    then: function (fn) {
        if (fn.trigger) {
            this.subscriber = fn;
        } else {
            this.subscriber = new Chainable(fn);
        }
		return this.subscriber;
    },
    trace: function (state) {
        if (this.label) {
            console.log(this, this.label + ": " + state);
        }
    },
};
