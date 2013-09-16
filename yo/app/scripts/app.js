'use strict';

var app = angular.module('dmpApp', ['ui.state', 'ui.utils', 'ui.bootstrap.tabs', 'ui.bootstrap.modal', 'ui.compat']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/perspectives/data.html',
                controller: DataCtrl
            }).
            when('/model', {
                templateUrl: 'views/perspectives/model.html',
                controller: ModelCtrl
            });
    }]).run(['$rootScope', '$location', function($rootScope, $location){
        var path = function() { return $location.path();};
        $rootScope.$watch(path, function(newVal){
            $rootScope.activetab = newVal;
        });
    }]);
