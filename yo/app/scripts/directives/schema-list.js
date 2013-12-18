'use strict';

angular.module('dmpApp')
    .controller('SchemaListCtrl', ['$scope', 'ResourceResource', 'DataModelResource', 'Lo-Dash', function ($scope, ResourceResource, DataModelResource, loDash) {

        $scope.files = [];

        DataModelResource.query(function(results) {

            $scope.files = loDash.map(results, function(result) {

                result['storage_type'] = result.configuration && result.configuration.parameters['storage_type'];

                return result;
            });
        });

        $scope.schemaListOptions = {
            data: 'files',
            columnDefs: [
                {field:'name', displayName:'Name'},
                {field:'description', displayName:'Description '},
                {field:'storage_type', displayName:'Configured Data Storage Type '}
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
