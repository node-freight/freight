var fs = require('fs');

var request = require('../modules/request');
var progress = require('../modules/progress');
var P = require('../modules/p-promise/p');

module.exports = function(log) {

  function Manifest() {}

  Manifest.detectEnvironment = function() {
    log.debug('Detecting Environment');

    return {
      bower: fs.existsSync('bower.json'),
      npm: fs.existsSync('package.json')
    }
  };

  Manifest.getData = function(jsonFilePath) {
    var raw = fs.readFileSync(jsonFilePath);
    var data = null;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      log.error('Failed to parse', jsonFilePath);
      throw e;
    }

    return data;
  };

  return Manifest;
};
