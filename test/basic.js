'use strict';

var Venturi = require('..');
var sinon = require('sinon');
var _ = require('lodash');
require('should');

describe('Basic', function () {
	var injector;

	beforeEach(function () {
		injector = new Venturi();
	});

	it('should return an object with the requested dependency set to undefined if it was not found', function () {
		var result = injector.get('foo');
		result.should.have.property('foo', undefined);
	});

	describe('given an injector with an injected constructor', function () {
		var constructorSpy;

		beforeEach(function () {
			constructorSpy = sinon.stub().returns('bar');
			injector.set('foo', constructorSpy);
		});

		it('should return an object with the injected value inside', function () {
			var result = injector.get('foo');
			result.should.have.property('foo', 'bar');
		});

		it('should only execute the constructor once', function () {
			_.times(5, function () {
				injector.get('foo');
			});
			constructorSpy.callCount.should.equal(1);
		});
	});

	describe('given an injector with mutiple injected constructors', function () {
		var stubs;

		beforeEach(function () {
			stubs = {
				one: sinon.stub().returns(1),
				two: sinon.stub().returns(2),
				three: sinon.stub().returns(3)
			};

			_.forIn(stubs, function (value, key) {
				injector.set(key, value);
			});
		});

		it('should all requested dependencies under the correct names', function () {
			var result = injector.get('one', 'three');
			result.should.not.have.property('two');
			result.should.have.properties({
				one: 1,
				three: 3
			});
		});
	});
});