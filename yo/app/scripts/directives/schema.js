'use strict';

angular.module('dmpApp')
    .controller('SchemaCtrl', ['$scope', '$timeout', 'schemaParser', '$q', '$modal', 'ProjectResource', 'DataModelResource', 'PubSub',
        function ($scope, $timeout, schemaParser, $q, $modal, ProjectResource, DataModelResource, PubSub) {
        $scope.internalName = 'Source Target Schema Mapper';

        $scope.handleOutputSelected = function(dataModel) {

            /* jshint camelcase:false */

            delete dataModel['storage_type'];

            $scope.setOutputDataModel(dataModel);

        };

        $scope.onOutputSelectorClick = function() {

            var modalInstance = $modal.open({
                templateUrl: 'views/directives/target-schema-selector.html',
                controller: 'TargetSchemaSelectorCtrl'
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.handleOutputSelected(selectedItem);
            });

        };

        $scope.collapse = function(schema) {
            schema.collapsed = !schema.collapsed;

            $timeout(function() {
                PubSub.broadcast('schemaCanvasUpdated', {});
            }, 0);

        };

        $scope.chevron = function (source) {
            return 'glyphicon-chevron-' + (source.collapsed ? 'right' : 'down');
        };
    }])
    .directive('schema', [ function () {
        return {
            scope: true,
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/schema.html',
            controller: 'SchemaCtrl'
        };
    }]);

