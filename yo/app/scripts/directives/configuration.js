'use strict';

angular.module('dmpApp')
    .controller('ConfigurationCtrl', function ($scope, PubSub) {

        $scope.internalName = 'Configuration Widget';

        $scope.component = null;

        $scope.getPattern = function (pattern) {
            return pattern? new RegExp('^' + pattern + '$') : /.*/;
        };

        $scope.formClasses = function (input, isOptional) {
            return {
                'has-error': input.$invalid,
                'has-success': !isOptional && input.$valid
            };
        };

        PubSub.subscribe($scope, 'handleEditConfig', function(args) {
            $scope.component = args['function'];
        });

        $scope.onSaveClick = function() {
            $scope.component = null;
        };

    })
    .directive('configuration', function () {
        return {
            scope: true,
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/configuration.html',
            controller: 'ConfigurationCtrl'
        };
    });
