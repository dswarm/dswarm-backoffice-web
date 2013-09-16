'use strict';

angular.module('dmpApp')
    .controller('FilterSelectorCtrl', ['$scope', function ($scope) {

    }])
    .directive('filterSelector', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/filter-selector.html',
            controller: 'FilterSelectorCtrl'
        };
    }]);
