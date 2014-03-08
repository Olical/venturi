'use strict';

var Venturi = require('..');
var sinon = require('sinon');
require('should');

describe('Basic', function () {
	var injector;

	beforeEach(function () {
		injector = new Venturi();
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
	});
});