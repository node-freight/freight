var fs = require('fs');
var rimraf = require('rimraf');
var exec = require('child_process').exec;
var assert = require('chai').assert;

var executable = 'node ' + __dirname + '/../bin/freight';
var currentDir = process.cwd();

describe('create', function () {
  var projectName = 'sample-project';

  before(function (done) {
    // go to the fixture project
    process.chdir(__dirname + '/fixtures/project1');
    // force project update
    var pkg = JSON.parse(fs.readFileSync('package.json'));
    // update project name
    pkg.name = pkg.name + Date.now();
    // write new project name
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    // clear node_modules for the sample project
    rimraf('node_modules', done);
  });

  after(function () {
    // force project update
    var pkg = JSON.parse(fs.readFileSync('package.json'));
    // set the old project name
    pkg.name = projectName;
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    process.chdir(currentDir);
  });

  it('should error and ask for password', function (done) {
    this.timeout(15000);

    exec(executable + ' create -u=http://localhost:8872 ',
      function (error, stdout, stderr) {
        assert.equal(stderr.substring(0, 55), 'To create bundles you need to provide a server password');
        assert.equal(stdout, '');
        done();
      });
  });

  it('should create a bundle and a bundle can be extracted', function (done) {
    this.timeout(15000);

    exec(executable + ' create -u http://localhost:8872 -p test',
      function (error, stdout, stderr) {
        assert.equal(stderr, '');
        var out =
          '************\n\n' +
          'Bundle does not exist for this project.\n' +
          'Freight Server will now generate a bundle.';
        assert.equal(stdout.substring(0, 96), out);

        setTimeout(function () {
          // extract bundle
          exec(executable + ' -u http://localhost:8872',
            function (error, stdout, stderr) {
              assert.equal(stderr, '');

              fs.exists('node_modules/inherits/package.json', function (exists) {
                assert.ok(exists);
                assert.ok(fs.existsSync('node_modules/rimraf/package.json'));
                assert.notOk(fs.existsSync('bower_components'));
                assert.notOk(fs.existsSync('bower.json'));
                assert.notOk(fs.existsSync('.bowerrc'));
                done();
              });
            });
        }, 4000);

      });
  });

});
