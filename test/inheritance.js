'use strict';

var Venturi = require('..');
var sinon = require('sinon');
require('should');

describe('Inheritance', function () {
	var injector;

	beforeEach(function () {
		injector = new Venturi();
	});

	describe('given an injector that contains an object and a sub-module', function () {
		var childInjector;

		beforeEach(function () {
			childInjector = injector.module();
			injector.set('foo', function () {
				return {};
			});
		});

		it('should not share instances between inherited modules', function () {
			var parentResult = injector.get('foo');
			var childResult = childInjector.get('foo');
			parentResult.foo.bar = true;
			childResult.foo.baz = true;
			childResult.foo.should.not.have.property('bar');
			parentResult.foo.should.not.have.property('baz');
		});
	});

	describe('given an injector with a value and a sub-module with a value', function () {
		var stubs;
		var childInjector;

		beforeEach(function () {
			stubs = {
				one: sinon.stub().returns(1),
				two: sinon.stub().returns(2)
			};

			childInjector = injector.module();
			injector.set('one', stubs.one);
			childInjector.set('two', stubs.two);
		});

		it('should let the child access both values', function () {
			var result = childInjector.get('one', 'two');
			result.should.have.properties({
				one: 1,
				two: 2
			});
		});

		it('should let the parent only access it\'s one value', function () {
			var result = injector.get('one', 'two');
			result.should.have.properties({
				one: 1,
				two: undefined
			});
		});

		describe('and the child overrides the value set by the parent', function () {
			var replacementStub;

			beforeEach(function () {
				replacementStub = sinon.stub().returns(-1);
				childInjector.set('one', replacementStub);
			});

			it('should allow the child to override a value', function () {
				var result = childInjector.get('one', 'two');
				result.should.have.properties({
					one: -1,
					two: 2
				});
			});
		});
	});
});
