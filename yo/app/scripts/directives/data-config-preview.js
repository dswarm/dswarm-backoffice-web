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

            $scope.previewResult = result.data;

        };

        $scope.dataConfigUpdated = function(config) {

            var resourceId = $routeParams.resourceId;

            if(config.resourceId) {
                resourceId = config.resourceId;
            }

            DataConfigPreviewResource.save(
                { resourceId: resourceId },
                config,
                function(result) {
                    $scope.configError = '';
                    $scope.dataConfigUpdatedSave(result);
                },
                function(error) {
                    $scope.previewResult = [];
                    $scope.configError = error.data.error;
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
