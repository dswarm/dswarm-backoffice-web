'use strict';

angular.module('dmpApp')
    .directive('filterData', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/filter-data.html'
        };
    });
