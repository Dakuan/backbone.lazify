# Backbone.Lazify

<img src="http://i.giphy.com/4EhoSLz57nG8g.gif" width="100%" />

## Why do today what you can do tomorrow?

Sometimes you want to wait for things to calm down before invoking a function. Maybe you want to persist a value after a user has finished dragging around a color picker or some other rapid event. You don't want to keep hammering the server so you reach for underscores' [debounce method](http://underscorejs.org/#debounce). 

This module allows you to called debounced methods on your Backbone models (or other things if you wish) with a bit less boilerplate.

## Installation

```bash
$ npm install backbone.lazify
```

There's a bower package too but you'll want to work out how to build the `es6` modules yourself.

## Usage

You will need to mix the module into `Backbone.Model` to use across all models, or you can mixin to individual models if you so wish.

``` es6
import _ from "underscore";
import Backbone from "backbone";
import Lazify from "backbone.lazify";

_.extend(Backbone.Model.prototype, Lazify);

const LazyModel = Backbone.Model.extend({
  foo(day) {
    console.log(`why do today what you can do ${day}`);
  }
});

let exampleModel = new LazyModel();

exampleModel.foo("now"); // instantly prints 'why do today what you can do now'

exampleModel.lazy("foo", "tomorrow"); // prints 'why do today what you can do tomorrow' after 500ms of inactivity
```

You can override the default debounce time (500ms) on per method basis:

```es6
const LazyModel = Backbone.Model.extend({
  lazify: {
    foo: 10000
  },
  foo(day) {
    console.log(`why do today what you can do ${day}`);
  }
});

let exampleModel = new LazyModel();

exampleModel.foo("now"); // instantly prints 'why do today what you can do now'

exampleModel.lazy("foo", "tomorrow"); // prints 'why do today what you can do tomorrow' after 1000ms of inactivity
```
