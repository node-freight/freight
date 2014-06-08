# Freight [![Build Status](https://travis-ci.org/vladikoff/freight.svg?branch=master)](https://travis-ci.org/vladikoff/freight)

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

See the [Freight Server README](https://github.com/vladikoff/freight-server) to help you setup a Freight Server. 

#### Create bundles
Freight Server saves `node_modules` and `bower_components` into compressed `tar.gz` bundles.
The bundles are created based on your `package.json` and `bower.json`, using the `--create` command. This action requires
the [server password](https://github.com/vladikoff/freight-server/blob/master/README.md#configure). You can use `--force` to
recreate the bundle.

Run the command below from a project directory with a `package.json` or `bower.json` file:
```
freight -u http://YOUR_SERVER.com --create -p=SERVER_PASSWORD
************

Bundle does not exist for this project.
Freight Server will now generate a bundle.
Monitor your Freight at http://YOUR_SERVER.com/freights/active

************
```

#### Download bundles 
You can monitor created and queued bundles using the web interface available at http://YOUR_SERVER.com. The web interface is
protected with the same Freight [server password](https://github.com/vladikoff/freight-server/blob/master/README.md#configure). 

To download the bundle that was created earlier just use the `freight -u=http://YOUR_SERVER.com` command from the project directory. This will extract `node_modules` and `bower_components` from the bundle.
```
$ freight -u http://YOUR_SERVER.com
Downloading bundle: ||||||||||||||||||| 100% 0.0s 4.2 MB
Extracting bundle...
Freight is done in 3.613 seconds.
```

### CLI Options
```
$ freight --help
Freight Actions:

get
 Default action. Download and extract bundle for the current project directory. 
 Usage: `freight -u http://example.com`

create
 Create a bundle for the current project directory on a remote server. Requires password. 
 Usage: `freight create -u http://example.com -p PASSWORD`

track
 Track a remote repository for dependency changes. Freight will automatically create bundles. 
 Usage: `freight track git@github.com:user/repo.git -u=http://example.com -p=PASSWORD`

Freight Flags:

--help
 -h Display help.

--url
 -u Freight Server URL. Example: "http://example.com"

--production
  Download production required bundle only.

--verbose
 -v Verbose mode. A lot more information output.

--version
 -V Display Freight CLI version.

--password
 -p Remote Freight Server password to create Freight bundles.

--force
 -f A way to force create a bundle. Requires password and create commands.

--silent
  No output.

```

### Server Dashboard

![](http://v14d.com/freight/freight-server-view.jpg)

### Author

| [![twitter/vladikoff](https://avatars3.githubusercontent.com/u/128755?s=70)](https://twitter.com/vladikoff "Follow @vladikoff on Twitter") |
|---|
| [Vlad Filippov](http://vf.io/) |


### Release History
See the [CHANGELOG](CHANGELOG).
