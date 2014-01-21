'use strict';

angular.module('dmpApp')
    .controller('ModelCtrl', ['$scope', '$routeParams', '$timeout', 'ProjectResource', 'schemaParser', 'PubSub',
        function($scope, $routeParams, $timeout, ProjectResource, schemaParser, PubSub) {

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
            $input_data_model_schema : {},
            output_data_model : {},
            $output_data_model_schema : {}
        };

        $scope.isOutputDataModelLoaded = false;

        $scope.setOutputDataModel = function(dataModel) {
            $scope.project.output_data_model = dataModel;

            $scope.processOutputDataModel();
        };

        $scope.processOutputDataModel = function() {
            $scope.project.$output_data_model_schema = $scope.dataModelToSchema($scope.project.output_data_model);

            $scope.isOutputDataModelLoaded = true;

            PubSub.broadcast('outputDataSelected', {});
        }

        $scope.processInputDataModel = function() {
            $scope.project.$input_data_model_schema = $scope.dataModelToSchema($scope.project.input_data_model);

            PubSub.broadcast('inputDataSelected', { });
        }

        $scope.dataModelToSchema = function(dataModel) {
            return schemaParser.fromDomainSchema(dataModel.schema);
        };

        $scope.loadProjectData = function(projectId) {

            ProjectResource.get({id: projectId}, function(project) {

                $scope.project = project;

                if($scope.project.input_data_model) {
                    $scope.processInputDataModel();
                }

                if($scope.project.output_data_model) {
                    $scope.processOutputDataModel();
                }

            });

        };

        $scope.onSaveProjectClick = function() {
            ProjectResource.update({ id: $scope.project.id }, $scope.project, function() { });
        };

        $scope.$watch('project', function(newValue) {
            console.log('Project changed: ', newValue);
        }, true);

        $scope.loadProjectData($routeParams.projectId);

    }]);
