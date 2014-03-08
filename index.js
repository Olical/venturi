'use strict';

var _ = require('lodash');

/**
 * A hierarchical dependency injector.
 *
 * @param {Object[]} [links] Optional array of linked venturi instances to ask for dependencies when it can't be found in the current instance.
 * @param {Object} [parent] Optional parent venturi instance to inherit constructors from.
 */
function Venturi(links, parent) {
	var parentConstructors;

	if (parent) {
		this.parent = parent;
		parentConstructors = _.create(parent.constructors);
	}

	this.instances = {};
	this.modules = {};
	this.constructors = parentConstructors || {};
}

/**
 * Instantiates and returns a new sub-module object that inherits constructors
 * from the instance you created it with. The new module will not inherit
 * instances from the parent, so each module keeps it's own instances of the
 * constructors.
 *
 * You can also pass a variable amount of venturi instances as arguments. These
 * will be used to link this object to the others you specify. The leftmost
 * object will take precedence over those to the right of it. So when you run a
 * get it will ask these if they also have the dependency you're looking for.
 *
 * @param {...Object} arguments Venturi instances you wish to link this one to.
 * @return {Object} A new Venturi instance that uses the parent instance as the prototype for it's constructors object.
 */
Venturi.prototype.module = function () {
	var links = _.toArray(arguments);
	return new Venturi(links, this);
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

	_.forEach(arguments, function (key) {
		dependencies[key] = this.getOrConstruct(key);
	}, this);

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
	var localConstructor = this.constructors[key];
	var matches = {};
	var constructor;

	if (!_.has(this.instances, key)) {
		if (_.isFunction(localConstructor)) {
			if (_.has(this.constructors, key)) {
				matches.direct = localConstructor;
			}
			else {
				matches.inherited = localConstructor;
			}
		}

		matches.link = this.getFromLinks(key);

		if (matches.direct) {
			constructor = matches.direct;
		}
		else if (matches.inherited && !matches.link) {
			constructor = matches.inherited;
		}
		else if (matches.link) {
			constructor = matches.link;
		}

		if (constructor) {
			this.instances[key] = constructor(this);
		}
	}

	return this.instances[key];
};

/**
 * Attempts to fetch the desired dependency from any linked objects this may
 * have. Instances are shared between links. This method is used by
 * getOrConstruct, you're better off using the high level get method.
 *
 * @param {String} key
 * @return {*} Potential instance returned by a linked object.
 */
Venturi.prototype.getFromLinks = function (key) {
};

module.exports = Venturi;
