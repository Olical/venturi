'use strict';

var Venturi = require('..');
require('should');

describe('Links', function () {
	var injector;

	beforeEach(function () {
		injector = new Venturi();
	});

	describe('given one instance that links to another but is in a different part of the inheritance tree', function () {
		var providingInjector;
		var consumingInjector;

		beforeEach(function () {
			providingInjector = injector.module();
			consumingInjector = injector.module(providingInjector);
		});

		describe('where the provider contains a value', function () {
			beforeEach(function () {
				providingInjector.set('foo', function () {
					return {bar:true};
				});
			});

			it('should allow the consumer to access the value in the provider', function () {
				var result = consumingInjector.get('foo');
				result.foo.should.have.property('bar', true);
			});

			it('should share the instances between the two injectors', function () {
				var providerResult = providingInjector.get('foo');
				var consumerResult = consumingInjector.get('foo');
				providerResult.foo.one = 1;
				consumerResult.foo.two = 2;
				providerResult.foo.two.should.equal(2);
				consumerResult.foo.one.should.equal(1);
			});

			describe('where the consumer has overriden the desired dependency', function () {
				beforeEach(function () {
					consumingInjector.set('foo', function () {
						return {baz:true};
					});

					it('should use the local value, not the linked one', function () {
						var result = consumingInjector.get('foo');
						result.foo.should.have.property('baz', true);
					});
				});
			});

			describe('where there is another level of inheritence with no links', function () {
				var subConsumingInjector;

				beforeEach(function () {
					subConsumingInjector = consumingInjector.module();
				});

				it('should allow children to inherit through links', function () {
					var result = subConsumingInjector.get('foo');
					result.foo.should.have.property('bar', true);
				});
			});
		});
	});
});
