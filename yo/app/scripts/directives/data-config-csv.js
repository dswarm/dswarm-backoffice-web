'use strict';

angular.module('dmpApp')
    .controller('DataConfigCsvCtrl', ['$scope', '$routeParams', '$window', '$location', 'DataConfigResource', 'FileResource', 'PubSub', function ($scope, $routeParams, $window, $location, DataConfigResource, FileResource, PubSub) {

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

        // TEMP
        $scope.config.id = 1;

        $scope.resourceId = 1;
        if($routeParams.resourceId >= 0) {
            $scope.resourceId = $routeParams.resourceId;
        }

        $scope.config.parameters = $scope.presets.parameters;

        DataConfigResource.query({ resourceId: $scope.resourceId }, function(result) {

            var latestId = 0;

            angular.forEach(result, function(value) {

                if(value.id >= latestId) {

                    latestId = value.id;

                    $scope.config.name = value.name;
                    $scope.config.description = value.description;
                    $scope.config.id = value.id;
                    $scope.config.parameters = value.parameters;

                    if($scope.config.parameters['ignore_lines'] > 0) {
                        $scope.ignoreLinesActivate = true;
                    }
                    if($scope.config.parameters['discard_rows'] > 0) {
                        $scope.discardRowsActivate = true;
                    }
                    if($scope.config.parameters['at_most_rows'] > 0) {
                        $scope.atMostRowsActivate = true;
                    }

                }

            });

        });

        $scope.onSaveClick = function() {

            DataConfigResource.save({ resourceId: $scope.resourceId }, $scope.config, function() {
                $location.path('#/data/');
            });

        };

        $scope.onCancelClick = function() {
            $location.path( '#/data/' );
        };

        // When file fornat changes, update default rowseperator
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
        var fieldChanged = $window['_'].debounce(function() {
            var config = angular.copy($scope.config);
            angular.forEach(allTickableFields, function(trigger, field) {
                if ($scope[trigger] === false) {
                    unsetPath(field, config);
                }
            });

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
