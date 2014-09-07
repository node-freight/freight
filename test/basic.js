/*global describe, it*/

var exec = require('child_process').exec;
var assert = require('chai').assert;

var executable = 'node ' + __dirname + '/../bin/freight';

describe('cli', function () {

  it('should error with no url set', function (done) {
    exec(executable,
      function (error, stdout, stderr) {
        assert.ok(stderr);
        assert.notOk(stdout);
        done();
      });
  });

  it('should not error with url set', function (done) {
    exec(executable + ' -u=http://localhost:8872',
      function (error, stdout, stderr) {
        assert.equal(stderr, '');
        assert.ok(stdout);
        done();
      });
  });

  it('should not error with FREIGHT_URL set', function (done) {
    process.env.FREIGHT_URL = 'http://localhost:8872';
    exec(executable, function (error, stdout, stderr) {
      assert.equal(stderr, '');
      done();
    });
    process.env.FREIGHT_URL = null;
  });

  it('should be --silent', function (done) {
    exec(executable + ' -u=http://localhost:8872 --silent',
      function (error, stdout, stderr) {
        assert.equal(stderr, '');
        assert.equal(stdout, '');
        done();
      });
  });

  it('should be --silent', function (done) {
    exec(executable + ' -u=http://localhost:8872 --silent',
      function (error, stdout, stderr) {
        assert.equal(stderr, '');
        assert.equal(stdout, '');
        done();
      });
  });

  it('should show help at all cost', function (done) {
    exec(executable + ' -u=http://localhost:8872 -h',
      function (error, stdout, stderr) {
        assert.equal(stderr, '');
        assert.equal(stdout.substring(0, 15), 'Freight Actions');
        done();
      });
  });

  it('should show verbose output', function (done) {
    exec(executable + ' -u=http://localhost:8872 --verbose',
      function (error, stdout, stderr) {
        assert.equal(stderr, '');
        assert.equal(stdout.substring(0, 7), 'Options');
        done();
      });
  });

});
