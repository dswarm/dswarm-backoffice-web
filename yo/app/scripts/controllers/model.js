'use strict';

angular.module('dmpApp')
    .controller('ModelCtrl', ['$scope', '$routeParams', '$timeout', 'ProjectResource', 'schemaParser', 'PubSub',
        function($scope, $routeParams, $timeout, ProjectResource, schemaParser, PubSub) {

        /* jshint camelcase:false */

        $scope.projectId = $routeParams.projectId;
        $scope.schemaId = $routeParams.schemaId;

        // Mock project data for angular data handling
        $scope.project = {
            id : 0,
            name : '',
            description : '',
            mappings : [],
            functions : [],
            input_data_model : {},
            output_data_model : {}
        };

        $scope.currentSource = {};
        $scope.sources = [];

        $scope.targetSchema = {};

        $scope.isTargetLoading = false;
        $scope.isTargetLoaded = false;
        $scope.isSourceLoading = true;
        $scope.loadTargetError = '';

        $scope.selectSource = function(source) {

            $scope.currentSource.selected = false;

            // Give the listener a second to build up
            $timeout(function() {

                PubSub.broadcast('handleLoadData', {
                    dataModelId : source.dataModelId,
                    schemaId : source.schemaId,
                    resourceName : source.name
                });

            }, 1);

            $scope.currentSource = source;
            $scope.currentSource.selected = true;
        };

        $scope.addSource = function(schema, dataModelId, schemaId, collpased, selected, name) {

            var newSource = {
                name : name,
                dataModelId : dataModelId,
                schemaId : schemaId,
                schema : schema,
                collapsed : collpased,
                selected : selected

            };

            $scope.sources.push(newSource);
            $scope.selectSource(newSource);

        };

        $scope.removeSource = function(source) {

            var index = $scope.sources.indexOf(source);
            $scope.sources.splice(index,1);

            $scope.currentSource = {};

            PubSub.broadcast('handleLoadData', { });

        };

        $scope.handleOutputDataModel = function() {

            var targetSchema = schemaParser.fromDomainSchema($scope.project.output_data_model.schema);

            $scope.targetSchema = targetSchema;

            $scope.isTargetLoading = false;
            $scope.loadTargetError = '';
            $scope.isTargetLoaded = true;

            PubSub.broadcast('handleTargetSchemaSelected', targetSchema);

        };

        $scope.handleInputDataModel = function() {

            $scope.addSource(
                schemaParser.fromDomainSchema($scope.project.input_data_model.schema),
                $scope.project.input_data_model.id,
                $scope.project.input_data_model.schema.id,
                false,
                true,
                $scope.project.input_data_model.name
            );

        };

        $scope.loadProjectData = function(projectId) {

            ProjectResource.get({id: projectId}, function(project) {

                $scope.project = project;

                if($scope.project.input_data_model) {
                    $scope.handleInputDataModel();
                }

                if($scope.project.output_data_model) {
                    $scope.handleOutputDataModel();
                }

            });

        };

        $scope.onSaveProjectClick = function() {
            ProjectResource.update({ id: $scope.project.id }, $scope.project, function() { });
        };

        $scope.loadProjectData($routeParams.projectId);

    }]);
