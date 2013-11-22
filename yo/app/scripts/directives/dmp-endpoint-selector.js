'use strict';

angular.module('dmpApp')
    .controller('DmpEndpointSelectorCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        $scope.result = {};

        $scope.selectedSet = [];

        $scope.onSelectClick = function() {
            $modalInstance.close({});
        };

        $scope.onNewClick = function() {
            $modalInstance.close(null);
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

    }]);
