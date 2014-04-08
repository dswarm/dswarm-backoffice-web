'use strict';

angular.module('dmpApp')
    .controller('SchemaCtrl', function($scope, $timeout, $q, $modal, PubSub) {
        $scope.internalName = 'Source Target Schema Mapper';

        $scope.handleOutputSelected = function(dataModel) {

            $scope.setOutputSchema(dataModel);
        };

        $scope.onOutputSelectorClick = function() {

            var modalInstance = $modal.open({
                templateUrl: 'views/directives/target-schema-selector.html',
                controller: 'TargetSchemaSelectorCtrl',
                resolve: {
                    project: function() {
                        return $scope.project;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.handleOutputSelected(selectedItem);
            });

        };

        $scope.collapse = function(schema) {
            schema.collapsed = !schema.collapsed;

            $timeout(function() {
                PubSub.broadcast('schemaCanvasUpdated', {});
            }, 0);

        };

        $scope.chevron = function(source) {
            return 'glyphicon-chevron-' + (source.collapsed ? 'right' : 'down');
        };
    })
    .directive('schema', function() {
        return {
            scope: true,
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/schema.html',
            controller: 'SchemaCtrl'
        };
    });

