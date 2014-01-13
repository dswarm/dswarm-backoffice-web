'use strict';

angular.module('dmpApp')
    .controller('ModelCtrl', ['$scope', '$routeParams', 'ProjectResource', 'schemaParser', 'PubSub',
        function($scope, $routeParams, ProjectResource, schemaParser, PubSub) {

        $scope.projectId = $routeParams.projectId;
        $scope.schemaId = $routeParams.schemaId;

        // Set default data.
        $scope.project = {
            id : 0,
            name : '',
            description : '',
            mappings : [],
            functions : [],
            input_data_model : {},
            output_data_model : {}
        };

        $scope.sourceDataModel = null;
        $scope.targetDataModel = null;
        $scope.currentSource = {};
        $scope.sources = [];

        $scope.selectSource = function(source) {

            $scope.currentSource.selected = false;

            PubSub.broadcast('handleLoadData', {
                dataModelId : source.dataModelId,
                schemaId : source.schemaId,
                resourceName : source.name
            });

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

        $scope.loadSourceData = function(projectId) {

            if (projectId) {

                ProjectResource.get({id: projectId}, function(project) {

                    var model = project.input_data_model;


                    $scope.sourceDataModel = model;

                    var sourceSchema = $scope.sourceDataModel['schema'];

                    $scope.addSource(
                        schemaParser.fromDomainSchema(sourceSchema),
                        model.id,
                        sourceSchema.id,
                        false,
                        true,
                        model.name
                    );

                });

            }

        };

        $scope.loadSourceData($routeParams.projectId);

    }]);
