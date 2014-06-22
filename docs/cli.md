# Freight CLI Documentation

The Freight CLI has several commands and most of them interact with a [Freight Server](https://github.com/vladikoff/freight-server).
You must either [setup a Freight Server]() or use one that already exists. 

## Installation

Install the Freight command line utility. Might require `sudo` depending on your system setup.

```
npm install -g vladikoff/freight 
```

This will download the Freight CLI from GitHub, avoiding NPM. 
It is advised to download the CLI independent of NPM.

After you're done downloading the CLI, setup the default `FREIGHT_URL` environment variable:
```
export FREIGHT_URL=http://freight-server.example
```

You can always specify a custom server using the `--url` or `-u` option. 

**All documentation below assumes that you have `FREIGHT_URL` set.**

## Downloading Bundles

To download a bundle simply open a project that has a `package.json` or `bower.json` in the terminal and run:
```
FREIGHT_URL=http://freight-server.example freight
```

If the bundle exists on the server and the dependencies match, then Freight will download the bundle and extract it.

## Authenticated Actions

Using the `freight track` and `freight create` commands you can tell the server to initialize a project bundle.
These actions require server authentication to avoid unauthorized bundles.
The Freight password is configured on the server, you can learn more about this password in the [server documentation]().

Use the `FREIGHT_PASSWORD` environment variable to avoid password prompts.
Set it using:
```
export FREIGHT_PASSWORD=your_password
```
Use different passwords using instead of the default one:
```
FREIGHT_PASSWORD=your_password freight command_here
```

### Track Repositories

Track your `master` branch:

``` 
freight track https://github.com/vladikoff/freight.git 
```

Track other branches:

``` 
freight track https://github.com/vladikoff/freight.git development
```

### Create Bundles Manually

From a project directory with a `package.json` or a `bower.json`.

``` 
freight create -u http://freight-server.example
```

### Continuous integration

Setting up Freight on CI environments is not complicated. 
It works the same way as the [downloading bundles](/cli.html#downloading-bundles) section.

In your `.travis.yml`:
```
 freight -u http://freight.dev.lcip.org
 
```

### CLI Options

All available command line options are listed below:

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
