'use strict';

angular.module('dmpApp')
    .controller('TargetSchemaSelectorCtrl', function($scope, $modalInstance, $modal, project, Util, DataModelResource, endpointLabel) {

        $scope.result = {};

        $scope.selectedSet = [];

        $scope.project = project;

        $scope.onSelectClick = function() {

            if ($scope.project.output_data_model) {

                var modalInstanceConfirm = $modal.open({
                    templateUrl: 'views/controllers/confirm-model-change.html'
                });

                modalInstanceConfirm.result.then(function() {
                    $modalInstance.close($scope.selectedSet[0]);
                });

            } else {
                $modalInstance.close($scope.selectedSet[0]);
            }

        };

        $scope.onNewClick = function() {

            endpointLabel.ask('Name the new Schema', 'The name has to be at least 3 characters long').then(function(modalData) {

                DataModelResource.save({}, Util.buildNewDataModel(modalData.label), function(datamodel) {
                    $modalInstance.close(datamodel);
                });

            });

        };

        $scope.close = function() {
            $modalInstance.dismiss('cancel');
        };

    });
