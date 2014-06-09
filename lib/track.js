var request = require('../modules/request');
var P = require('../modules/p-promise/p');

module.exports = function(log) {

  function Track() {}

  Track.request = function(url, project, extra, options) {
    // make sure repository is set in the options
    if (options.actionParams.length == 0) {
      throw new Error('Specify the repository to track');
    }

    log.info('Setting up tracking for', options.actionParams[0]);
    var defer = P.defer();
    var data = {
      repository: options.actionParams[0],
      password: extra.password
    };
    log.debug('Tracking data', data);

    request({
      url: url + 'freight/track',
      method: 'POST',
      form: data,
      json: true
    }, function (err, resp, body) {
      if (err) {
        log.error('Freight failed to connect to', url);

        defer.reject(err);
      } else {
        log.debug('Response:', body);
        defer.resolve(body);
      }
    });

  };

  return Track;
};
