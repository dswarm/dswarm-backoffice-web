'use strict';

angular.module('dmpApp')
    .controller('DataListCtrl', ['$scope', '$routeParams', 'FileResource', function ($scope, $routeParams, FileResource) {

        FileResource.query(function(results) {

            $scope.files = [];

            angular.forEach(results, function(result) {

                if(result.configurations) {

                    var latestConfigurationId = 0;

                    angular.forEach(result.configurations, function(configuration) {

                        if(configuration.id >= latestConfigurationId) {

                            latestConfigurationId = configuration.id;
                            result['storage_type'] = configuration.parameters['storage_type'];

                        }

                    });

                }

                $scope.files.push(result);
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
