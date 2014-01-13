'use strict';

angular.module('dmpApp')
    .controller('SchemaListCtrl', ['$scope', 'ResourceResource', 'Util', function ($scope, ResourceResource, Util) {

        $scope.files = [];

        //TODO: load from SchemaResource or the like
        ResourceResource.query(function(results) {

            console.log(results);

            //noinspection FunctionWithInconsistentReturnsJS
            $scope.files = Util.collect(results, Util.mapResources(function(resource, config) {
                if (config && config['parameters']['storage_type'] === 'schema') {
                    return resource;
                }
            }));
        });

        $scope.schemaListOptions = {
            data: 'files',
            columnDefs: [
                {field:'name', displayName:'Name'},
                {field:'description', displayName:'Description '}
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedSet,
            multiSelect: false
        };


    }])
    .directive('schemalist', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/schema-list.html',
            controller: 'SchemaListCtrl'
        };
    }]);
