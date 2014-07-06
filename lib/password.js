var read = require('../modules/read');
var P = require('../modules/p-promise/p');

module.exports = function(log) {

  return function() {
    var defer = P.defer();

    if (process.env.FREIGHT_PASSWORD) {
      return P(process.env.FREIGHT_PASSWORD);
    }

    read({ prompt: 'Freight Server Password: ', silent: true }, function(err, password) {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve(password);
      }
    });
    return defer.promise;
  };
};
