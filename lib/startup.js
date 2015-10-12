var path = require('path');
var fs = require('fs');
var url = require('url');

module.exports = function(log) {

  var manifest = require('./manifest')(log);
  var remote = require('./remote')(log);
  function Startup() {}

  Startup.log = function(options) {
    options = options || {};

    if (! options.log) {

      if (options.verbose) {
        log.setLevel(log.levels.DEBUG);
      } else {
        log.setLevel(log.levels.INFO);
      }

      if (options.silent) {
        log.setLevel(log.levels.SILENT);
        log.disabled = true;
      }
    }

    log.debug('Options:', options);
  };

  Startup.validate = function(options) {
    // if no --url set, try to fallback on env FREIGHT_URL
    var freightUrl = options.url || process.env.FREIGHT_URL;

    // throw an error if --url is not set
    if (!freightUrl) throw new Error('Server URL not set.');

    options.url = url.format(url.parse(freightUrl));
  };

  Startup.freightRequest = function(url, project, extra, options) {
    var start = Date.now();
    var manifestEnv = manifest.detectEnvironment(extra.projectDir);

    if (manifestEnv.bower) {
      var bowerData = manifest.getData(path.join(extra.projectDir, 'bower.json'));
      project.bower.dependencies = bowerData.dependencies;
      project.bower.devDependencies = bowerData.devDependencies;
      project.bower.resolutions = bowerData.resolutions;
      if (bowerData.name) {
        project.name = bowerData.name;
      }
      // get .bowerrc data
      if (fs.existsSync(path.join(extra.projectDir, '.bowerrc'))) {
        project.bower.rc = manifest.getData(path.join(extra.projectDir, '.bowerrc'));
      }
    }

    if (manifestEnv.npm) {
      var npmData = manifest.getData(path.join(extra.projectDir, 'package.json'));
      project.npm.dependencies = npmData.dependencies;
      project.npm.devDependencies = npmData.devDependencies;

      if (fs.existsSync(path.join(extra.projectDir, 'npm-shrinkwrap.json'))) {
        project.npm.shrinkwrap = manifest.getData(path.join(extra.projectDir, 'npm-shrinkwrap.json'));
      }

      if (npmData.name) {
        // NPM project name is used over Bower, unless we Bower only
        project.name = npmData.name;
      }
    }

    log.debug('Project Configuration:', project);
    log.debug('Server Configuration:', url);

    // check if this freight is available
    remote.freightCheck(url, project, extra)
      .then(
      function (freight) {
        // freight server response

        // if wanted to create, then don't download
        if (options.action === 'create') {
          // report the status
          return remote.freightStatus(freight, url, extra.create);
        } else {
          // else just want to download the bundle
          if (freight.available) {
            // download the Freight Bundle if available
            var downloadOpts = {
              production: extra.production
            };
            return remote.freightDownload(project.name, url, freight.hash, downloadOpts)
              .then(function (bundleFile) {
                return remote.freightExtract(bundleFile);
              }).then(function (bundleFile) {
                return remote.freightCleanup(bundleFile);
              }).then(function () {
                return remote.freightPostExtract();
              }).then(
              function () {
                return remote.freightDone(start);
              },
              function (err) {
                log.error(err);
                throw err;
              }
            );
          } else if (freight.available === false) {
            // otherwise freight is not available
            return remote.freightStatus(freight, url, extra.create);
          } else {
            // no response
            return remote.serverError(url);
          }
        }

      })
      .then(
        function (result) {
          log.debug('Freight request complete.');
          if (! options.server) {
            process.exit(0);
          }
        },
        function (err) {
          log.error(err);
          if (! options.server) {
            process.exit(1);
          }
        }
      );
  };

  /**
   * Detect if this is a production bundle request
   * @param {Object} options
   */
  Startup.detectProduction = function(options) {
    var production = false;

    if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
      production = true;
    }

    // CLI option overrides NODE_ENV
    if (options.production === false) {
      production = false;
    }

    if (options.production === true) {
      production = true;
    }

    return production;
  };

  return Startup;
};
