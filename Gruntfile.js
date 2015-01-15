module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    concat: {
      js: {
        src: ['src/js/*.js'],
        dest: 'dist/jquery.grideditor.js',
      },
    },
    
    uglify: {
      build: {
        options: {
          sourceMap: true,
        },
        src: 'src/js/*.js',
        dest: 'dist/jquery.grideditor.min.js',
      }
    },
    
    less: {
      development: {
        files: [{
            cwd: 'src/less/', 
            src: [
              '*.less'
            ],
            dest: 'dist/',
            ext: '.css',
            expand: true,
        }]
      }
    },
    
    cssmin: {
      development: {
        files: {
          'dist/grideditor.min.css' : ['dist/grideditor.css'],
        }
      }
    },
    
    watch: {
      stylesheets: {
        files: ['src/**/*', 'example/*'],
        tasks: ['concat:js', 'uglify', 'less'],
        options: {
          spawn: false,
          livereload: true,
        },
      },
    },
    
  });

  grunt.registerTask('default', ['concat:js', 'uglify', 'less']);

};