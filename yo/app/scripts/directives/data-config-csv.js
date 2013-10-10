'use strict';

angular.module('dmpApp')
    .controller('DataConfigCsvCtrl', ['$scope', '$routeParams', '$window', '$location', 'DataConfigResource', 'FileResource', 'PubSub', function ($scope, $routeParams, $window, $location, DataConfigResource, FileResource, PubSub) {

        var allFields = ['config.name', 'config.description', 'config.parameters.row_delimiter', 'config.parameters.encoding', 'config.parameters.rowSeperator', 'config.parameters.column_delimiter', 'config.parameters.escape_character', 'config.parameters.quote_character', 'config.parameters.column_names', 'config.parameters.ignore_lines', 'config.parameters.parse_lines', 'config.parameters.discard_rows', 'config.parameters.at_most_rows'];

        $scope.config = {};

        $scope.presets = {
            fileFormat : [
                { name : 'Windows', 'row_delimiter' : '\\r\\n' },
                { name : 'Linux' , 'row_delimiter' : '\\n' }
            ],
            encoding : [
                { name : 'ISO8859-1' },
                { name : 'ISO8859-15' },
                { name : 'ASCII' },
                { name : 'UTF-8' },
                { name : 'UTF-16' },
                { name : 'little Endian' },
                { name : 'big Endian' },
                { name : 'Unicode' },
                { name : 'Windows1252' }
            ],

            parameters : {
                'column_delimiter' : ',',
                'escape_character' : '\\\\',
                'quote_character' : '\\"',
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

        // On any field change send broadcast that there was a change
        $scope.$watchCollection('['+allFields.join(',')+']', function() {
            $scope.onFieldChanged();
        });

        $scope.onFieldChanged = function() {
            PubSub.broadcast('dataConfigUpdated', {
                config : $scope.config
            });
        };

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
