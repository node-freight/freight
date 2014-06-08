var fs = require('fs');

var request = require('../modules/request');
var progress = require('../modules/progress');
var tar = require('../modules/tar-fs/index');
var zlib = require('zlib');

var exec = require('child_process').exec;
var P = require('../modules/p-promise/p');

module.exports = function(log) {

  function Remote() {}

  Remote.freightCheck = function(server, project, extra) {
    var defer = P.defer();
    var checkUrl = server + 'freight/check';
    var data = {
      project: project,
      extra: extra
    };

    request({
      url: checkUrl,
      method: 'POST',
      form: data,
      json: true
    }, function (err, resp, body) {
      if (err) {
        log.error('Freight failed to connect to', server);

        defer.reject(err);
      } else {
        log.debug('Response:', body);
        defer.resolve(body);
      }
    });

    return defer.promise;
  };

  Remote.freightDownload = function(name, server, hash) {
    var defer = P.defer();
    var downloadName = 'freight_download_' +  Date.now() + '.tar.gz';
    var bar;

    request
      .post(server + 'freight/download')
      .form({ hash: hash, name: name })
      .on('response', function (res) {
        if (res.statusCode !== 200) {
          throw new Error('Failed to download Freight.');
        } else {
          var len = parseInt(res.headers['content-length'], 10);
          var filesize = require('../modules/file-size');
          var progressOutput = 'Downloading bundle: :bar :percent :etas ' ;
          progressOutput += filesize(len).human({ si: true });
          if (!log.disabled) {
            // TODO: this might not be silent.
            bar = new progress(progressOutput, {
              complete: '|',
              incomplete: ' ',
              width: 20,
              total: len
            });
          }
        }

      })
      .on('data', function (data) {
        if (!log.disabled) {
          bar.tick(data.length);
        }
      })
      .on('error', function (err) {
        defer.reject(err);
      })
      .on('end', function () {
      })
      .pipe(fs.createWriteStream(downloadName))
      .on('close', function (err) {
        if (err) {
          defer.reject(err);
        } else {
          defer.resolve(downloadName);
        }
      });

    return defer.promise;
  };

  Remote.freightExtract = function(filePath, start) {
    var defer = P.defer();
    var extractStart = new Date();

    log.info('Extracting bundle...');
    log.debug('Working directory', process.cwd());

    fs.createReadStream(filePath)
      .pipe(zlib.Unzip())
      .pipe(tar.extract('.'))
      .on('error', function(err) {
        log.error('Extraction Failed');
        log.error(err);
        throw defer.reject(err);
      })
      .on('finish', function() {
        var end = Date.now();

        log.debug('Extraction complete in', (end - extractStart) / 1000, 'seconds.');
        log.debug('Removing', filePath);

        fs.unlink(filePath, function(err) {
          if (err) {
            log.error('Failed to delete', filePath);
            log.error(err);
            defer.reject(err);
          } else {
            log.info('Freight is done in', (end - start) / 1000, 'seconds.');
            defer.resolve(filePath);
          }
        });

      });

    return defer.promise;
  };

  Remote.freightStatus = function(freight, url, wantedCreate) {
    log.info('************\n');
    if (freight.available) {
      log.info('Bundle exists for this project.');
    } else {
      log.info('Bundle does not exist for this project.');
    }

    if (freight.creating) {
      log.info('Freight Server will now generate a bundle.');
      // TODO: can or cannot monitor? block queue but allow?
      log.info('Monitor your Freight at', url + 'freights/active');
    } else {

      if (wantedCreate && !freight.creating) {
        if (freight.available && freight.authenticated) {
          log.error('To recreate the bundle use --force.');
        } else {
          log.error('Wrong Freight Server password.');
        }

      } else {
        log.info('To create run: \n freight create -u=' + url + ' -p=PASSWORD');
      }
    }

    log.info('\n************');
    return P();
  };

  Remote.serverError = function(server) {
    log.info('************');
    log.info('Freight Server not found at', server);
    log.info('************');
    return P();
  };

  return Remote;
};
