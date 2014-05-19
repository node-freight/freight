<p align="center"><img src="http://v14d.com/freight/freight-250.png" height="100" /></p>
# Freight
### Experimental Bundling Server for [NPM](https://www.npmjs.org/) and [Bower](http://bower.io/)

![](http://v14d.com/freight/demo.gif)

### Try it out

Install `npm install -g freight`.

Get the sample project:

`git clone https://github.com/vladikoff/freight-sample.git && cd freight-sample`

Run `freight -u http://freight.vf.io`, you will now have the NPM and Bower modules!

### About

__Freight consists of two components: a super tiny command line tool and a hosted cache server.__

![](http://v14d.com/freight/how-it-works.jpg)

See the [Server README](https://github.com/vladikoff/freight-server) to help you setup a Freight Server.

### Features

* Tiny command line tool with a speedy install. Uses one [NPM](https://www.npmjs.org/) module request.
* Works with `package.json` and `bower.json` dependencies and devDependencies.
* **No configuration files required**.
* Works great with continuous integration environments.
* Dashboard to manage bundle files and bundle queues:
![](http://v14d.com/freight/freight-server-view.jpg)

### CLI Options
```
$ freight --help

--help
 -h Display help.

--url
 -u Freight Server URL. Example: "http://example.com"

--verbose
 -v Verbose mode. A lot more information output.

--create
 -c Create a bundle on a remote server. Requires password.

--password
 -p Remote Freight Server password to create Freight bundles.

--force
 -f A way to force create a bundle. Requires password and create commands.

--silent
  No output.
```

### Author

| [![twitter/vladikoff](https://avatars3.githubusercontent.com/u/128755?s=70)](https://twitter.com/vladikoff "Follow @vladikoff on Twitter") |
|---|
| [Vlad Filippov](http://vf.io/) |


### Release History
See the [CHANGELOG](CHANGELOG).
