/*global describe, it, beforeEach, afterEach*/
var fs = require('fs');
var exec = require('child_process').exec;
var assert = require('chai').assert;

var executable = 'node ' + __dirname + '/../bin/freight';

describe('bower error', function () {
  var currentDir = process.cwd();
  var projectName = 'sample-bower-error-project';

  beforeEach(function (done) {
    process.env.FREIGHT_PASSWORD = null;
    // go to the fixture project
    process.chdir(__dirname + '/fixtures/projectbowererror');
    // force project update
    var pkg = JSON.parse(fs.readFileSync('bower.json'));
    // update project name
    pkg.name = pkg.name + Date.now();
    // write new project name
    fs.writeFileSync('bower.json', JSON.stringify(pkg, null, 2));
    done();
  });

  afterEach(function () {
    // force project update
    var pkg = JSON.parse(fs.readFileSync('bower.json'));
    // set the old project name
    pkg.name = projectName;
    fs.writeFileSync('bower.json', JSON.stringify(pkg, null, 2));
    process.chdir(currentDir);
  });

  it('it should not generate blank bundles', function (done) {
    this.timeout(20000);
    process.env.FREIGHT_PASSWORD = 'test';

    exec(executable + ' create -u http://localhost:8872',
      function (error, stdout, stderr) {
        assert.equal(stderr, '');

        var bundleReady = function () {
          exec(executable + ' -u http://localhost:8872',
            function (error, stdout, stderr) {
              assert.equal(stderr, '');
              assert.isTrue(stdout.indexOf('Bundle does not exist for this project') > 0);
              done();
            });
        };

        // wait for bundle install
        setTimeout(function () {
          bundleReady();
        }, 7000);
      });
  });

});
