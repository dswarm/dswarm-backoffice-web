'use strict';

angular.module('dmpApp')
    .controller('DmpEndpointSelectorCtrl', function ($scope, $modalInstance, endpointSet) {

        $scope.endpointSet = endpointSet;
        $scope.selectedSet = [];

        $scope.schemaListOptions = {
            data: 'endpointSet',
            columnDefs: [
                {field:'targetName', displayName:'Name'}
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedSet,
            multiSelect: false
        };


        $scope.onSelectClick = function() {
            $modalInstance.close($scope.selectedSet);
        };

        $scope.onNewClick = function() {
            $modalInstance.close(null);
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

    });
