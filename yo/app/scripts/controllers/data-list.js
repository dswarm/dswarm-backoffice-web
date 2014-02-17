'use strict';

angular.module('dmpApp')
    .controller('DataListCtrl', ['$scope', '$routeParams', 'DataModelResource', 'ResourceResource', 'ProjectResource', 'loDash',
        function ($scope, $routeParams, DataModelResource, ResourceResource, ProjectResource, loDash) {

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
            });

        };

        $scope.onProjectDeleteClick = function(project) {
            ProjectResource.remove({id : project[0].id}, {}, function() {
                $scope.updateGridData();
            });
        };

        $scope.updateGridData = function() {

            ResourceResource.query(function(results) {

                $scope.files = results;

            }, function() { $scope.files = ''; });

            DataModelResource.query(function(results) {

                $scope.models = loDash.map(results, function(result) {

                    result['storage_type'] = result.configuration && result.configuration.parameters['storage_type'];

                    return result;
                });
            }, function() { $scope.models = ''; });

            ProjectResource.query(function(projects) {

                $scope.projects = projects;

            }, function() { $scope.projects = ''; });

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
                {field:'name', displayName:'Name'},
                {field:'description', displayName:'Description '},
                {field:'storage_type', displayName:'Configured Data Storage Type'}
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedModel,
            multiSelect: false
        };

        $scope.projectListOptions = {
            data: 'projects',
            columnDefs: [
                {field:'name', displayName:'Name'},
                {field:'description', displayName:'Description '}
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedProject,
            multiSelect: false
        };

        $scope.updateGridData();



    }]);
