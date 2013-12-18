'use strict';

angular.module('dmpApp')
    .controller('DataListCtrl', ['$scope', '$routeParams', 'DataModelResource', 'ResourceResource', 'Lo-Dash',
        function ($scope, $routeParams, DataModelResource, ResourceResource, loDash) {

        $scope.files = [];
        $scope.models = [];

        ResourceResource.query(function(results) {

            $scope.files = loDash.filter(results, function(result) {

                return !result.configurations || result.configurations.length === 0;
            });
        });

        DataModelResource.query(function(results) {

            $scope.models = loDash.map(results, function(result) {

                result['storage_type'] = result.configuration && result.configuration.parameters['storage_type'];

                return result;
            });
        });



        $scope.selectedSet = [];
        $scope.selectedModel = [];

        $scope.dataListOptions = {
            data: 'files',
            'columnDefs': [
                { field: 'name', displayName: 'Name' },
                { field: 'description', displayName: 'Description ' }
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedSet,
            multiSelect: false
        };

        $scope.modelListOptions = {
            data: 'models',
            columnDefs: [
                {field:'name', displayName:'Name'},
                {field:'description', displayName:'Description '},
                {field:'storage_type', displayName:'Configured Data Storage Type'}
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedModel,
            multiSelect: false
        };

    }]);
