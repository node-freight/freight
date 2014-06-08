module.exports = function(log) {

  function Startup() {}

  Startup.log = function(options) {
    options = options || {};

    if (options.verbose) {
      log.setLevel(log.levels.DEBUG);
    } else {
      log.setLevel(log.levels.INFO);
    }

    if (options.silent) {
      log.setLevel(log.levels.SILENT);
      log.disabled = true;
    }

    log.debug('Options:', options);
  };

  Startup.validate = function(options) {
    // if no --url set, try to fallback on env FREIGHT_URL
    if(!options.url) {
      options.url = require('url').format(process.env.FREIGHT_URL);
    }

    // throw an error if --url is not set
    if (!options.url) {
      log.error('NOTE: Set server URL with "--url=http://example.com" or FREIGHT_URL=http://example.com');
      throw new Error('Server URL not set.');
    }
  };

  return Startup;
};
