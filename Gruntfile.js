// Generated on 2016-09-11 using generator-angular 0.15.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {});

    // Configurable paths for the application
    var appConfig = {
        pkg: grunt.file.readJSON('package.json'),
        bwr: grunt.file.readJSON('bower.json'),
        dist: 'dist',
        tmp: '.tmp'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: appConfig,

        // Make sure there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.bwr.appPath %>/{,*/}*.js'
                ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Make sure code styles are up to par
        jscs: {
            options: {
                config: '.jscsrc'
            },
            all: {
                src: [
                    '!Gruntfile.js',
                    '<%= yeoman.bwr.appPath %>/{,*/}*.js'
                ]
            },
            test: {
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= yeoman.tmp %>',
                        '<%= yeoman.dist %>/{,*/}*',
                        '!<%= yeoman.dist %>/.git{,*/}*'
                    ]
                }]
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.bwr.appPath %>',
                    src: ['{,*/}*.js'],
                    dest: '<%= yeoman.tmp %>/src'
                }]
            }
        },

        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: ['<%= yeoman.tmp %>/src/{,*/}*.js'],
                dest: '<%= yeoman.tmp %>/concat/src/<%= yeoman.pkg.name %>.js'
            }
        },

        header: {
            dist: {
                options: {
                    text: '(function(){\n'
                },
                files: {
                    '<%= yeoman.tmp %>/concat/src/<%= yeoman.pkg.name %>.js': '<%= yeoman.tmp %>/concat/src/<%= yeoman.pkg.name %>.js'
                }
            }
        },

        footer: {
            dist: {
                options: {
                    text: '\n})();'
                },
                files: {
                    '<%= yeoman.tmp %>/concat/src/<%= yeoman.pkg.name %>.js': '<%= yeoman.tmp %>/concat/src/<%= yeoman.pkg.name %>.js'
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= yeoman.pkg.name %> - v<%= yeoman.pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            dist: {
                files: {
                    '<%= yeoman.dist %>/<%= yeoman.pkg.name %>.min.js': ['<%= yeoman.tmp %>/concat/src/<%= yeoman.pkg.name %>.js']
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.tmp %>/concat/src',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.js'
                    ]
                }]
            }
        }
    });

    grunt.registerTask('build', [
        'clean:dist',
        'ngAnnotate:dist',
        'concat:dist',
        'header:dist',
        'footer:dist',
        'uglify:dist',
        'copy:dist'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'newer:jscs',
        'build'
    ]);
};