// Generated on 2013-08-12 using generator-angular 0.3.1
'use strict';

var SERVER_PORT = 9999;
var OPEN_TO_THE_WORLD = false;

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings
        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || 'app',
            bower: require('bower-config').read('').directory || 'app/bower_components',
            dist: 'dist',
            target: 'target',
            test: 'test'
        },

        options: {
            apiUrl: {
                dev: 'http://127.0.0.1:8087/dmp/',
                prod: '/dmp/'
            },
            dmpProjectDir : process.env.DMP_HOME || '../../data-management-platform'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= yeoman.app %>/scripts/**/*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            jsTest: {
                files: ['<%= yeoman.test %>/spec/**/*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            less: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.less'],
                tasks: ['less']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/**/*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // write the template for JS API endpoint file
        template: {
            'api-server': {
                'options': {
                    'data': {
                        'endpoint': '<%= options.apiUrl.dev %>'
                    }
                },
                'files': {
                    '<%= yeoman.app %>/api.js': ['<%= yeoman.app %>/build/api.js.tpl']
                }
            },
            'api-server-dist': {
                'options': {
                    'data': {
                        'endpoint': '<%= options.apiUrl.prod %>'
                    }
                },
                'files': {
                    '<%= yeoman.dist %>/api.js': ['<%= yeoman.app %>/build/api.js.tpl']
                }
            }
        },

        // provide the output of 'git describe' for other tasks
        'git-describe': {
            _opts: {
                output: '<%= yeoman.app %>/data/version.json'
            },
            build: {
                options: {
                    infoKey: 'web',
                    cwd: '.'
                }
            },
            parent: {
                options: {
                    infoKey: 'api',
                    cwd: '<%= options.dmpProjectDir %>'
                }
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: SERVER_PORT,
                hostname: OPEN_TO_THE_WORLD ? '0.0.0.0' : 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            'ide-debug': {
                options: {
                    open: false,
                    livereload: false,
                    debug: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            test: {
                options: {
                    port: SERVER_PORT + 1,
                    base: [
                        '.tmp',
                        '<%= yeoman.test %>',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/**/*.js'
            ],
            test: {
                options: {
                    jshintrc: '<%= yeoman.test %>/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            },
            ci: {
                options: {
                    jshintrc: '.jshintrc',
                    reporter: 'checkstyle',
                    force: true,
                    reporterOutput: '<%= yeoman.target %>/jshint.xml'
                },
                files: {
                    src: ['<%= yeoman.app %>/scripts/{,*/}*.js']
                }
            }
        },

        // Compile less files
        less: {
            options: {
                paths: ['<%= yeoman.bower %>', '<%= yeoman.app %>/styles/']
            },
            all: {
                files: [{
                    expand: true,     // Enable dynamic expansion.
                    cwd: '<%= yeoman.app %>/styles/',      // Src matches are relative to this path.
                    src: ['**/main.less'], // Actual pattern(s) to match.
                    dest: '.tmp/styles/',   // Destination path prefix.
                    ext: '.css'   // Dest filepaths will have this extension.
                }]
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*',
                        '<%= yeoman.target %>/*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        bowerInstall: {
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                exclude: ['<%= yeoman.bower %>/bootstrap']
            }
        },

        // combine and cache angular templates
        ngtemplates: {
            dmpApp: {
                cwd: '<%= yeoman.app %>',
                src: ['views/{,*/}*.html', 'template/{,*/}*.html'],
                dest: '.tmp/scripts/templates.js',
                options: {
                    htmlmin: {
                        collapseBooleanAttributes:      true,
                        collapseWhitespace:             true,
                        removeAttributeQuotes:          true,
                        removeComments:                 true,
                        removeEmptyAttributes:          true,
                        removeOptionalTags:             true,
                        removeRedundantAttributes:      true,
                        removeScriptTypeAttributes:     true,
                        removeStyleLinkTypeAttributes:  true
                    },
                    usemin: 'scripts/scripts.js'
                }
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images']
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes:      true,
                    collapseWhitespace:             true,
                    removeComments:                 true,
                    removeEmptyAttributes:          true,
                    removeOptionalTags:             true,
                    removeRedundantAttributes:      true,
                    removeScriptTypeAttributes:     true,
                    removeStyleLinkTypeAttributes:  true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'api.js',
                        'images/{,*/}*.{webp}',
                        'styles/fonts/*',
                        'data/*',
                        'fonts/**/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: ['generated/*']
                }, {
                    expand: true,
                    cwd: '<%= yeoman.bower %>/font-awesome/fonts',
                    dest: '<%= yeoman.dist %>/fonts',
                    src: ['*']
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
            rev: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        'data/version.json'
                    ]
                }]
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'template:api-server',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'template:api-server-dist',
                'revision:dist',
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/styles/main.css': [
        //         '.tmp/styles/{,*/}*.css',
        //         '<%= yeoman.app %>/styles/{,*/}*.css'
        //       ]
        //     }
        //   }
        // },
        // concat: {
        //   dist: {}
        // },

        uglify: {
            local: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '<%= yeoman.dist %>/scripts/'
                }]
            }
        },

        // Test settings
        karma: {
            ci: {
                configFile: 'karma.conf.js',
                colors: false,
                singleRun: true,
                reporters: ['dots', 'junit', 'coverage'],
                coverageReporter: {
                    type: 'cobertura',
                    dir: '../<%= yeoman.target %>/coverage/'
                },
                browsers: ['PhantomJS'],
                autoWatch: false
            },
            localci: {
                configFile: 'karma.conf.js',
                colors: false,
                singleRun: true,
                reporters: ['dots', 'junit', 'coverage'],
                coverageReporter: {
                    type: 'html',
                    dir: '../<%= yeoman.target %>/coverage/'
                },
                browsers: ['Chrome'],
                autoWatch: false
            },
            continuous: {
                configFile: 'karma.conf.js',
                singleRun: false,
                autoWatch: true,
                browsers: ['Chrome']
            },
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true,
                autoWatch: false,
                browsers: ['Chrome']
            }
        },

        // JS static metrics
        plato: {
            options: {
                jshint: grunt.file.readJSON('.jshintrc')
            },
            metrics: {
                files: {
                    '<%= yeoman.target %>/metrics': ['<%= yeoman.app %>/scripts/{,*/}*.js']
                }
            }
        }
    });

    grunt.registerTask('revision', 'generate a version.js file, based on the output of git-describe', function () {
        var buildInfo = {}
            , tasks = [
                'git-describe:build',
                'git-describe:parent'
            ]
            , repoCount = tasks.length
            , describedRepos = 0;

        grunt.event.many('git-describe', repoCount, function (rev, opts) {
            describedRepos += 1;
            buildInfo[opts.infoKey] = {
                version: grunt.config('pkg.version'),
                revision: rev[0],
                date: grunt.template.today()
            };

            if (describedRepos >= repoCount) {
                grunt.file.write(grunt.config('git-describe._opts.output'), JSON.stringify(buildInfo));
            }
        });

        grunt.task.run(tasks);
    });

    grunt.registerTask('updateRevision', [
        'revision:dist',
        'copy:rev'
    ]);

    grunt.registerTask('printConfig', 'print the complete configuration', function() {
        grunt.log.writeln(JSON.stringify(grunt.config(), null, 2));
    });

    grunt.registerTask('serve', 'start the development server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'less',
            'bowerInstall',
            'template:api-server',
            'copy:styles',
            'autoprefixer',
            'connect:' + (target === 'debug' ? 'ide-debug' : 'livereload'),
            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', 'run tests', function (target) {
        grunt.task.run([
            'clean:server',
            'less',
            'copy:styles',
            'autoprefixer',
            'connect:test',
            target === 'ci' ? 'karma:ci' : 'karma:unit'
        ]);
    });

    grunt.registerTask('build', 'run the build process', function(target) {
        grunt.task.run([
            'clean:dist',
            'less',
            'bowerInstall',
            'useminPrepare',
            target === 'local' ? 'template:api-server' : 'template:api-server-dist',
            'revision:dist',
            'copy:styles',
            'imagemin',
            'svgmin',
            'ngtemplates',
            'autoprefixer',
            'concat',
            'ngmin',
            'copy:dist',
            'cdnify',
            'cssmin',
            target === 'local' ? 'uglify:local' : 'uglify:generated',
            'rev',
            'usemin',
            'htmlmin'
        ]);
    });

    grunt.registerTask('jenkins', [
        'jshint:ci',
        'plato',
        'test:ci'
    ]);

    grunt.registerTask('default', [
        'newer:jshint:all',
        'test',
        'build'
    ]);
};
