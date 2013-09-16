'use strict';

angular.module('dmpApp')
    .controller('FilterDataCtrl', ['$scope', function ($scope) {

    }])
    .directive('filterData', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/filter-data.html',
            controller: 'FilterDataCtrl'
        };
    }]);
