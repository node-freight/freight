var fs = require('fs');
var path = require('path');

var log = require('./modules/loglevel');

module.exports = function () {

  function Freight() {}

  Freight.init = function (options) {
    if (options.log) {
      log = options.log;
    }

    var startup = require('./lib/startup')(log);
    var track = require('./lib/track')(log);
    var password = require('./lib/password')(log);

    // set logging
    startup.log(options);
    // validate input
    startup.validate(options);

    var url = options.url;
    // the information that is needed to get stuff bundled!
    var extra  = {
      create: false,
      track: false,
      force: false,
      // Kue priority
      priority: options['queue-priority'] || 'normal',
      // request to get a production only bundle
      production: options.production || false,
      projectDir: options.directory || '.'
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

    // if action is to create a bundle
    if (options.action === 'create') {
      extra.create = true;

      if (options.force) {
        log.debug('Force bundle.');
        extra.force = true;
      }

      return password().then(function(password) {
        extra.password = password;
        return startup.freightRequest(url, project, extra, options);
      });
    }
    // if action is to hook a git repository
    else if (options.action === 'track') {
      extra.track = true;

      return password()
        .then(function(password) {
          extra.password = password;
          return track.request(url, project, extra, options);
        })
        .then(
          function (result) {
            log.debug('Freight request complete.');
            if (!options.server) {
              process.exit(0);
            }
          },
          function (err) {
            log.error(err);
            if (!options.server) {
              process.exit(0);
            }
          }
        );
    } else {
      return startup.freightRequest(url, project, extra, options);
    }

  };

  return Freight;
};
