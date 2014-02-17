'use strict';

angular.module('dmpApp')
    .controller('ComponentsCtrl', ['$scope', 'loDash', 'FunctionResource',
        function ($scope, Lodash, FunctionResource) {
        $scope.internalName = 'Function List Widget';

        /**
         * Model for a list of functions, that are available.
         *
         * @type {Object}
         */
        $scope.functions = {
            'name': 'Functions',
            'show': true,
            'children': []
        };

        FunctionResource.query(function(funs) {
            $scope.functions.children = funs;
        });
    }])
    .directive('components', [ function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/components.html',
            controller: 'ComponentsCtrl'
        };
    }]);
