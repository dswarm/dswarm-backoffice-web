'use strict';

angular.module('dmpApp')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/data/', {
                title: 'Data Perspective',
                slug: 'data',
                templateUrl: 'views/perspectives/data-list.html',
                controller: 'DataListCtrl'
            })
            .when('/data/:id', {
                title: 'Choose Dataset',
                slug: 'data',
                templateUrl: 'views/perspectives/data-object.html',
                controller: 'DataObjectCtrl'
            })
            .when('/data-config/:resourceId/:configType', {
                title: 'Choose Dataset configuration',
                templateUrl: 'views/perspectives/data-config.html',
                slug: 'data',
                controller: 'DataConfigCtrl'
            })
            .when('/import', {
                title: 'Import Perspective',
                slug: 'import',
                templateUrl: 'views/perspectives/import.html',
                controller: 'ImportCtrl'
            })
            .when('/model/:projectId', {
                title: 'Modelling Perspective',
                slug: 'model',
                templateUrl: 'views/perspectives/model.html',
                controller: 'ModelCtrl'
            })
            .when('/model', {
                title: 'Modelling Perspective',
                slug: 'model',
                templateUrl: 'views/perspectives/model.html',
                controller: 'ModelCtrl'
            })

            .otherwise({redirectTo: '/data/'});
    }])
    .run(['$rootScope', '$window', function($rootScope, $window) {
        $rootScope.projectName = 'DMP 2000';

        $rootScope.$on('$routeChangeStart', function() {
            $rootScope.$broadcast('restorestate');
        });

        $rootScope.$on('$routeChangeSuccess', function(event, current) {
            $rootScope.viewTitle = current.title;
            $rootScope.activeTarget = current.slug;
        });
    }]);
