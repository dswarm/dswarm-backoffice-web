'use strict';

angular.module('dmpApp')
    .controller('ConfigurationCtrl', function($scope, PubSub, loDash) {

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

                if(args.function.function_description.parameters && typeof args.function.function_description.parameters[key] !== 'undefined') {
                    args.function.function_description.parameters[key].data = value;
                }

            });

            if(args.parameter_mappings.inputString && args.parameter_mappings.inputString.split(',').length > 1) {
                var inputString = args.parameter_mappings.inputString.split(',');

                var parameterItems = loDash.map(inputString, function(part) {
                    return {
                        text : getComponentNameByVarName(part),
                        id : part
                    };
                });

                if(args.function.function_description.parameters) {
                    args.function.function_description.parameters['inputStringSorting'] = {
                        type : 'sortable',
                        data : parameterItems
                    };
                }

            }

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

        /**
         * Finds the readable component name from both possible registers by teh component var name
         * @param varName
         * @returns {*}
         */
        function getComponentNameByVarName(varName) {

            var name = '';

            angular.forEach($scope.project.mappings, function(mapping) {

                angular.forEach(mapping.input_attribute_paths, function(input_attribute_path) {

                    angular.forEach(input_attribute_path.attribute_path.attributes, function(attribute) {
                        if(attribute.name === varName) {
                            name = attribute.name;
                        }
                    });

                });

                if(name.length > 0) {
                    return;
                }

                if(mapping.transformation) {
                    angular.forEach(mapping.transformation.function.components, function(component) {
                        if(component.name === varName) {
                            name = component.function.name;
                        }
                    });
                }


            });


            return angular.copy(name);

        }

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
