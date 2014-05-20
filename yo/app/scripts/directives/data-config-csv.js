'use strict';

angular.module('dmpApp')
    .controller('DataConfigCsvCtrl', function($scope, $routeParams, $location, ngProgress, loDash, ConfigurationResource, DataModelResource, ResourceResource, PubSub) {

        function returnToData() {
            $scope.saving = false;
            ngProgress.complete();
            $location.path('/data/');
        }

        var resource = null;
        var dataModel = null;
        var mode = $routeParams.dataModelId ? 'edit' : 'create';

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
            return config;
        }

        function extractFromConfig(configuration, reuseIdentifiers) {

            if (reuseIdentifiers) {
                $scope.config.name = configuration.name;
                $scope.config.description = configuration.description;
                $scope.config.id = configuration.id;
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

                var latestConfig = loDash.max(dataResource.configurations, 'id');

                if (angular.isObject(latestConfig)) {

                    extractFromConfig(latestConfig);
                }
            }
        }

        if (mode === 'create' && $routeParams.resourceId) {
            var resourceId = Math.max(1, +$routeParams.resourceId);
            $scope.resourceId = resourceId;

            ResourceResource.get({ id: resourceId }, function(result) {
                resource = result;
                extractFromResource(resource);
                sendDataConfigUpdatedBroadcast();
            });
        } else if (mode === 'edit' && $routeParams.dataModelId) {
            var dataModelId = Math.max(1, +$routeParams.dataModelId);

            DataModelResource.get({id: dataModelId }, function(result) {
                dataModel = result;
                resource = result.data_resource;
                $scope.resourceId = resource.id;

                extractFromConfig(result.configuration, true);
                sendDataConfigUpdatedBroadcast();
            });
        }

        $scope.onSaveClick = function() {
            if (!$scope.saving) {
                $scope.saving = true;
                ngProgress.start();

                if (mode === 'create' && resource !== null) {
                    var model = {
                        'data_resource': resource,
                        'configuration': getConfig()
                    };

                    DataModelResource.save({}, model, returnToData, function() {
                        $scope.saving = false;
                        ngProgress.complete();
                    });
                } else if (mode === 'edit' && dataModel !== null) {
                    var configuration = getConfig();
                    ConfigurationResource.update({id: configuration.id}, configuration, returnToData, function() {
                        $scope.saving = false;
                        ngProgress.complete();
                    });
                }
            }
        };

        $scope.onCancelClick = returnToData;

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
                    resourceId: resource.id
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

    })
    .directive('dataconfigcsv', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/data-config-csv.html',
            controller: 'DataConfigCsvCtrl'
        };
    });
