'use strict';

angular.module('dmpApp')
    .controller('SchemaListCtrl', ['$scope', 'ResourceResource', 'SchemaResource', 'Util', function ($scope, ResourceResource, SchemaResource, Util) {

        $scope.files = [];

        if ($scope.from === 'resources') {

            ResourceResource.query(function(results) {

                //noinspection FunctionWithInconsistentReturnsJS
                $scope.files = Util.collect(results, Util.mapResources(function(resource, config) {
                    if (config && config['parameters']['storage_type'] === 'schema') {
                        return resource;
                    }
                }));
            });
        } else {

            SchemaResource.query(function(results) {

                //noinspection FunctionWithInconsistentReturnsJS
                $scope.files = Util.collect(results, function(schema) {
                    if (schema['attribute_paths'].length) {
                        schema._$description = schema['attribute_paths'].length + ' attribute paths, record class: ' + (schema['record_class'] || {}).name;
                        return schema;
                    }
                });
            });
        }

        $scope.schemaListOptions = {
            data: 'files',
            columnDefs: [
                {field:'name', displayName:'Name'},
                {field:'_$description', displayName:'Description '}
            ],
            enableColumnResize: false,
            selectedItems: $scope.items,
            multiSelect: false
        };


    }])
    .directive('schemalist', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                from: '@',
                items: '='
            },
            templateUrl: 'views/directives/schema-list.html',
            controller: 'SchemaListCtrl'
        };
    }]);
