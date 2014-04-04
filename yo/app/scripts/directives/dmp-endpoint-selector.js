'use strict';

angular.module('dmpApp')
    .controller('DmpEndpointSelectorCtrl', function($scope, $modalInstance, endpointSet, $log) {

        $scope.endpointSet = endpointSet;
        $scope.selectedSet = [];

        $log.debug(endpointSet);

        $scope.schemaListOptions = {
            data: 'endpointSet',
            columnDefs: [
                {field: 'sourceName', displayName: 'Source'},
                {field: 'targetName', displayName: 'Target'},
                {field: 'label', displayName: 'Name'}
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedSet,
            multiSelect: false
        };
    });
