'use strict';

angular.module('dmpApp')
    .controller('TargetSchemaSelectorCtrl', function ($scope, $modalInstance, $modal, project) {

        $scope.result = {};

        $scope.selectedSet = [];

        $scope.project = project;

        $scope.onSelectClick = function() {

            if($scope.project.output_data_model) {

                var modalInstanceConfirm = $modal.open({
                    templateUrl: 'views/controllers/confirm-model-change.html'
                });

                modalInstanceConfirm.result.then(function () {
                    $modalInstance.close($scope.selectedSet[0]);
                });

            } else {
                $modalInstance.close($scope.selectedSet[0]);
            }

        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

    });
