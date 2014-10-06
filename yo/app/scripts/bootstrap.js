/**
 * Copyright (C) 2013, 2014  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 * http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

angular.module('dmpApp')
    .config(['$routeProvider', '$httpProvider', 'localStorageServiceProvider', 'HttpHeaders',
        function($routeProvider, $httpProvider, localStorageServiceProvider, HttpHeaders) {
        $routeProvider
            .when('/data/', {
                title: 'Data Perspective',
                slug: 'data',
                templateUrl: 'views/perspectives/data-list.html',
                controller: 'DataListCtrl'
            })
            .when('/data/:resourceId', {
                title: 'Choose Dataset',
                slug: 'data',
                templateUrl: 'views/perspectives/data-object.html',
                controller: 'DataObjectCtrl'
            })
            .when('/data/:resourceId/:configType', {
                title: 'Choose Dataset configuration',
                templateUrl: 'views/perspectives/data-config.html',
                slug: 'data',
                controller: 'DataConfigCtrl'
            })
            .when('/data-config/:dataModelId/:configType', {
                title: 'Edit a Datamodel configuration',
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
            .when('/export', {
                title: 'Export Perspective',
                slug: 'export',
                templateUrl: 'views/perspectives/export.html',
                controller: 'ExportCtrl'
            })

            .otherwise({redirectTo: '/data/'});

        localStorageServiceProvider.setPrefix('dmp');
        localStorageServiceProvider.setNotify(false, false);

        for (var header in HttpHeaders) {
            if (HttpHeaders.hasOwnProperty(header)) {
                $httpProvider.defaults.headers.common[header] = HttpHeaders[header];
            }
        }
    }])
    .run(['$rootScope', '$location', 'ProjectInfo', function($rootScope, $location, ProjectInfo) {
        $rootScope.projectName = ProjectInfo.title;

        if ($location.path().indexOf('model') !== -1) {
            $location.path('/data/');
        }

        $rootScope.$on('$routeChangeSuccess', function(event, current) {
            $rootScope.viewTitle = current.title;
            $rootScope.activeTarget = current.slug;
        });
    }]);
