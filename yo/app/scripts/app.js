'use strict';

var app = angular.module('dmpApp', ['ui.state', 'ui.utils', 'ui.bootstrap.tabs', 'ui.bootstrap.modal', 'ui.compat', 'ngRoute', 'ngResource']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/perspectives/start.html'
            }).
            when('/data', {
                templateUrl: 'views/perspectives/data.html',
                controller: 'DataCtrl'
            }).
            when('/data-config/:dataConfigId', {
                templateUrl: 'views/perspectives/data-config.html',
                controller: 'DataConfigCtrl'
            }).
            when('/model', {
                templateUrl: 'views/perspectives/model.html',
                controller: 'ModelCtrl'
            });
    }]).run(['$rootScope', '$location', function($rootScope, $location){
        var path = function() { return $location.path();};
        $rootScope.$watch(path, function(newVal){
            $rootScope.activetab = newVal;
        });
    }]);
