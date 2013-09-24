'use strict';

angular.module('dmpApp')
    .controller('DataConfigPreviewCtrl', ['$scope', '$routeParams', 'PubSub', 'DataConfigPreviewResource', function ($scope, $routeParams, PubSub, DataConfigPreviewResource) {

        $scope.previewResult = [],

        $scope.previewOptions = {
            data: 'previewResult',
            columnDefs: [],
            enableColumnResize: false
        };

        $scope.dataConfigUpdatedSave = function(result) {

            $scope.previewResult = result['data'];
            $scope.previewOptions.columnDefs = result['columnDefs'];

            if (!$scope.$$phase) {
                $scope.$apply();
            }

        };

        $scope.dataConfigUpdated = function(config) {

            DataConfigPreviewResource.save({ resourceId: $routeParams.resourceId }, config, function(result) {
                $scope.dataConfigUpdatedSave(result);
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
