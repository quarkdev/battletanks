function EventEmitter() {
	this._events = {};
}

EventEmitter.prototype = {
	
	constructor: EventEmitter,
	
	listen: function (event, listener) {
		// Attaches a listener

		// Check if event is already registered
		if (!this._events.hasOwnProperty(event)) {
			this._events[event] = [];
		}

		this._events[event].push(listener);
	},

	unlisten: function (event, listener) {
		// Detaches a listener

		// Check if event is registered
	    if (this._events.hasOwnProperty(event)) {
	        for (var i = 0; i < this._events[event].length; i++) {
	            if (this._events[event][i] === listener) {
	                this._events[event].splice(i, 1);
	            }
	        }
	    }
	},

	emit: function (event, data) {
		// Emit event
		data = data || {};
		if (!this._events.hasOwnProperty(event)) { return; }

		var listeners = this._events[event];

		for (var i = 0; i < listeners.length; i++) {
			listeners[i].call(this, data);
		}
	}
};