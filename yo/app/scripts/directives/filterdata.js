'use strict';

angular.module('dmpApp')
    .controller('FilterDataCtrl', [function () { }])
    .directive('filterData', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                data : '='
            },
            templateUrl: 'views/directives/filter-data.html',
            controller: 'FilterDataCtrl'
        };
    }]);
