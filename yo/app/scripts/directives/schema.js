'use strict';

angular.module('dmpApp')
    .controller('SchemaCtrl', ['$scope', '$timeout', 'schemaParser', '$q', '$modal', 'DataModelResource', 'SchemaDataResource', 'FileResource', 'PubSub',
        function ($scope, $timeout, schemaParser, $q, $modal, DataModelResource, SchemaDataResource, FileResource, PubSub) {
        $scope.internalName = 'Source Target Schema Mapper';

        $scope.sources = [];
        $scope.currentSource = {};
        $scope.targetSchema = {};

        $scope.isTargetLoading = false;
        $scope.isTargetLoaded = false;
        $scope.isSourceLoading = true;
        $scope.loadTargetError = '';

        $scope.onTargetSchemaSelectorClick = function() {

            var modalInstance = $modal.open({
                templateUrl: 'views/directives/target-schema-selector.html',
                controller: 'TargetSchemaSelectorCtrl'
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.handleTargetSchemaSelected(selectedItem);
            });

        };

        $scope.onAddDataClick = function() {
            PubSub.broadcast('handleOpenDataSelector', {});
        };

        $scope.collapse = function(schema) {
            schema.collapsed = !schema.collapsed;

            $timeout(function() {
                PubSub.broadcast('schemaCanvasUpdated', {});
            }, 0);

        };

        $scope.removeSource = function(source) {

            var index = $scope.sources.indexOf(source);
            $scope.sources.splice(index,1);

            $scope.currentSource = {};

            PubSub.broadcast('handleLoadData', { });


        };

        $scope.loadSourceData = function(dataModelId) {

            if (dataModelId) {

                DataModelResource.get({id: dataModelId}, function(model) {

                    var sourceSchema = model['schema'];

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

        $scope.chevron = function (source) {
            return 'glyphicon-chevron-' + (source.collapsed ? 'right' : 'down');
        };

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

        $scope.handleTargetSchemaSelected = function(dataModel) {

            $scope.targetSchema = schemaParser.fromDomainSchema(dataModel.schema);

            $scope.isTargetLoading = false;
            $scope.loadTargetError = '';
            $scope.isTargetLoaded = true;
        };

        PubSub.subscribe($scope, 'handleDataSelected', function(args) {

            var latestConfigurationId = 0;

            if(args.configurations) {

                angular.forEach(args.configurations, function(configuration) {

                    if(configuration.id >= latestConfigurationId) {

                        latestConfigurationId = configuration.id;

                    }

                });

            }

            $scope.loadSourceData(args.id, latestConfigurationId);
        });

        $scope.loadSourceData($scope.dataModelId);

    }])
    .directive('schema', [ function () {
        return {
            scope: true,
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/schema.html',
            controller: 'SchemaCtrl'
        };
    }]);

