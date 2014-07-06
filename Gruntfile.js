module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    jshint: {
      files: ['{,lib/**/,test/}*.js', 'bin/freight'],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
};