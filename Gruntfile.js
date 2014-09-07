module.exports = function(grunt) {
  'use strict';

  var LINT_FILES = ['{,lib/**/,test/}*.js', 'bin/freight'];

  grunt.initConfig({
    jshint: {
      files: LINT_FILES,
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jscs: {
      src: LINT_FILES,
      options: {
        config: '.jscsrc'
      }
    }
  });

  grunt.registerTask('lint', 'lint all the things', [
    'jshint',
    'jscs'
  ]);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
};
