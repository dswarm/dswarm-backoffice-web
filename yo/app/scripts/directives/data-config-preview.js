'use strict';

angular.module('dmpApp')
    .controller('DataConfigPreviewCtrl', ['$scope', '$routeParams', 'PubSub', 'DataConfigPreviewResource', function ($scope, $routeParams, PubSub, DataConfigPreviewResource) {

        $scope.previewResult = [];
        $scope.colDefs = [];
        $scope.configError = '';

        $scope.showGrid = false;

        $scope.runningUpdate = {};
        $scope.nextUpdate = {};

        $scope.gridInclude = function() {
            return $scope.showGrid ? 'previewgrid' : '';
        };

        $scope.previewOptions = {
            data: 'previewResult',
            colDefs : 'colDefs',
            enableRowSelection: false
        };

        $scope.dataConfigUpdatedSave = function(result) {
            $scope.previewResult = result.data;
            $scope.colDefs = result.schema;
        };

        $scope.checkNextConfigUpdate = function() {

            $scope.runningUpdate = {};

            if(Object.keys($scope.nextUpdate).length > 0) {

                // Multiple too fast config previews are tripping the response handling.
                setTimeout(function() {

                    $scope.dataConfigUpdated($scope.nextUpdate);
                    $scope.nextUpdate = {};

                }, 1);

            }

        };

        $scope.dataConfigUpdated = function(config) {

            if(Object.keys($scope.runningUpdate).length > 0) {

                $scope.nextUpdate = config;

            } else {

                $scope.runningUpdate = config;

                $scope.previewResult = [];
                $scope.colDefs = [];

                $scope.showGrid = false;

                var resourceId = $routeParams.resourceId;

                if(config.resourceId) {
                    resourceId = config.resourceId;
                }

                DataConfigPreviewResource.save(
                    { resourceId: resourceId },
                    config,
                    function(result) {

                        $scope.checkNextConfigUpdate();

                        $scope.showGrid = true;

                        $scope.configError = '';
                        $scope.dataConfigUpdatedSave(result);
                    },
                    function(error) {

                        $scope.checkNextConfigUpdate();

                        $scope.showGrid = true;

                        $scope.previewResult = [];
                        $scope.configError = error.data.error;
                    }
                );

            }

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
