'use strict';

module.exports = function(config) {
    config.set({
        // Karma configuration

        // base path, that will be used to resolve files and exclude
        basePath : 'app/',

        // list of files / patterns to load in the browser
        files : [
            'components/jquery/jquery.js',
            'components/lodash/lodash.js',
            'components/angular/angular.js',
            'components/angular-route/angular-route.js',
            'components/angular-mocks/angular-mocks.js',
            'components/angular-ui-bootstrap/dist/ui-bootstrap-tpls-0.6.0.js',
            'components/angular-ui-utils/components/angular-ui-docs/build/ui-utils.js',
            'components/angular-local-storage/angular-local-storage.js',
            'components/angular-resource/angular-resource.js',
            'components/angular-cookies/angular-cookies.js',
            'components/angular-sanitize/angular-sanitize.js',
            'components/humanize/humanize.js',
            'components/ngprogress/build/ngProgress.js',
            'components/jsPlumb/dist/js/jquery.jsPlumb-*.js',
            'components/angular-grid/ng-grid-2.0.7.min.js',
            'scripts/*.js',
            'scripts/**/*.js',

            // templates
            'views/directives/**/*.html',

            '../test/mock/**/*.js',
            '../test/spec/**/*.js'
        ],

        // list of files to exclude
        exclude : [],

        // test results reporter to use
        // possible values: dots || progress || growl
        reporters : ['progress', 'junit'],

        // web server port
        //port : 8080,

        // cli runner port
        //runnerPort : 9100,

        // enable / disable colors in the output (reporters and logs)
        colors : true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        //logLevel : LOG_DEBUG,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch : true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers : ['FixedChrome'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout : 5000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun : false,

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },

        frameworks : ['jasmine'],

        preprocessors : {
            '**/*.html': ['ng-html2js'],
            'scripts/{,*/}*.js': 'coverage'
        },

        customLaunchers: {
            FixedChrome: {
                base: 'Chrome',
                flags: ['--user-data-dir=../KarmaChrome/Profile']
            }
        }

    });
};
