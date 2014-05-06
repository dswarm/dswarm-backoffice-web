'use strict';

angular.module('dmpApp')
    .controller('ComponentsCtrl', function($scope, FunctionResource) {
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
            // DD-435
            var funBlacklist = [
                'blacklist',
                'lookup',
                'setreplace',
                'whitelist'
            ];
            angular.forEach(funs, function(fun) {
                if (funBlacklist.indexOf(fun.name) > -1) {
                    fun.type = 'Disabled';
                }
            });
            // End DD-435

            $scope.functions.children = funs;
        });
    })
    .directive('components', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/components.html',
            controller: 'ComponentsCtrl'
        };
    });
