'use strict';

angular.module('dmpApp')
    .controller('DataConfigCtrl', ['$scope', '$routeParams', 'DataConfigResource', 'PubSub', function ($scope, $routeParams, DataConfigResource, PubSub) {

        var allFields = ['config.name', 'config.description', 'config.fileFormat', 'config.encodings', 'config.rowSeperator', 'config.fieldSeparator', 'config.escape', 'config.textEnclosure', 'config.columnNames', 'config.ignoreLines', 'config.parseLines', 'config.discardRows', 'config.atMostRows'];

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
            fieldSeparator : ';',
            escape : '\\',
            textEnclosure : '"',
            columnNames : 'columnN'

        }

        angular.forEach(allFields, function(value) {
            var field = value.split('.');
            $scope.config[field[1]] = '';
        });

        if($routeParams.dataConfigId !== 'new') {
            // If not create new, load data
            $scope.config = DataConfigService.query({
                dataConfigId : $routeParams.dataConfigId
            });
        } else {
            // laod default values
            $scope.config.fieldSeparator = $scope.presets.fieldSeparator;
            $scope.config.escape = $scope.presets.escape;
            $scope.config.textEnclosure = $scope.presets.textEnclosure;
            $scope.config.columnNames = $scope.presets.columnNames;
        }

        $scope.onSaveClick = function() {
            DataConfigService.save($scope.config);
        }

        // When file fornat changes, update default rowseperator
        $scope.onFileFormatChanged = function() {
            if($scope.config.fileformat.rowSeperator) {
                $scope.config.rowSeperator = $scope.config.fileformat.rowSeperator;
            }
        }

        // On any field change send broadcast that there was a change
        $scope.$watchCollection('['+allFields.join(',')+']', function() {
            PubSub.broadcast('dataConfigUpdated', {
                config : $scope.config
            });
        });

    }]);
