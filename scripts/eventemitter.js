(function EventEmitter() {
	var events = {};
	/*
	*	Structure:
	*	event : {[listener],...}
	*/
	this.listen = function (event, listener) {
		// Attaches a listener

		// Check if event is already registered
		for (key in events) {
			if (key === event) {
				// if registered, push new listener
				events[event].push(listener);
			}
			else {
				// not registered, so register new event
				events[event] = [];

				// then push new listener to this event
				events[event].push(listener);
			}
		}
	};

	this.unlisten = function (event, listener) {
		// Detaches a listener

		// Check if event is registered
		for (key in events) {
			if (key === event) {
				// if registered, detach listener
				for (var i in events[key]) {
					if (events[key][i] === listener) {
						events[key].splice(i, 1);
						break;
					}
				}
				break;
			}
		}
	};

	this.emit = function (event, data) {
		// Emit event
		data = data || {};
		for (var i in events[event]) {
			events[event][i](data);
		}
	};
}());