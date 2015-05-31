module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'
    name: "timepicker"

    sass:
      styles:
        options:
          bundleExec: true
          style: 'expanded'
          sourcemap: 'none'
        files:
          'styles/timepicker.css': 'styles/timepicker.scss'

    coffee:
      src:
        options:
          bare: true
        files:
          'lib/timepicker.js': [
            'src/timepicker.coffee'
            'src/*.coffee'
          ]
      spec:
        files:
          'spec/timepicker-spec.js': 'spec/timepicker-spec.coffee'

    umd:
      all:
        src: 'lib/timepicker.js'
        template: 'umd.hbs'
        amdModuleId: 'SimpleTimepicker'
        objectToExport: 'timepicker'
        globalAlias: 'timepicker'
        deps:
          'default': ['$', 'SimpleModule', 'SimpleDatepicker']
          amd: ['jquery', 'simple-module', 'simple-datepicker']
          cjs: ['jquery', 'simple-module', 'simple-datepicker']
          global:
            items: ['jQuery', 'SimpleModule', 'simple.datepicker']
            prefix: ''

    watch:
      styles:
        files: ['styles/*.scss']
        tasks: ['sass']
      spec:
        files: ['spec/**/*.coffee']
        tasks: ['coffee:spec']
      src:
        files: ['src/**/*.coffee']
        tasks: ['coffee:src', 'umd']
#      jasmine:
#        files: ['lib/**/*.js', 'spec/**/*.js']
#        tasks: 'jasmine'

    jasmine:
      test:
        src: ['lib/**/*.js']
        options:
          styles: 'styles/timepicker.css'
          specs: 'spec/timepicker-spec.js'
          vendor: [
            'vendor/bower/jquery/dist/jquery.min.js'
            'vendor/bower/moment/moment.js'
            'vendor/bower/simple-module/lib/module.js'
            'vendor/bower/jasmine-jquery/lib/jasmine-jquery.js'
          ]

  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-umd'

  grunt.registerTask 'default', ['sass', 'coffee', 'umd', 'watch']
  grunt.registerTask 'test', ['sass', 'coffee', 'umd']
