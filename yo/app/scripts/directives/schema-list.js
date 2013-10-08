'use strict';

angular.module('dmpApp')
    .controller('SchemaListCtrl', ['$scope', 'FileResource', function ($scope, FileResource) {

        $scope.files = [];

        FileResource.query(function(result) {

            $scope.files = [];

            angular.forEach(result, function(value) {

                if(value.configurations) {
                    value['storage_type'] = value.configurations[value.configurations.length-1].parameters['storage_type'];
                }

                $scope.files.push(value);
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
