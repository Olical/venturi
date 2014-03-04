'use strict';

function DI(parentConstructors) {
	this.instances = {};
	this.modules = {};

	if (parentConstructors) {
		this.constructors = Object.create(parentConstructors);
	}
	else {
		this.constructors = {};
	}
}

DI.prototype.module = function (name) {
	this.modules[name] = new DI(this.constructors);
	return this.modules[name];
};

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
			this.instances[key] = this.constructors[key](this);
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

	di.set('foo', function (di) {
		var deps = di.get('bar');
		deps.bar.run();
	});

	di.set('bar', function () {
		return {
			run: function () {
				console.log('EXECUTED - normal!');
			}
		};
	});

	di.get('foo');


	var someModule = di.module('test');

	someModule.set('bar', function () {
		return {
			run: function () {
				console.log('EXECUTED - module!');
			}
		};
	});

	someModule.get('foo');
}());
