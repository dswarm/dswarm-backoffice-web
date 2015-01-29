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
    .controller('DataConfigCsvCtrl', function($scope, $routeParams, ngProgress, loDash, ConfigurationResource, DataModelResource, ResourceResource, PubSub, GUID) {

        var resource = null;
        var dataModel = null;

        var allFields = 'config.parameters',
            allTickableFields = {
                'parameters.ignore_lines': 'ignoreLinesActivate',
                'parameters.discard_rows': 'discardRowsActivate',
                'parameters.at_most_rows': 'atMostRowsActivate'
            };

        $scope.config = {};

        $scope.presets = {
            fileFormat: [
                { name: 'Windows', 'row_delimiter': '\\r\\n' },
                { name: 'Linux', 'row_delimiter': '\\n' }
            ],
            encoding: [
                { name: 'ISO-8859-1' },
                { name: 'ISO-8859-15' },
                { name: 'US-ASCII' },
                { name: 'UTF-8' },
                { name: 'UTF-16' },
                { name: 'UTF-16LE' },
                { name: 'UTF-16BE' },
                { name: 'Unicode' },
                { name: 'Windows-1252' }
            ],

            parameters: {
                'column_delimiter': ',',
                'escape_character': '\\',
                'quote_character': '"',
                'first_row_is_headings': true,
                'column_names': 'columnN',
                'storage_type': 'csv'
            }

        };

        $scope.config.parameters = $scope.presets.parameters;

        $scope.saving = false;

        function getConfig() {
            var config = angular.copy($scope.config);
            angular.forEach(allTickableFields, function(trigger, field) {
                if ($scope[trigger] === false) {
                    unsetPath(field, config);
                }
            });
            if(!config.uuid) {
                config.uuid = GUID.uuid4();
            }
            return config;
        }

        function extractFromConfig(configuration, reuseIdentifiers) {

            if (reuseIdentifiers) {
                $scope.config.name = configuration.name;
                $scope.config.description = configuration.description;
                $scope.config.uuid = configuration.uuid;
            }

            angular.forEach(allTickableFields, function(ticker, param) {
                var varName = param.substring(param.lastIndexOf('.') + 1);
                if (angular.isDefined(configuration.parameters[varName]) && +configuration.parameters[varName] > 0) {
                    $scope[ticker] = true;
                }
            });

            $scope.config.parameters = configuration.parameters;
        }

        function extractFromResource(dataResource) {
            if (dataResource.configurations) {

                // TODO: Find a way to determine the latest configuration
                var latestConfig = dataResource.configurations[0];

                if (angular.isObject(latestConfig)) {
                    extractFromConfig(latestConfig);
                }
            }
        }

        if ($scope.mode === 'create' && $routeParams.resourceId) {
            $scope.resourceId = $routeParams.resourceId;

            ResourceResource.get({ id: $scope.resourceId }, function(result) {
                resource = result;
                extractFromResource(resource);
                sendDataConfigUpdatedBroadcast();
            });
        } else if ($scope.mode === 'edit' && $routeParams.dataModelId) {
            DataModelResource.get({id: $routeParams.dataModelId }, function(result) {
                dataModel = result;
                resource = result.data_resource;
                $scope.resourceId = resource.uuid;

                extractFromConfig(result.configuration, true);
                sendDataConfigUpdatedBroadcast();
            });
        }

        $scope.onSaveClick = function() {
            if (!$scope.saving) {
                $scope.saving = true;
                ngProgress.start();

                if ($scope.mode === 'create' && resource !== null) {
                    var model = {
                        'data_resource': resource,
                        'configuration': getConfig(),
                        'uuid': GUID.uuid4()
                    };

                    DataModelResource.save({}, model, $scope.returnToData, function() {
                        $scope.saving = false;
                        ngProgress.complete();
                    });
                } else if ($scope.mode === 'edit' && dataModel !== null) {
                    var configuration = getConfig();
                    ConfigurationResource.update({id: configuration.uuid}, configuration, $scope.returnToData, function() {
                        $scope.saving = false;
                        ngProgress.complete();
                    });
                }
            }
        };

        $scope.onCancelClick = $scope.returnToData;

        // When file format changes, update default row separator
        $scope.onFileFormatChanged = function() {
            if ($scope.config.parameters.fileFormat && $scope.config.parameters.fileFormat.rowSeperator) {
                $scope.config.parameters.rowSeperator = $scope.config.parameters.fileFormat.rowSeperator;
            }
        };

        function unsetPath(path, $in) {
            var segments = path.split('.');

            if (segments.length === 1) {
                delete $in[segments[0]];
            } else {
                unsetPath(segments.slice(1).join('.'), $in[segments[0]]);
            }
        }

        function sendDataConfigUpdatedBroadcast() {
            if (resource !== null) {
                var config = getConfig();

                PubSub.broadcast('dataConfigUpdated', {
                    config: config,
                    resourceId: resource.uuid
                });
            }
        }

        // do not preview more often that, say, every 200 msecs
        var fieldChanged = loDash.debounce(function(oldVal, newVal) {
            if (angular.equals(oldVal, newVal)) {
                // initial registration
                return;
            }

            sendDataConfigUpdatedBroadcast();

        }, 200);

        $scope.onFieldChanged = sendDataConfigUpdatedBroadcast;

        $scope.$watch(allFields, fieldChanged, true);

        $scope.$watch('configError', function() {
            $scope.$parent.configError = $scope.configError;
        });

    })
    .directive('dataconfigcsv', function() {
        return {
            restrict: 'E',
            replace: true,
            scope : false,
            templateUrl: 'views/directives/data-config-csv.html',
            controller: 'DataConfigCsvCtrl'
        };
    });
