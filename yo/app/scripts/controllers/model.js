'use strict';

angular.module('dmpApp')
    .controller('ModelCtrl', ['$scope', '$routeParams', '$timeout', 'localStorageService', 'ProjectResource', 'schemaParser', 'PubSub',
    function($scope, $routeParams, $timeout, localStorageService, ProjectResource, schemaParser, PubSub) {

        /* jshint camelcase:false */

        $scope.projectId = $routeParams.projectId;

        // Mock project data for angular data handling
        $scope.project = {
            id : 0,
            name : '',
            description : '',
            mappings : [],
            functions : [],
            input_data_model : {},
            _$input_data_model_schema : {},
            output_data_model : {},
            _$output_data_model_schema : {}
        };

        $scope.isOutputDataModelLoaded = false;

        function getStorageDraftKey(projectId) {
            return 'project.draft.' + (projectId || $scope.project.id);
        }


        $scope.setOutputDataModel = function(dataModel) {
            $scope.project.output_data_model = dataModel;

            $scope.processOutputDataModel();
        };

        $scope.setOutputSchema = function(schema) {
            $scope.setOutputDataModel({schema: schema});
        };

        $scope.processOutputDataModel = function() {
            $scope.project._$output_data_model_schema = $scope.dataModelToSchema($scope.project.output_data_model);

            $scope.isOutputDataModelLoaded = true;

            PubSub.broadcast('outputDataSelected', {});
        };

        $scope.processInputDataModel = function() {
            $scope.project._$input_data_model_schema = $scope.dataModelToSchema($scope.project.input_data_model);

            PubSub.broadcast('inputDataSelected', { });
        };

        $scope.dataModelToSchema = function(dataModel) {
            return schemaParser.fromDomainSchema(dataModel.schema);
        };

        $scope.loadProjectData = function(projectId) {

            var draft = localStorageService.get(getStorageDraftKey(projectId));
            if (angular.isObject(draft) && +draft.id === +projectId) {

                $scope.restoreProject(draft);
            } else {

                ProjectResource.get({id: projectId}, function(project) {

                    $scope.restoreProject(project);
                });
            }
        };

        $scope.restoreProject = function(project) {

            $scope.project = project;

            if($scope.project.input_data_model) {
                $scope.processInputDataModel();
            }

            if($scope.project.output_data_model) {
                $scope.processOutputDataModel();
            }

        };

        $scope.onSaveProjectClick = function() {
            localStorageService.delete(getStorageDraftKey());
            ProjectResource.update({ id: $scope.project.id }, $scope.project, function() { });
        };

        $scope.saveProjectDraft = function(project) {
            var projectToSave = project || $scope.project;
            localStorageService.set(getStorageDraftKey(projectToSave.id), projectToSave);
            console.log('Project changed: ', projectToSave);
        };

        $scope.$watch('project', function(newValue, oldValue) {
            if (newValue === oldValue) {
                // initial call after registration
                return;
            }
            $scope.saveProjectDraft(newValue);
        }, true);

        $scope.loadProjectData($routeParams.projectId);

    }]);
