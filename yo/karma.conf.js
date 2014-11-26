'use strict';

// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: 'app/',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'components/jquery/dist/jquery.js',
            'components/jquery-ui/ui/jquery-ui.js',
            '../node_modules/jasmine-jquery/lib/jasmine-jquery.js',
            'components/lodash/dist/lodash.compat.js',
            'components/angular/angular.js',
            'components/angular-route/angular-route.js',
            'components/angular-mocks/angular-mocks.js',
            'components/angular-bootstrap/ui-bootstrap-tpls.js',
            'components/angular-ui-utils/ui-utils.js',
            'components/angular-local-storage/dist/angular-local-storage.js',
            'components/angular-resource/angular-resource.js',
            'components/angular-cookies/angular-cookies.js',
            'components/angular-sanitize/angular-sanitize.js',
            'components/perfect-scrollbar/min/perfect-scrollbar.min.js',
            'components/perfect-scrollbar/min/perfect-scrollbar.with-mousewheel.min.js',
            'components/angular-perfect-scrollbar/src/angular-perfect-scrollbar.js',
            'components/humanize/humanize.js',
            'components/ngprogress/build/ngProgress.js',
            'components/jsPlumb/dist/js/jquery.jsPlumb-1.5.5.js',
            'components/angular-grid/ng-grid-2.0.9.debug.js',
            'components/angular-gridster/app/scripts/gridster.js',
            'components/angular-ui-sortable/sortable.js',
            'components/angular-ui-tree/dist/angular-ui-tree.js',
            'config.js',
            'scripts/*.js',
            'scripts/**/*.js',

            // templates
            'views/directives/**/*.html',

            '../test/mock/**/*.js',
            '../test/spec/**/*.js'
        ],

        // list of files to exclude
        exclude: [],

        // test results reporter to use
        // possible values: dots || progress || growl
        reporters: ['progress', 'junit', 'coverage'],

        // web server port
        //port : 8080,

        // cli runner port
        //runnerPort : 9100,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [process.env.KARMA_BROWSER || 'Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 5000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        junitReporter: {
            outputFile: '../target/unit.xml',
            suite: 'unit'
        },

        preprocessors: {
            '**/*.html': ['ng-html2js'],
            'scripts/**/*.js': ['coverage']
        },

        coverageReporter: {
            reporters: [
                {
                    type: 'html',
                    dir: '../target/coverage/'
                },
                { type: 'text' }
            ]
        },

        customLaunchers: {
            FixedChrome: {
                base: 'Chrome',
                flags: ['--user-data-dir=../KarmaChrome/Profile']
            },
            PhantomJS_without_security: {
                base: 'PhantomJS',
                flags: ['--web-security=no']
            }
        }

    });
};
