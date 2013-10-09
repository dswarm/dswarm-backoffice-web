'use strict';

angular.module('dmpApp')
    .controller('DataConfigPreviewCtrl', ['$scope', '$routeParams', '$timeout', 'PubSub', 'DataConfigPreviewResource', function ($scope, $routeParams, $timeout, PubSub, DataConfigPreviewResource) {

        $scope.previewResult = [];
        $scope.colDefs = [];
        $scope.configError = '';

        $scope.showGrid = false;

        $scope.runningUpdate = {};
        $scope.nextUpdate = {};

        $scope.previewOptions = {
            data: 'previewResult',
            colDefs : 'colDefs',
            enableRowSelection: false
        };

        $scope.gridInclude = function() {
            return $scope.showGrid ? 'previewgrid' : '';
        };

        $scope.dataConfigUpdatedSave = function(result) {

            angular.forEach(result.data, function(element) {

                var currentResultElement = {};

                angular.forEach(element, function(value, key) {
                    currentResultElement[key.replace(/[ ,;]/g,'')] = value;
                });

                $scope.previewResult.push(currentResultElement);
                
            });

            angular.forEach(result.schema, function(value) {
                $scope.colDefs.push(value.replace(/[ ,;]/g,''));
            });

        };

        $scope.checkNextConfigUpdate = function() {

            $scope.runningUpdate = {};

            if(Object.keys($scope.nextUpdate).length > 0) {

                // Multiple too fast config previews are tripping the response handling.
                $timeout(function() {

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
