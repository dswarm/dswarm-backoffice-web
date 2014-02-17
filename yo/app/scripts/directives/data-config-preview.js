'use strict';

angular.module('dmpApp')
    .controller('DataConfigPreviewCtrl', function ($scope, $routeParams, $timeout, loDash, PubSub, DataConfigPreviewResource, FileResource) {

        $scope.previewResult = [];
        $scope.colDefs = [];
        $scope.configError = '';

        $scope.showGrid = false;

        $scope.runningUpdate = {};
        $scope.nextUpdate = {};

        $scope.previewOptions = {
            data: 'previewResult',
            columnDefs : 'colDefs',
            enableRowSelection: false,
            enableColumnResize: true
        };

        $scope.gridInclude = function() {
            return $scope.showGrid ? 'previewgrid' : '';
        };

        $scope.dataConfigUpdatedSave = function(result) {

            angular.forEach(result.data, function(element) {

                var currentResultElement = {};

                angular.forEach(element, function(value, key) {
                    currentResultElement[key.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gi,'')] = value;
                });

                $scope.previewResult.push(currentResultElement);

            });

            angular.forEach(result.schema, function(value) {

                var currentColDefElement = {};

                currentColDefElement.field = value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gi,'');
                currentColDefElement.displayName = value;

                $scope.colDefs.push(currentColDefElement);
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

                        $scope.configError = '';
                        $scope.dataConfigUpdatedSave(result);

                        $scope.showGrid = true;
                    },
                    function(error) {

                        $scope.configError = error.data.error;

                        FileResource.lines({
                            id: resourceId,
                            atMost: config.parameters['at_most_rows'] || 50,
                            encoding: config.parameters.encoding || 'UTF-8'
                        }, function(lines) {

                            var map = loDash.map;

                            $scope.colDefs = [{
                                field: 'line',
                                displayName: lines['name'] + ' (' + lines['description'] + ')'
                            }];

                            $scope.previewResult = map(lines['lines'], function(line) {
                                return { line: line };
                            });

                            $scope.showGrid = true;

                            $scope.checkNextConfigUpdate();
                        });
                    }
                );

            }

        };

        PubSub.subscribe($scope, 'dataConfigUpdated', function(args) {
            $scope.dataConfigUpdated(args['config']);
        });

    })
    .directive('dataconfigpreview', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/data-config-preview.html',
            controller: 'DataConfigPreviewCtrl'
        };
    });
