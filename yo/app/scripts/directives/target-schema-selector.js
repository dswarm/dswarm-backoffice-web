/**
 * Copyright (C) 2013 – 2015  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 * http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
