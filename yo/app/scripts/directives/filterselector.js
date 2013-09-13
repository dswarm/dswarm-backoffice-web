'use strict';

angular.module('dmpApp')
    .controller('FilterseletorCtrl', ['$scope', function ($scope) {

    }])
    .directive('filterselector', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/filter-selector.html',
            controller: 'FilterseletorCtrl'
        };
    }]);
