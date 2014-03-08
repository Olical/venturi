'use strict';

function Venturi(parentConstructors) {
	this.instances = {};
	this.modules = {};

	if (parentConstructors) {
		this.constructors = Object.create(parentConstructors);
	}
	else {
		this.constructors = {};
	}
}

Venturi.prototype.module = function (name) {
	this.modules[name] = new Venturi(this.constructors);
	return this.modules[name];
};

Venturi.prototype.set = function (key, constructor) {
	this.constructors[key] = constructor;
};

Venturi.prototype.get = function () {
	var dependencies = {};
	var key;
	var i;

	for (i = 0; i < arguments.length; i++) {
		key = arguments[i];

		if (!this.instances[key] && typeof this.constructors[key] === 'function') {
			this.instances[key] = this.constructors[key](this);
		}

		dependencies[key] = this.instances[key];
	}

	return dependencies;
};

module.exports = Venturi;
