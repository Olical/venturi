'use strict';

function DI() {
	this.constructors = {};
	this.instances = {};
}

DI.prototype.set = function (key, constructor) {
	this.constructors[key] = constructor;
};

DI.prototype.get = function () {
	var dependencies = {};
	var key;
	var i;

	for (i = 0; i < arguments.length; i++) {
		key = arguments[i];

		if (!this.instances[key] && typeof this.constructors[key] === 'function') {
			this.instances[key] = this.constructors[key]();
		}
		else {
			console.error('No DI item found for key "' + key + '".');
		}

		dependencies[key] = this.instances[key];
	}

	return dependencies;
};





(function () {
	var di = new DI();

	di.set('foo', function () {
		var deps = di.get('bar');
		deps.bar.run();
	});

	di.set('bar', function () {
		return {
			run: function () {
				console.log('EXECUTED!');
			}
		};
	});

	di.get('foo');
}());
