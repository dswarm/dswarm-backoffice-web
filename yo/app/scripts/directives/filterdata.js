'use strict';

angular.module('dmpApp')
    .directive('filterData', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                data : '='
            },
            templateUrl: 'views/directives/filter-data.html'
        };
    });
