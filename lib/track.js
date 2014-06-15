var request = require('../modules/request');
var P = require('../modules/p-promise/p');

module.exports = function(log) {

  function Track() {}

  Track.request = function(url, project, extra, options) {
    var defer = P.defer();
    // make sure repository is set in the options
    if (options.actionParams.length == 0) {
      return P.reject(new Error('Specify the repository to track'));
    }
    log.info('Trying to setup Freight tracking:', options.actionParams[0]);
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
        if (resp.statusCode === 200) {
          defer.resolve(body);
        } else {
          defer.reject(new Error(resp.statusCode + ' ' + body));
        }
      }
    });
    return defer.promise;
  };

  return Track;
};