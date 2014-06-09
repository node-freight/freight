var fs = require('fs');
var path = require('path');

var log = require('./modules/loglevel');

var startup = require('./lib/startup')(log);
var track = require('./lib/track')(log);

module.exports = function () {

  function Freight() {}

  Freight.init = function (options) {

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
      if (!options.password) {
        log.error('To create bundles you need to provide a server password for', options.url);
        throw new Error('Password not set. It is required to authenticate with the server.');
      }

      extra.create = true;
      extra.password = options.password;

      if (options.force) {
        log.debug('Force bundle.');
        extra.force = true;
      }

      return startup.freightRequest(url, project, extra, options);
    }
    // if action is to hook a git repository
    else if (options.action === 'track') {
      if (!options.password) {
        log.error('To track git repositories you need to provide a server password for', options.url);
        throw new Error('Password not set. It is required to authenticate with the server.');
      }

      extra.track = true;
      extra.password = options.password;
      return track.request(url, project, extra, options);
    } else {
      return startup.freightRequest(url, project, extra, options);
    }

  };

  return Freight;
};
