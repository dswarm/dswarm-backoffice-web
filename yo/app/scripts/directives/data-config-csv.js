'use strict';

angular.module('dmpApp')
    .controller('DataConfigCsvCtrl', ['$scope', '$routeParams', '$location', 'loDash', 'DataModelResource', 'ResourceResource', 'PubSub',
        function ($scope, $routeParams, $location, loDash, DataModelResource, ResourceResource, PubSub) {

        function returnToData() { $location.path('/data/'); }

        var resource = null;

        var allFields = 'config.parameters',
            allTickableFields = {
                'parameters.ignore_lines': 'ignoreLinesActivate',
                'parameters.discard_rows': 'discardRowsActivate',
                'parameters.at_most_rows': 'atMostRowsActivate'
            };

        $scope.config = {};

        $scope.presets = {
            fileFormat : [
                { name : 'Windows', 'row_delimiter' : '\\r\\n' },
                { name : 'Linux' , 'row_delimiter' : '\\n' }
            ],
            encoding : [
                { name : 'ISO-8859-1' },
                { name : 'ISO-8859-15' },
                { name : 'US-ASCII' },
                { name : 'UTF-8' },
                { name : 'UTF-16' },
                { name : 'UTF-16LE' },
                { name : 'UTF-16BE' },
                { name : 'Unicode' },
                { name : 'Windows-1252' }
            ],

            parameters : {
                'column_delimiter' : ',',
                'escape_character' : '\\',
                'quote_character' : '"',
                'column_names' : 'columnN',
                'storage_type' : 'csv'
            }

        };

        function getConfig() {
            var config = angular.copy($scope.config);
            angular.forEach(allTickableFields, function(trigger, field) {
                if ($scope[trigger] === false) {
                    unsetPath(field, config);
                }
            });
            return config;
        }

        $scope.resourceId = 1;
        if($routeParams.resourceId >= 0) {
            $scope.resourceId = $routeParams.resourceId;
        }

        $scope.config.parameters = $scope.presets.parameters;

        ResourceResource.get({ id: $scope.resourceId }, function(result) {

            resource = result;

            if (result.configurations) {

                var latestConfig = loDash.max(result.configurations, 'id');

                if (angular.isObject(latestConfig)) {

                    $scope.config.name = latestConfig.name;
                    $scope.config.description = latestConfig.description;
                    $scope.config.id = latestConfig.id;

                    angular.forEach(allTickableFields, function(ticker, param) {
                        var varName = param.substring(param.lastIndexOf('.') + 1);
                        if (angular.isDefined(latestConfig.parameters[varName]) && +latestConfig.parameters[varName] > 0) {
                            $scope[ticker] = true;
                        }
                    });

                    $scope.config.parameters = latestConfig.parameters;
                }
            }
        });

        $scope.onSaveClick = function() {

            var model = {
                'data_resource': resource,
                'configuration': getConfig()
            };

            DataModelResource.save({}, model, returnToData);

        };

        $scope.onCancelClick = returnToData;

        // When file format changes, update default row separator
        $scope.onFileFormatChanged = function() {
            if($scope.config.parameters.fileFormat && $scope.config.parameters.fileFormat.rowSeperator) {
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

        // do not preview more often that, say, every 200 msecs
        var fieldChanged = loDash.debounce(function(oldVal, newVal) {
            if (angular.equals(oldVal, newVal)) {
                // initial registration
                return;
            }

            var config = getConfig();

            PubSub.broadcast('dataConfigUpdated', {
                config : config
            });
        }, 200);

        $scope.onFieldChanged = fieldChanged;

        $scope.$watch(allFields, fieldChanged, true);

    }])
    .directive('dataconfigcsv', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/data-config-csv.html',
            controller: 'DataConfigCsvCtrl'
        };
    }]);
