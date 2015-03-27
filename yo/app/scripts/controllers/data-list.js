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
    .controller('DataListCtrl', function($scope, $routeParams, $modal, DataModelResource, ResourceResource, ProjectResource, flashMessage, fileDownload, loDash, Neo4jEndpoint, GUID) {

        $scope.files = [];
        $scope.models = [];
        $scope.newProject = {};
        $scope.projects = [];

        $scope.selectedSet = [];
        $scope.selectedModel = [];
        $scope.selectedProject = [];

        $scope.onUseForNewProjectClick = function(model, newProject) {

            var inputDataModel = model[0];

            var project = {
                'input_data_model': inputDataModel,
                'name': newProject.name,
                'description': newProject.description,
                'uuid': GUID.uuid4()
            };

            ProjectResource.save({}, project, function() {
                $scope.updateGridData();
                newProject.name = '';
                newProject.description = '';
            });

        };

        function errorHandler(what) {
            return function(err) {
                var error = err.message || err.data.error;
                flashMessage.failure('Error while deleting ' + what + ': ' + error, {timeout: 5000});
            };
        }

        function successHandler(grid, what) {
            return function() {
                flashMessage.success('Successfully deleted ' + what, { timeout: 3000 });
                grid.length = 0;
                $scope.updateGridData();
            };
        }

        var resources = {
            Resource: {
                resource: ResourceResource,
                grid: $scope.selectedSet,
                templateUrl: 'views/controllers/confirm-remove-resource.html'
            },
            DataModel: {
                resource: DataModelResource,
                grid: $scope.selectedModel,
                templateUrl: 'views/controllers/confirm-remove-resource.html'
            },
            Project: {
                resource: ProjectResource,
                grid: $scope.selectedProject,
                templateUrl: 'views/controllers/confirm-remove-resource.html'
            }
        };

        function deleteItem(item, obj) {
            var resource = resources[item].resource;
            var grid = resources[item].grid;
            var what = item + ' ' + obj.name;
            var templateUrl = resources[item].templateUrl;

            var modalInstance = $modal.open({
                templateUrl: templateUrl
            });

            modalInstance.result.then(function() {

                resource.remove({id: obj.uuid}, {},
                    successHandler(grid, what), errorHandler(what));

            });

        }

        $scope.onResourceDeleteClick = loDash.partial(deleteItem, 'Resource');
        $scope.onDataModelDeleteClick = loDash.partial(deleteItem, 'DataModel');
        $scope.onProjectDeleteClick = loDash.partial(deleteItem, 'Project');

        $scope.onProjectExportClick = function(project) {
            // TODO: call actual endpoint
            console.log('project export', project, 'neo4j is at', Neo4jEndpoint);
        };

        $scope.onExportAllClick = function(format) {
            var fileUrl = Neo4jEndpoint + 'rdf/getall?format=' + encodeURIComponent(format);

            fileDownload(fileUrl);
        };

        $scope.updateGridData = function() {

            ResourceResource.query({ format : 'short' }, function(results) {

                $scope.files = results;

            }, function() {
                $scope.files = '';
            });

            DataModelResource.query({ format : 'medium' }, function(results) {

                $scope.models = loDash.filter(results, 'dataResource');

            }, function() {
                $scope.models = '';
            });

            ProjectResource.query({ format : 'short' }, function(projects) {

                $scope.projects = projects;

            }, function() {
                $scope.projects = '';
            });

        };


        $scope.dataListOptions = {
            data: 'files',
            'columnDefs': [
                { field: 'name', displayName: 'Name' },
                { field: 'description', displayName: 'Description ' }
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedSet,
            multiSelect: false
        };

        $scope.modelListOptions = {
            data: 'models',
            columnDefs: [
                {field: 'name', displayName: 'Name'},
                {field: 'description', displayName: 'Description '},
                {field: 'configuration.parameters.storage_type', displayName: 'Configured Data Storage Type'}
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedModel,
            multiSelect: false
        };

        $scope.projectListOptions = {
            data: 'projects',
            columnDefs: [
                {field: 'name', displayName: 'Name'},
                {field: 'description', displayName: 'Description '}
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedProject,
            multiSelect: false
        };

        $scope.updateGridData();


    });
