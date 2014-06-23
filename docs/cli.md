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
The Freight password is configured on the server, you can learn more about this password in 
 the [server documentation](https://github.com/vladikoff/freight-server/blob/master/README.md).

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
freight track https://github.com/vladikoff/freight.git -b development
```

### Create Bundles Manually

From a project directory with a `package.json` or a `bower.json`.

``` 
freight create
```

### Continuous integration

Setting up Freight on CI environments is easy and works the same way as downloading bundles. 
If you want to use Freight with Travis CI, then edit your `.travis.yml`, add these commands in the `before_install` step:
```
- FREIGHT_URL=http://freight-server.example
- npm install -g vladikoff/freight
- freight
```

If your Freight Server is down or the bundle is missing, then Freight will still exit with status code `0`.
This way the build won't fail and the CI will fallback to NPM or Bower registries.

### CLI Options

All available command line options are listed below:

```
$ freight --help
Freight Actions:

get
 Default action. Download the bundle for the current project. Setting `get` is optional. 
 Usage: `freight`

create
 Create a bundle for the current project directory on a remote server. Requires password. 
 Usage: `freight create`

track
 Track a remote repository for dependency changes.
 Freight will automatically create bundles. `master` branch by default. 
 Usage: `freight track https://github.com:user/repo.git [-b branch]`

Freight Flags:

--help
 -h Display help.

--url
 -u Freight Server URL. Example: "-u=http://example.com"

--production
  Download production required bundle only.

--directory
  Optional path to project.

--verbose
 -v Verbose mode. A lot more information output.

--version
 -V Display Freight CLI version.

--force
 -f A way to force create a bundle. Requires password and create commands.

--silent
  No output.
```
