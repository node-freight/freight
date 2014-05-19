/**
 * This is a tester file to play around with different compression libs.
 */
var targz = require('../../modules/targz/targz');
//var archiver = require('archiver');


var filePath = '../../../freight-server/storage/targz-generated8e3aa4fc3bc95bcdc2288dd1acd38a95.tar.gz';
var filePath = '../../../freight-server/storage/a5878a070500d298b060e69dccd0ca2c.tar';
var filePath = '../../../freight-server/storage/gzd-a5878a070500d298b060e69dccd0ca2c.tar.gz';
/*
var extractStart = Date.now();
var start = Date.now();

new targz().extract(filePath, 'output/', function (err) {
  var end = Date.now();

  if (err) {
    console.log('Extraction Failed');
    console.log(err);
  }
  console.log('Extraction complete in ', (end - extractStart) / 1000, 'seconds');
  console.log('Extraction Complete. Freight is done in', (end - start) / 1000, 'seconds');
  console.log('Removing', filePath);

});
*/


var tar = require('tar-fs');
var fs = require('fs');
var zlib = require('zlib');

var extractStart = Date.now();
// extracting a directory
fs.createReadStream(filePath)
  .pipe(zlib.Unzip())
  .pipe(tar.extract('my-other-directory'))
  .on('finish', function() {
    var end = Date.now();
    console.log('Extraction complete in ', (end - extractStart) / 1000, 'seconds');
  });

