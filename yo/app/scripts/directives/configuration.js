/**
 * Copyright (C) 2013 – 2015  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 * http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

angular.module('dmpApp')
    .controller('ConfigurationCtrl', function($scope, $modal, $timeout, PubSub, loDash, Util) {

        $scope.internalName = 'Configuration Widget';

        $scope.component = null;

        var componentId = null,
            waitToSendChange = null,
            isLoaded = false;

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

                if (typeof providedComponent.function.function_description.parameters !== 'undefined' &&
                    typeof providedComponent.function.function_description.parameters[key] !== 'undefined') {
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

            if(loDash.size(parameterPool) > 0) {

                var orderedParameters = loDash.map(parameterOrder, function(parameterKey) {

                    if(parameterKey.key) {
                        parameterKey = parameterKey.key;
                    }

                    var param = parameterPool[parameterKey] ? parameterPool[parameterKey] : {};
                    delete parameterPool[parameterKey];

                    if (typeof param === 'undefined') {
                        param = {};
                    }

                    param.key = parameterKey;
                    return param;
                });

                var additionalParameters = loDash.map(parameterPool, function(param, parameterKey) {
                    param.key = parameterKey;
                    return param;
                });

                orderedParameters.push.apply(orderedParameters, additionalParameters);
                component.parameters = orderedParameters;

            }

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

            $scope.component = null;
            componentId = null;
            isLoaded = false;

            var providedComponent = args.component;

            if (componentId !== null && providedComponent.id === componentId) {
                mergeComponents(providedComponent);
            } else {
                componentId = providedComponent.id;
                $scope.component = setComponent(providedComponent);
            }
        });

        /**
         * Saves configuration to project
         */
        $scope.doSave = function() {
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

            PubSub.broadcast('handleConfigEdited', params);
        };

        /**
         * Function to react on close button
         */
        $scope.onCancelClick = function() {
            $scope.component = null;
            componentId = null;
            PubSub.broadcast('configurationClosed', null);
        };

        /**
         * Finds the readable component name from both possible registers by the component var name
         * @param varName
         * @returns {*}
         */
        function getComponentNameByVarName(varName) {

            var name = '';

            angular.forEach($scope.project.mappings, function(mapping) {

                if(varName.indexOf('component') === -1) {

                    var iap = loDash.find(mapping.input_attribute_paths, function (iap) {
                        return iap.name === varName;
                    });

                    if (angular.isObject(iap) && angular.isDefined(iap.attribute_path)) {
                        name = Util.buildAttributeName(iap.attribute_path.attributes, 'name', ' › ');
                    }

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

        /**
         * Called to remove the current component from mapping
         */
        $scope.removeComponent = function() {

            var modalInstance = $modal.open({
                templateUrl: 'views/controllers/confirm-remove-component.html'
            });

            modalInstance.result.then(function() {

                PubSub.broadcast('removeComponent', componentId);

                $scope.component = null;
                componentId = null;

            });

        };

        $scope.$watch('component', function() {

            $timeout.cancel(waitToSendChange);

            if(loDash.isNull($scope.component)) {
                return;
            }

            if(isLoaded === false) {
                isLoaded = true;
                return;
            }

            waitToSendChange = $timeout(function() {
                $scope.doSave();
            }, 500);

        }, true);

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
