# Venturi [![Travis CI state][travis-state]][travis]

Hierarchical JavaScript dependency injection. It's named after the [Venturi effect][] which is used within [injectors][]. I thought it was a bit more interesting and unique than `HierarchicalDependencyInjector`.

The main premise of this little [DI][] library is prototypical inheritance of constructor functions, also known as factories. But you're not just limited to a strict tree. You can link one module to another which will cause the linked constructors to propagate down the consumer's tree. A link shares instances, so you can keep a shared object in DI, but inheritance doesn't, that just shares constructors.

## No idea what I'm talking about?

```
        A
       / \
      D   B
     / \   \
    E   F   C
```

This crude ASCII tree represents a DI hierarchy; C inherits from B which inherits from A. So if you define a value in A, B and C will be able to see it. But what if you want the D section of the tree to have access to things in B? That's where you create a link. This link allows D to access things only defined within the B module, by extension, the E and F modules will also then have access to them.

So you can build a tree of constructor inheritance and link sections of the tree where required to provide a shared DI container and constructor pool. This may all be a little confusing still, so please checkout the tests and the source file for the best possible examples as to how you should actually use this. Here's some simple examples to get you going though.

## Examples

### Basic

```javascript
var injector = new Venturi();

injector.set('foo', function () {
    return {
        message: 'FOO!'
    };
});

injector.set('bar', function () {
    return {
        message: 'BAR!'
    };
});

injector.get('foo', 'bar');

/*
{
    foo: {
        message: 'FOO!'
    },
    bar: {
        message: 'BAR!'
    }
}
*/
```

### Inheritance

```javascript
var injector = new Venturi();
var childInjector = injector.module();

injector.set('foo', function () {
    return {
        message: 'FOO!'
    };
});

childInjector.set('bar', function () {
    return {
        message: 'BAR!'
    };
});

childInjector.get('foo', 'bar');

/*
{
    foo: {
        message: 'FOO!'
    },
    bar: {
        message: 'BAR!'
    }
}
*/
```

### Overriding inheritance

```javascript
var injector = new Venturi();
var childInjector = injector.module();

injector.set('foo', function () {
    return {
        message: 'FOO!'
    };
});

childInjector.set('bar', function () {
    return {
        message: 'BAR!'
    };
});

childInjector.set('foo', function () {
    return false;
});

childInjector.get('foo', 'bar');

/*
{
    foo: false,
    bar: {
        message: 'BAR!'
    }
}
*/

// But the original is still fine.
injector.get('foo');

/*
{
    foo: {
        message: 'FOO!'
    }
}
*/
```

### Links

```javascript
var injector = new Venturi();
var childInjector = injector.module();
var linkedInjector = injector.module(childInjector);

// Linked has access to everything in the child and root with a shared instance pool.
// Despite the shared bool, the linked injector can still override dependencies if it wants to.
// Links are gathered up the tree, so each child inherits it's parents links!
```

## Package managers and module systems

You can install Venturi through [npm][] or [bower][]. It supports [AMD][] ([RequireJS][]), [CommonJS][] ([node][]) and global definition (a normal script tag) thanks to the technique I detail in [one of my posts][module-post].

## Unlicense

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>

[venturi effect]: https://en.wikipedia.org/wiki/Venturi_effect
[injectors]: https://en.wikipedia.org/wiki/Injector
[di]: https://en.wikipedia.org/wiki/Dependency_injection
[travis]: https://travis-ci.org/Wolfy87/venturi
[travis-state]: https://travis-ci.org/Wolfy87/venturi.png
[npm]: https://www.npmjs.org/
[bower]: http://bower.io/
[module-post]: http://oli.me.uk/2013/07/21/exporting-through-amd-commonjs-and-the-global-object/
[amd]: http://requirejs.org/docs/whyamd.html
[requirejs]: http://requirejs.org/
[commonjs]: http://wiki.commonjs.org/wiki/CommonJS
[node]: http://nodejs.org/