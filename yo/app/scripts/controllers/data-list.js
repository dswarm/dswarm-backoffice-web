'use strict';

angular.module('dmpApp')
    .controller('DataListCtrl', ['$scope', '$routeParams', 'FileResource', function ($scope, $routeParams, FileResource) {


        FileResource.query(function(result) {

            $scope.files = [];

            angular.forEach(result, function(value) {

                if(value.configurations) {
                    value['storage_type'] = value.configurations[value.configurations.length-1].parameters['storage_type'];
                }

                $scope.files.push(value);
            });

        });

        $scope.selectedSet = [];

        $scope.dataListOptions = {
            data: 'files',
            'columnDefs': [
                { field: 'name', displayName: 'Name' },
                { field: 'description', displayName: 'Description ' },
                { field: 'storage_type', displayName: 'Configured Data Storage Type ' }
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedSet,
            multiSelect: false
        };

    }]);
