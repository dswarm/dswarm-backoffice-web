'use strict';

angular.module('dmpApp')
    .controller('MultipleInputComponentSelectorCtrl', function($scope, $modalInstance, componentSet, $log) {

        $scope.componentSet = componentSet;
        $scope.selectedSet = [];

        $log.debug(componentSet);

        $scope.endpointListOptions = {
            data: 'componentSet',
            columnDefs: [
                {field: 'display', displayName: 'Name'}
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedSet,
            multiSelect: false
        };
    });
