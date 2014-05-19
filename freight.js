var fs = require('fs');


var log = require('./modules/loglevel');

var remote = require('./lib/remote')(log);
var manifest = require('./lib/manifest')(log);


module.exports = function () {

  function Freight() {}

  Freight.init = function (options) {
    options = options || {};
    var start = Date.now();

    if (options.verbose) {
      log.setLevel(log.levels.DEBUG);
    } else {
      log.setLevel(log.levels.INFO);
    }

    if (options.silent) {
      log.setLevel(log.levels.SILENT);
      log.disabled = true;
    }

    if(!options.url) {
      options.url = require('url').format(process.env.FREIGHT_URL);
    }

    if (!options.url) {
      log.error('NOTE: Set server URL with "--url=http://example.com" or FREIGHT_URL=http://example.com');
      throw new Error('Server URL not set.');

    }


    log.debug('Detecting Environment');

    var manifestEnv = manifest.detectEnvironment();
    var url = options.url;
    // the information that is needed to get stuff bundled!
    var extra  = {
      create: false,
      force: false,
      priority: options['queue-priority'] || 'normal'
    };
    var project = {
      name: 'noname',

      npm: {
        dependencies: {},
        devDependencies: {}
      },
      bower: {
        dependencies: {},
        devDependencies: {},
        resolutions: {}
      },
      bowerrc: {}
    };

    if (options.create) {
      if (!options.password) {
        log.error('To create bundles you need to provide a server password for', options.url);
        throw new Error('Password not set.');
      }

      extra.create = true;
      extra.password = options.password;

      if (options.force) {
        log.debug('Force creating bundle.');
        extra.force = true;
      }
    }

    if (manifestEnv.bower) {
      var bowerData = manifest.getData('bower.json');
      project.bower.dependencies = bowerData.dependencies;
      project.bower.devDependencies = bowerData.devDependencies;
      project.bower.resolutions = bowerData.resolutions;
      if (bowerData.name) {
        project.name = bowerData.name;
      }
      // get .bowerrc data
      if (fs.existsSync('.bowerrc')) {
        project.bowerrc = manifest.getData('.bowerrc');
      }
    }

    if (manifestEnv.npm) {
      var npmData = manifest.getData('package.json');
      project.npm.dependencies = npmData.dependencies;
      project.npm.devDependencies = npmData.devDependencies;

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
        if (extra.create) {
          // report the status
          return remote.freightStatus(freight, url, extra.create);
        }
        // else just want to download the bundle
        else {
          if (freight.available) {
            // download the Freight Bundle if available
            return remote.freightDownload(project.name, url, freight.hash)
              .then(
              function (filePath) {
                return remote.freightExtract(filePath, start)
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
        function (result) {},
        function (err) {
          log.error(err);
          throw err;
        }
      );

  };

  return Freight;
};
