'use strict';

angular.module('dmpApp')
    .controller('DataConfigPreviewCtrl', function($scope, $routeParams, $timeout, loDash, PubSub, DataConfigPreviewResource, FileResource) {

        $scope.previewResult = [];
        $scope.colDefs = [];

        $scope.showGrid = false;

        $scope.runningUpdate = false;
        $scope.nextUpdate = [];

        $scope.previewOptions = {
            data: 'previewResult',
            columnDefs: 'colDefs',
            enableRowSelection: false,
            enableColumnResize: true
        };

        var keyRegex = new RegExp('[`~!@#$%^&*()_|+\\-=?;:\'",.<>\\n\\t\\r\\{\\}\\[\\]\\\\/ ]', 'gi');

        function normalizeKey(key) {
            return key.replace(keyRegex, '');
        }

        $scope.gridInclude = function() {
            return $scope.showGrid ? 'previewgrid' : '';
        };

        $scope.dataConfigUpdatedSave = function(result) {

            angular.forEach(result.data, function(element) {

                var currentResultElement = {};

                angular.forEach(element, function(value, key) {
                    currentResultElement[normalizeKey(key)] = value;
                });

                $scope.previewResult.push(currentResultElement);

            });

            angular.forEach(result.schema, function(value) {

                var currentColDefElement = {};

                currentColDefElement.field = normalizeKey(value);
                currentColDefElement.displayName = value;

                $scope.colDefs.push(currentColDefElement);
            });

        };

        $scope.checkNextConfigUpdate = function() {

            $scope.runningUpdate = false;

            if ($scope.nextUpdate.length > 0) {

                // Multiple too fast config previews are tripping the response handling.
                $timeout(function() {

                    $scope.dataConfigUpdated.apply(null, $scope.nextUpdate);
                    $scope.nextUpdate = [];

                }, 1);

            }

        };

        $scope.dataConfigUpdated = function(config, resourceId) {

            if ($scope.runningUpdate) {

                $scope.nextUpdate = [config, resourceId];

            } else {

                $scope.runningUpdate = true;

                $scope.previewResult = [];
                $scope.colDefs = [];

                $scope.showGrid = false;

                DataConfigPreviewResource.preview(
                    { id: resourceId },
                    config,
                    function(result) {

                        $scope.checkNextConfigUpdate();

                        $scope.configError = '';
                        $scope.dataConfigUpdatedSave(result);

                        $scope.showGrid = true;
                    },
                    function(error) {

                        $scope.$parent.$parent.$parent.configError = error.data.error;

                        FileResource.lines({
                            id: resourceId,
                            atMost: config.parameters['at_most_rows'] || 50,
                            encoding: config.parameters.encoding || 'UTF-8'
                        }, function(lines) {

                            var map = loDash.map;

                            $scope.colDefs = [
                                {
                                    field: 'line',
                                    displayName: lines['name'] + ' (' + lines['description'] + ')'
                                }
                            ];

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
            $scope.dataConfigUpdated(args['config'], args['resourceId']);
        });

    })
    .directive('dataconfigpreview', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/data-config-preview.html',
            controller: 'DataConfigPreviewCtrl'
        };
    });
