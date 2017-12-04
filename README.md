
# NOTE

* Update 'package.json' to remove unused modules in this base
* Update README for other developers to read and jump into the project

# Nodejs web app

A [https://nodejs.org/](https://nodejs.org/) web app base template

* [Express 4.x](http://expressjs.com/)
* [Mongoose](https://github.com/Automattic/mongoose) for working with MongoDB database
* [Swig](http://paularmstrong.github.io/swig/). Its not maintained now, [see here](https://github.com/paularmstrong/swig/issues/628)
* [Bluebird](bluebirdjs.com). ES2015 Promises and Generator for async executions

## Promises

Strive to use promises everywhere, mostly for function that will be called in controllers.

Mixing promises and callbacks is a big anti-pattern, just think in promises and use [.asCallback](http://bluebirdjs.com/docs/api/ascallback.html) handle the mapping to callback equivalent at the end. Some libraries like Passport is not using Promises yet, so we will need to use callback to return. 

See [Thinking in promises](docs/thinking-in-promises.md)

# How to use

* Fork or/and clone
* '$ npm install'
* '$ bower install'
* '$ npm start'
* See **NOTE** above

# TODO

* Security
* Build Controller
* Change swig or not

# Contributions

Contributions are welcome
