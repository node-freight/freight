# Freight
### Experimental Bundling Server for [NPM](https://www.npmjs.org/) and [Bower](http://bower.io/) 

![](http://v14d.com/freight/demo.gif)

### Demo

* Install `npm install -g freight` 
* Find a Freight Server to connect (such as the demo server at freight-demo.vf.io) 
* Run `freight --server http://freight.vf.io` in a project with `package.json` or `bower.json`.
* The Freight Server parses and bundles the dependencies for later use.
* Then anyone can run `freight --server http://freight.vf.io` within the project and get `node_modules` and `bower_components`.

See the [CLI README](/docs/readme.md) for detailed CLI options, environment variables and documentation.

See the [Server README](/freight-server/README.md) to help you setup a Freight Server.

### About

__Freight consists of two components: a super tiny command line tool and a hosted cache server.__


### Features

* Tiny command line tool with a speedy install. Uses a single [NPM](https://www.npmjs.org/) request.
* Works with `package.json` and `bower.json` dependencies and devDependencies.
* **No configuration files required**. However, configuration available via `package.json` or `bower.json`.
* Works great with continuous integration environments.
* [Grunt plugin](http://github.com/vladikoff/grunt-freight) to update and create bundles.

### Author

| [![twitter/vladikoff](https://avatars3.githubusercontent.com/u/128755?s=70)](https://twitter.com/vladikoff "Follow @vladikoff on Twitter") |
|---|
| [Vlad Filippov](http://vf.io/) |


### Release History
See the [CHANGELOG](CHANGELOG).
