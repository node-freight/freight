# Freight [![Build Status][travis-image]][travis-url] [![Downloads][downloads-image]][npm-url]

<img align="right" src="http://v14d.com/freight/freight-logo.png" height="250" />

> Dependency Bundles for [NPM](https://www.npmjs.org/) and [Bower](http://bower.io/)

Freight helps you:
* Bundle all your dependencies into a compressed archive.
* Avoid committing dependencies into project source.
* Speed up project and dependency installation.
* Speed up continuous integration and deployment.
* Stop relying on NPM and Bower registries.
* Avoid dependency installation issues during deployment.

Freight consists of two components - a tiny command line tool
 and a [Freight Server](https://github.com/vladikoff/freight-server) that manages the dependencies.

### Try it out

Install `npm install -g freight`.

Get the sample project:

`git clone https://github.com/vladikoff/freight-sample.git && cd freight-sample`

Run `freight -u http://freight.vf.io`, you will now have the NPM and Bower modules!

### Visual Demo

![](http://v14d.com/freight/demo.gif)

### How it works

![](http://v14d.com/freight/how-it-works.jpg)

__See the [Freight Documentation](docs/cli.md).__
 
__See the [Freight Server README](https://github.com/vladikoff/freight-server) to help you setup a Freight Server.__

Freight by default supports:
* `npm-shrinkwrap.json`, `.bowerrc`
* `--production` only bundles

### Author

| [![twitter/vladikoff](https://avatars3.githubusercontent.com/u/128755?s=70)](https://twitter.com/vladikoff "Follow @vladikoff on Twitter") |
|---|
| [Vlad Filippov](http://vf.io/) |


### Release History
See the [CHANGELOG](CHANGELOG).

[downloads-image]: http://img.shields.io/npm/dm/freight.svg
[npm-url]: https://npmjs.org/package/freight
[npm-image]: http://img.shields.io/npm/v/freight.svg

[travis-url]: https://travis-ci.org/vladikoff/freight
[travis-image]: http://img.shields.io/travis/vladikoff/freight.svg
