'use strict';

angular.module('dmpApp')
    .controller('ConfigurationCtrl', function($scope, PubSub, loDash, Util) {

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

        function setComponent(providedComponent) {

            angular.forEach(providedComponent.parameter_mappings, function(value, key) {

                if (typeof providedComponent.function.function_description.parameters[key] !== 'undefined') {
                    providedComponent.function.function_description.parameters[key].data = value;
                }

            });

            if (providedComponent.parameter_mappings.inputString && providedComponent.parameter_mappings.inputString.split(',').length > 1) {
                var inputString = providedComponent.parameter_mappings.inputString.split(',');

                var parameterItems = loDash.map(inputString, function(part) {
                    return {
                        text: getComponentNameByVarName(part),
                        id: part
                    };
                });

                providedComponent.function.function_description.parameters['inputStringSorting'] = {
                    type: 'sortable',
                    data: parameterItems
                };

            }

            var component = providedComponent['function'];
            var parameterOrder = angular.copy(component.parameters);
            var parameterPool = component.function_description.parameters;

            var orderedParameters = loDash.map(parameterOrder, function(parameterKey) {
                var param = parameterPool[parameterKey];
                delete parameterPool[parameterKey];

                param.key = parameterKey;
                return param;
            });

            var additionalParameters = loDash.map(parameterPool, function(param, parameterKey) {
                param.key = parameterKey;
                return param;
            });

            orderedParameters.push.apply(orderedParameters, additionalParameters);
            component.parameters = orderedParameters;

            return component;
        }

        function mergeData(oldData, newData) {
            if (!oldData) {
                return newData;
            }
            if (!newData) {
                return oldData;
            }
            if (loDash.isArray(oldData)) {
                if (oldData.length === 0) {
                    return newData;
                }
                if (newData.length === 0) {
                    return oldData;
                }
                return loDash.uniq(oldData.concat(newData), 'id');
            }
            return oldData + newData;
        }

        function mergeComponents(providedComponent) {

            var newComponent = setComponent(providedComponent),
                scopeParams = $scope.component.parameters;

            loDash.forEach(newComponent.parameters, function(newParam) {
                var paramKey = newParam.key;
                var oldParam = loDash.find(scopeParams, {key: paramKey});

                if (oldParam) {
                    oldParam.data = mergeData(oldParam.data, newParam.data);
                } else {
                    scopeParams.push(newParam);
                }
            });
        }

        PubSub.subscribe($scope, 'handleEditConfig', function(args) {
            if (args.onlyIfAlreadyOpened && componentId === null) {
                return;
            }
            var providedComponent = args.component;

            if (componentId !== null && providedComponent.id === componentId) {
                mergeComponents(providedComponent);
            } else {
                componentId = providedComponent.id;
                $scope.component = setComponent(providedComponent);
            }
        });

        $scope.onSaveClick = function() {
            if (componentId === null) {
                return;
            }

            var params = {
                id: componentId,
                parameter_mappings: {}
            };

            angular.forEach($scope.component.parameters, function(paramDef) {
                var param = paramDef.key;
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

                if(varName.indexOf('component') === -1) {

                    var iap = loDash.find(mapping.input_attribute_paths, function (iap) {
                        return Util.buildVariableName(iap.attribute_path.attributes) === varName;
                    });

                    name = Util.buildAttributeName(iap.attribute_path.attributes, 'name', ' › ');

                    if(name.length > 0) {
                        return;
                    }

                } else {

                    if(mapping.transformation) {
                        angular.forEach(mapping.transformation.function.components, function(component) {
                            if(component.name === varName) {
                                name = component.function.name;
                            }
                        });
                    }

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
