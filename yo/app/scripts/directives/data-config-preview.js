/*global $:false */
'use strict';

angular.module('dmpApp')
    .controller('DataConfigPreviewCtrl', ['$scope', '$routeParams', 'PubSub', 'DataConfigPreviewResource', function ($scope, $routeParams, PubSub, DataConfigPreviewResource) {

        $scope.previewResult = [];
        $scope.configError = '';

        $scope.previewOptions = {
            data: 'previewResult',
            enableColumnResize: false,
            enableRowSelection: false
        };

        $scope.dataConfigUpdatedSave = function(result) {

            var csvObject = $.csv.toObjects(result);
            $scope.previewResult = csvObject;

        };

        $scope.dataConfigUpdated = function(config) {

            //var testConfig = {"id":1,"name":"foo","description":"bar","parameters":{"encoding":"UTF-8", "escape_character" : "\\", "quote_character" : "\"", "column_delimiter" : ",", "row_delimiter" : "\n"}};

            DataConfigPreviewResource.getPreview(
                { resourceId: $routeParams.resourceId },
                config,
                function(result) {
                    $scope.dataConfigUpdatedSave(result);
                },
                function(error) {
                    $scope.configError = error;
                });

        };

        PubSub.subscribe($scope, 'dataConfigUpdated', function(args) {
            $scope.dataConfigUpdated(args['config']);
        });

    }])
    .directive('dataconfigpreview', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/data-config-preview.html',
            controller: 'DataConfigPreviewCtrl'
        };
    }]);
