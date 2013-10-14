'use strict';

angular.module('dmpApp')
    .controller('SchemaListCtrl', ['$scope', 'FileResource', 'Util', function ($scope, FileResource, Util) {

        $scope.files = [];

        FileResource.query(function(result) {

            $scope.files = [];

            angular.forEach(result, function(value) {

                if(value.configurations) {

                    var latestConfig = Util.latestBy(value.configurations);
                    value['storage_type'] = latestConfig.parameters['storage_type'];
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
