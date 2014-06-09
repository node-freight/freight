var exec = require('child_process').exec;
var assert = require('chai').assert;

var executable = 'node ' + __dirname + '/../bin/freight';

describe('track', function () {

  it('should ask for a password', function (done) {
    var cmd = executable + ' track https://github.com/vladikoff/freight-sample.git -u http://localhost:8872';

    exec(cmd,
      function (error, stdout, stderr) {
        assert.equal(error.toString().substring(0, 48), 'Error: Command failed: To track git repositories');
        assert.notOk(stdout);
        done();
      });
  });

  it('should error if no repository set', function (done) {
    var cmd = executable + ' track -u http://localhost:8872 -p test';

    exec(cmd,
      function (error, stdout, stderr) {
        assert.ok(stderr);
        assert.notOk(stdout);
        done();
      });
  });

  it('should start tracking a repository', function (done) {
    var cmd = executable + ' track https://github.com/vladikoff/freight-sample.git -p test -u http://localhost:8872';
    console.log(cmd);

    exec(cmd,
      function (error, stdout, stderr) {
        assert.notOk(stderr);
        assert.ok(stdout);
        console.log(stdout);
        done();
      });
  });

});
