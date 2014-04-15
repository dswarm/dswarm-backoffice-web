'use strict';

angular.module('dmpApp')
    .controller('ConfigurationCtrl', function($scope, PubSub) {

        $scope.internalName = 'Configuration Widget';

        $scope.component = null;

        var componentId = null;

        $scope.getPattern = function(pattern) {
            return pattern ? new RegExp('^' + pattern + '$') : /.*/;
        };

        $scope.formClasses = function(input, isOptional) {
            return {
                'has-error': input.$invalid,
                'has-success': !isOptional && input.$valid
            };
        };

        PubSub.subscribe($scope, 'handleEditConfig', function(args) {
            componentId = args.id;

            angular.forEach(args.parameter_mappings, function(value, key) {

                if(typeof args.function.function_description.parameters[key] !== 'undefined') {
                    args.function.function_description.parameters[key].data = value;
                }

            });

            $scope.component = args['function'];
        });

        $scope.onSaveClick = function() {
            if (componentId === null) {
                return;
            }

            var params = {
                id: componentId,
                parameter_mappings: {}
            };

            angular.forEach($scope.component.function_description.parameters, function(paramDef, param) {
                if (angular.isDefined(paramDef.data)) {
                    params.parameter_mappings[param] = paramDef.data;
                }
            });

            $scope.component = null;
            componentId = null;

            PubSub.broadcast('handleConfigEdited', params);
        };

        $scope.onCancelClick = function() {
            $scope.component = null;
            componentId = null;
        };
    })
    .directive('configuration', function() {
        return {
            scope: true,
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/configuration.html',
            controller: 'ConfigurationCtrl'
        };
    });
