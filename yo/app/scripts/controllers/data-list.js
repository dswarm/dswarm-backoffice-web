'use strict';

angular.module('dmpApp')
    .controller('DataListCtrl', function($scope, $routeParams, DataModelResource, ResourceResource, ProjectResource, fileDownload, loDash, Neo4jEndpoint) {

        $scope.files = [];
        $scope.models = [];
        $scope.newProject = {};
        $scope.projects = [];

        $scope.selectedSet = [];
        $scope.selectedModel = [];
        $scope.selectedProject = [];

        $scope.onUseForNewProjectClick = function(model, newProject) {

            var inputDataModel = model[0];
            delete inputDataModel['storage_type'];

            var project = {
                'input_data_model': inputDataModel,
                'name': newProject.name,
                'description': newProject.description
            };

            ProjectResource.save({}, project, function() {
                $scope.updateGridData();
                newProject.name = '';
                newProject.description = '';
            });

        };

        $scope.deleteResource = function(resourceId) {
            ResourceResource.remove({id: resourceId}, {}, function() {
                $scope.selectedSet.length = 0;
                $scope.updateGridData();
            });
        };

        $scope.deleteDataModel = function(dataModelId) {
            DataModelResource.remove({id: dataModelId}, {}, function() {
                $scope.selectedModel.length = 0;
                $scope.updateGridData();
            });
        };

        $scope.onProjectDeleteClick = function(project) {
            ProjectResource.remove({id: project.id}, {}, function() {
                $scope.selectedProject.length = 0;
                $scope.updateGridData();
            });
        };

        $scope.onProjectExportClick = function(project) {
            // TODO: call actual endpoint
            console.log('project export', project, 'neo4j is at', Neo4jEndpoint);
        };

        $scope.onExportAllClick = function(format) {
            var fileUrl = Neo4jEndpoint + 'rdf/getall?format=' + encodeURIComponent(format);

            fileDownload(fileUrl);
        };

        $scope.updateGridData = function() {

            ResourceResource.query(function(results) {

                $scope.files = results;

            }, function() {
                $scope.files = '';
            });

            DataModelResource.query(function(results) {

                $scope.models = loDash.filter(results, 'data_resource');

                $scope.models = loDash.map($scope.models, function(result) {

                    result['storage_type'] = result.configuration && result.configuration.parameters['storage_type'];

                    return result;
                });
            }, function() {
                $scope.models = '';
            });

            ProjectResource.query(function(projects) {

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
                {field: 'storage_type', displayName: 'Configured Data Storage Type'}
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
