var fs = require('fs');
var rimraf = require('rimraf');
var exec = require('child_process').exec;
var assert = require('chai').assert;

var executable = 'node ' + __dirname + '/../bin/freight';
var currentDir = process.cwd();

describe('flow', function () {
  var projectName = 'sample-project';

  beforeEach(function (done) {
    // go to the fixture project
    process.chdir(__dirname + '/fixtures/project2');
    // force project update
    var pkg = JSON.parse(fs.readFileSync('package.json'));
    // update project name
    pkg.name = pkg.name + Date.now();
    // write new project name
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    // clear node_modules for the sample project
    rimraf('node_modules', function () {
      rimraf('app', done);
    });
  });

  afterEach(function () {
    // force project update
    var pkg = JSON.parse(fs.readFileSync('package.json'));
    // set the old project name
    pkg.name = projectName;
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    process.chdir(currentDir);
  });

  it('should extract a full bundle with bower and npm', function (done) {
    this.timeout(20000);

    exec(executable + ' create -u http://localhost:8872 -p test',
      function (error, stdout, stderr) {
        assert.equal(stderr, '');
        console.log(stdout);

        var bundleReady = function () {
          exec(executable + ' -u http://localhost:8872',
            function (error, stdout, stderr) {
              assert.equal(stderr, '');

              fs.exists('node_modules/inherits/package.json', function (exists) {
                if (!exists) {
                  setTimeout(function () {
                    bundleReady();
                  }, 2000);
                } else {
                  assert.ok(exists, 'inherits should exist');
                  assert.ok(fs.existsSync('node_modules/rimraf/package.json'), 'rimraf should exist');
                  assert.notOk(fs.existsSync('bower_components'), 'wrong bower dir');
                  assert.ok(fs.existsSync('app/bower_components/normalize.css/bower.json'), 'normalize should exist');
                  assert.ok(fs.existsSync('app/bower_components/sinon/index.js'), 'sinon should exist');
                  assert.ok(fs.existsSync('app/bower_components/p/p.js'), 'p should exist');
                  assert.notOk(fs.existsSync('app/bower_components/bower.json'), 'bower.json wrong');
                  assert.ok(fs.existsSync('bower.json'), 'keep the original bower.json');
                  assert.ok(fs.existsSync('.bowerrc'), 'keep the original .bowerrc');
                  done();
                }
              });
            });
        };

        bundleReady();

      });
  });

  it('should extract a production bundle', function (done) {
    this.timeout(20000);

    exec(executable + ' create -u http://localhost:8872 -p test',
      function (error, stdout, stderr) {
        assert.equal(stderr, '');

        var bundleReady = function () {
          exec(executable + ' -u http://localhost:8872 --production',
            function (error, stdout, stderr) {
              assert.equal(stderr, '');

              fs.exists('node_modules/inherits/package.json', function (exists) {
                if (!exists) {
                  setTimeout(function () {
                    bundleReady();
                  }, 2000);
                } else {
                  assert.ok(exists, 'npm module inherits should exist');
                  assert.notOk(fs.existsSync('node_modules/rimraf/package.json'), 'rimraf should not exist');
                  assert.notOk(fs.existsSync('bower_components'), 'wrong bower component directory');
                  assert.ok(fs.existsSync('app/bower_components/normalize.css/bower.json'), 'normalize should exist');
                  assert.notOk(fs.existsSync('app/bower_components/sinon/index.js'), 'sinon should not exist in prod');
                  assert.ok(fs.existsSync('app/bower_components/p/p.js'));
                  assert.notOk(fs.existsSync('app/bower_components/bower.json'));
                  assert.ok(fs.existsSync('bower.json'));
                  assert.ok(fs.existsSync('.bowerrc'));
                  done();
                }
              });
            });
        };

        bundleReady();
      });
  });

});
