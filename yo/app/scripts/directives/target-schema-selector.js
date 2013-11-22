'use strict';

angular.module('dmpApp')
    .controller('TargetSchemaSelectorCtrl', ['$scope', '$http', '$q', '$modalInstance', 'schemaParser', 'PubSub', function ($scope, $http, $q, $modalInstance, schemaParser, PubSub) {

        $scope.result = {};

        $scope.selectedSet = [];

        $scope.onSelectClick = function() {
            $modalInstance.close($scope.selectedSet[0]);
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

    }]);
