'use strict';

angular.module('dmpApp')
    .controller('FilterdataCtrl', ['$scope', function ($scope) {

    }])
    .directive('filterdata', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/filter-data.html',
            controller: 'FilterdataCtrl'
        };
    }]);
