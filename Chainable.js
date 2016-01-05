/* --- Chainable.js ---
 *	Written By Iain Shorter
 *
 *	Designed to be used with require.js for module loading
 *
 *	Transpile to es5 format using babel or similar for maximum browser compatibility
 *	The vanilla es6 Map may fit your project better if it matches your compatibility requirements
 */
 define(function () {
 
 	'use strict';

	class Chainable {
	
		constructor (fn, trace) {
			this.task = fn;
			this.label = trace;
			this.subscribers = [];
			this.catchers = [];
		}
	
		then (fn, trace) {
			var subscriber;
			if (fn instanceof Chainable) {
				subscriber = fn;
			} else {
				subscriber = new Chainable(fn, trace);
			}
			this.subscribers.push(subscriber);
			return subscriber;
		}
	
		catch (fn, trace) {
			var catcher;
			if (fn instanceof Chainable) {
				catcher = fn;
			} else {
				catcher = new Chainable(fn, trace);
			}
			this.catchers.push(catcher);
			return this.catcher;
		}
	
		trace (state) {
			if (this.label) {
				console.log(this, this.label + ": " + state);
			}
		}
	
		trigger () {
			var arg, parent = this;
			this.trace("Triggered");
			if (this.task) {
				try {
					arg = this.task.apply(this, arguments);
				} catch (e) {
					this.reject(e);
				}
				if (arg) {
					if (arg instanceof Promise) {
						arg.then(function resolve(a){
							parent.resolve(a);
						}, function reject(a) {
							parent.reject(a);
						});
					} else {
						this.resolve(arg);
					}
				}
			} else {
				this.resolve.apply(this, arguments);
			}
			return this;
		}
	
		resolve () {
			this.trace("Resolving");
			for (var i = 0, l = this.subscribers.length, subscriber; i < l; i++) {
				subscriber = this.subscribers[i];
				subscriber.trigger.apply(subscriber, arguments);
			}
			return this;
		}
	
		reject () {
			var i, l, subscriber, catcher;
			this.trace("Rejecting");
			if (this.catchers.length) {
				for (i = 0, l = this.catchers.length, catcher; i < l; i++) {
					catcher = this.catchers[i];
					catcher.trigger.apply(catcher, arguments);
				}
				//this.catcher.trigger.apply(this.catcher, arguments);
			} else if (this.subscribers.length) {
				for (i = 0, l = this.subscribers.length, subscriber; i < l; i++) {
					subscriber = this.subscribers[i];
					subscriber.reject.apply(subscriber, arguments);
				}
				//this.subscriber.reject.apply(this.subscriber, arguments);
			}
			return this;
		}
	
		static bind (obj, evt, trace) {
			var chainable = new Chainable(null, trace),
				trigger = function() {
				if (chainable.subscriber) {
					chainable.subscriber.trigger.apply(chainable.subscriber, arguments);
				}
			}
			if (typeof object.on === "function") {
				object.on(event,  trigger);
			}
			else if (typeof object.addEventListener === "function") {
				object.addEventListener(event,  trigger, false);
			}
			else if (typeof object.attachEvent === "function") {
				object.attachEvent("on" + event, trigger);
			}
			return chainable;
		}
	
		static resolve (chainable, arg) {
			if (chainable && chainable.resolve) {
				chainable.resolve.apply(chainable, arg);
			}
		}
	
		static reject (chainable, arg) {
			if (chainable && chainable.reject) {
				chainable.reject.apply(chainable, arg);
			}
		}

	}

	return Chainable;
	
});