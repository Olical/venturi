'use strict';

/**
 * A hierarchical dependency injector. This constructor accepts an object to
 * use as the prototype when instantiating the constructors object. This allows
 * you to build a tree of inheritance for constructors available to different
 * modules.
 *
 * This argument should not be used directly though, please use the module
 * method instead. This makes sure your module is registered within the module
 * tree.
 *
 * @param {Object} [parentConstructors] Optional prototype for the constructors object.
 */
function Venturi(parentConstructors) {
	this.instances = {};
	this.modules = {};
	this.constructors = Object.create(parentConstructors || {});
}

/**
 * Instantiates and returns a new sub-module object under the provided name.
 *
 * @param {String} name
 * @return {Object} A new Venturi instance which is registered as a module of the parent it was constructed by.
 */
Venturi.prototype.module = function (name) {
	this.modules[name] = new Venturi(this.constructors);
	return this.modules[name];
};

/**
 * Assigns a constructor to a key, when requested the constructor will be
 * executed and it's return value will be stored for later. It will only be
 * executed once.
 *
 * @param {String} key
 * @param {Function} constructor
 */
Venturi.prototype.set = function (key, constructor) {
	this.constructors[key] = constructor;
};

/**
 * Returns the values returned by the requested constructors.
 *
 * @param {...String} arguments The names of the constructors you want.
 * @return {Object} Each value you requested is set on the object under it's respective name.
 */
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
