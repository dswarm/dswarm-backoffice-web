'use strict';

angular.module('dmpApp')
    .directive('filterSelector', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                filters: '=',
                update: '='
            },
            templateUrl: 'views/directives/filter-selector.html'
        };
    });
