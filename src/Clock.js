/*
    Adapted from three.js Clock
    Original: https://github.com/mrdoob/three.js/blob/master/src/core/Clock.js
 */
var Clock = function ( ) {
    this.oldTime = this.startTime = Clock.time();
};
if (self.performance && self.performance.now) {
    Clock.time = function() {return performance.now();};
}
else if (Date.now) {
    Clock.time = function() {return Date.now();};
}
else {
    Clock.time = function() {return new Date().getTime()};
}
Clock.interval = function(fn, time) {
    var nextAt, wrapper, cancel, timeout;
    nextAt = Clock.time() + time;
    wrapper = function() {
        nextAt += time;
        timeout = setTimeout(wrapper, nextAt - Clock.time());
        return fn();
    };
    cancel = function() {
        return clearTimeout(timeout);
    };
    timeout = setTimeout(wrapper, nextAt - Clock.time());
    return {
        cancel: cancel
    };
};
Clock.frame = function () {
    var stack = [];
    var running = false;
    function frame (t) {
        var i = stack.length;
        if (i > 0) {
            requestAnimationFrame(frame);
            running = true;
            while (i--) {
                stack[i](t);
            }
        } 
        else {
            running = false;  
        }
    }
    return function (fn) {
        function cancel () {
            var i = stack.indexOf(fn);
            if (~i) {
                stack.splice(i, 1);
            }
        }
        function start () {
            var i = stack.indexOf(fn);
            if (!~i) {
                stack.push(fn);
            }
            if (running === false) {
                requestAnimationFrame(frame);  
                running = true;
            }
        }
        return {
            cancel: cancel,
            run: start
        }
    };
}();
Clock.timeout = function(fn, time) {
    var cancel, timeout;
    cancel = function() {
        return clearTimeout(timeout);
    };
    timeout = setTimeout(fn, time);
    return {
        cancel: cancel
    }
};
Clock.prototype = {
    constructor: Clock,
    reset: Clock, 
    getElapsedTime: function () {
        return ( Clock.time() - this.startTime );
    },
    getDelta: function () {
        var newTime = Clock.time(),
            diff = ( newTime - this.oldTime );
        this.oldTime = newTime;
        return diff;
    }
};