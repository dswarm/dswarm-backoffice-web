'use strict';

angular.module('dmpApp')
    .controller('DataListCtrl', ['$scope', '$routeParams', 'FileResource', function ($scope, $routeParams, FileResource) {

        $scope.files = FileResource.query();
        $scope.selectedSet = [];

        $scope.dataListOptions ={
            data: 'files',
            "columnDefs": [
                {field:'name', displayName:'Name'},
                {field:'description', displayName:'Description '},
                {field:'storageType', displayName:'Data Storage Type '}
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedSet,
            multiSelect: false
        };


    }]);
