'use strict';

angular.module('dmpApp')
    .controller('DataConfigCtrl', ['$scope', '$routeParams', '$window', '$location', 'DataConfigResource', 'FileResource', 'PubSub', function ($scope, $routeParams, $window, $location, DataConfigResource, FileResource, PubSub) {

        var savedConfigurations,
            allFields = ['config.name', 'config.description', 'config.parameters.fileFormat', 'config.parameters.encodings', 'config.parameters.rowSeperator', 'config.parameters.fieldSeparator', 'config.parameters.escape', 'config.parameters.textEnclosure', 'config.parameters.columnNames', 'config.parameters.ignoreLines', 'config.parameters.parseLines', 'config.parameters.discardRows', 'config.parameters.atMostRows'];

        $scope.config = {};

        $scope.presets = {
            fileFormat : [
                { name : 'Windows', rowseperator : '\\r\\n' },
                { name : 'Linux' , rowseperator : '\\n' }
            ],
            encodings : [
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
                fieldSeparator : ';',
                escape : '\\',
                textEnclosure : '"',
                columnNames : 'columnN'
            }

        };

        // TEMP
        $scope.config.id = 1;

        $scope.config.parameters = $scope.presets.parameters;

        savedConfigurations = DataConfigResource.query({ resourceId: $routeParams.resourceId }, function() {

            angular.forEach(savedConfigurations, function(value, key) {

                $scope.config.name = value.name;
                $scope.config.description = value.description;
                $scope.config.id = value.id;
                $scope.config.parameters = value.parameters;

            });

        });

        $scope.onSaveClick = function() {

            var data = new FormData();

            DataConfigResource.save({ resourceId: $routeParams.resourceId }, $scope.config, function() {
                $location.path('/data/');
            });

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

        }

    }]);
