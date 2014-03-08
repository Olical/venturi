'use strict';

/**
 * A hierarchical dependency injector. This constructor accepts an object to
 * use as the prototype when instantiating the constructors object. This allows
 * you to build a tree of inheritance for constructors available to different
 * modules.
 *
 * This argument should not be used directly though, please use the module
 * method instead.
 *
 * @param {Object} [parentConstructors] Optional prototype for the constructors object.
 */
function Venturi(parentConstructors) {
	this.instances = {};
	this.modules = {};
	this.constructors = Object.create(parentConstructors || {});
}

/**
 * Instantiates and returns a new sub-module object that inherits from the instance you created it with.
 *
 * @return {Object} A new Venturi instance that uses the parent instance as the prototype for it's constructors object.
 */
Venturi.prototype.module = function () {
	return new Venturi(this.constructors);
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
		dependencies[key] = this.getOrConstruct(key);
	}

	return dependencies;
};

/**
 * Fetches a single dependency, it will construct it if not found within the
 * instances object. Not intended to be used directly, you should use it
 * through the get method which packs your dependencies into an object.
 *
 * The constructors are called with this venturi instance as their first
 * argument.
 *
 * @param {String} key
 * @return {*} Potentially cached response from the constructor.
 */
Venturi.prototype.getOrConstruct = function (key) {
	var constructor = this.constructors[key];

	if (!this.instances.hasOwnProperty(key) && typeof constructor === 'function') {
		this.instances[key] = constructor(this);
	}

	return this.instances[key];
};

module.exports = Venturi;
