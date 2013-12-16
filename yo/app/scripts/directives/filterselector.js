'use strict';

angular.module('dmpApp')
    .controller('FilterSelectorCtrl', [function () { }])
    .directive('filterSelector', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                filters : '=',
                update : '='
            },
            templateUrl: 'views/directives/filter-selector.html',
            controller: 'FilterSelectorCtrl'
        };
    }]);
