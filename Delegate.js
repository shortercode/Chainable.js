define([
	'Chainable'
], function (Chainable) {

	class Delegate () {
	
		constructor () {
			this.eventlist = {};
		}
	
		on (event, callback) {
			this.eventlist[event] = new Chainable(callback);
			return this.eventlist[event];
		}
	
		fire (event, args) {
			var chainable = this.eventlist[event];
			if (chainable) {
				chainable.trigger(chainable, arguments);
			}
		}
	}

	return Delegate;

});