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
    .controller('CopyOrMigrateMappingsCtrl', function($scope, $window, $http, $q, $modal, $modalInstance, loDash, ngProgress, showAlert, DataModelResource, ProjectResource, dataModels, projects) {

        $scope.internalName = 'Copy Or Migrate Mappings Widget';

        $scope.alerts = [];

        $scope.closeAlert = function(idx) {
            if (angular.isDefined(idx) && $scope.alerts.length > idx) {
                $scope.alerts.splice(idx, 1);
            }
        };

        $scope.dataModels = dataModels;
        $scope.projects = projects;

        $scope.selectedDataModel = [];
        $scope.selectedProject = [];

        var isNewProjectsHasBeenCreated = false;

        $scope.updateGridData = function() {

            DataModelResource.query({ format : 'medium' }, function(results) {

                $scope.dataModels = loDash.filter(results, 'data_resource');

            }, function() {
                $scope.dataModels = '';
            });

            ProjectResource.query({ format : 'short' }, function(projects) {

                $scope.projects = projects;

            }, function() {
                $scope.projects = '';
            });

        };

        $scope.dataModelGridContent = {
            data: 'dataModels',
            columnDefs: [
                {field: 'uuid', displayName: 'Id'},
                {field: 'name', displayName: 'Name'},
                {field: 'description', displayName: 'Description '},
                {field: 'schema.name', displayName: 'Schema name'}
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedDataModel,
            multiSelect: false
        };

        $scope.projectGridContent = {
            data: 'projects',
            columnDefs: [
                {field: 'uuid', displayName: 'Id'},
                {field: 'name', displayName: 'Name'},
                {field: 'description', displayName: 'Description '}
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedProject,
            multiSelect: false
        };

        function createMigrationStatusMessage(inputDataModelId, referenceProjectId, type) {
            var actionMsg = type;
            var itemMsg = 'mappings from reference project ' + referenceProjectId + ' to a new project';
            var additionalItemMsg = '';

            if(inputDataModelId) {

                additionalItemMsg = 'with help of the schema from input data model ' + inputDataModelId;
            }

            return function(statusMsg) {
                return [actionMsg, itemMsg, additionalItemMsg, statusMsg].join(' ');
            };
        }

        $scope.copyMappings = function() {

            var selectedProject = $scope.selectedProject[0];
            var referenceProjectId = selectedProject.uuid;

            var payload = {
                reference_project: referenceProjectId
            };

            var finishMessage = createMigrationStatusMessage(null, referenceProjectId, 'Copying');

            ngProgress.start();

            var dataModelIdPromise = $q.defer();



            if($scope.selectedDataModel.length > 0) {

                dataModelIdPromise.resolve($scope.selectedDataModel.uuid);
            } else {

                // utilise input data model from project
                ProjectResource.get({id: referenceProjectId}, function(project) {

                    dataModelIdPromise.resolve(project.input_data_model.uuid);
                }, dataModelIdPromise.reject);
            }

            dataModelIdPromise.promise.then(function(dataModelId) {

                payload.input_data_model = dataModelId;

                finishMessage = createMigrationStatusMessage(dataModelId, referenceProjectId, 'Copying');

                return ProjectResource.createProjectWithHelpOfExistingEntities({}, payload).$promise;
            }).then(function() {


                ngProgress.complete();
                showAlert.show($scope, 'info', finishMessage('successfully finished.'));

                $scope.updateGridData();

                isNewProjectsHasBeenCreated = true;
            }, function(resp) {

                ngProgress.complete();
                showAlert.show($scope, 'danger', finishMessage('failed.'), 5000);

                console.log(resp);

                $window.alert(resp.message || resp.data.error);
            });
        };

        $scope.migrateMappings = function() {


        };

        $scope.showHelp = function() {

            $modal.open({
                templateUrl: 'views/controllers/copy-or-migrate-mappings-help.html'
            });
        };

        $scope.save = function() {

            var result = {
                newProjectsHasBeenCreated: isNewProjectsHasBeenCreated
            };

            $modalInstance.close(result);
        };

    });
