'use strict';

angular.module('dmpApp')
    .directive('filterSelector', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/filter-selector.html'
        };
    });
