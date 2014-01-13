'use strict';

angular.module('dmpApp')
    .controller('SchemaCtrl', ['$scope', '$timeout', 'schemaParser', '$q', '$modal', 'DataModelResource', 'SchemaDataResource', 'FileResource', 'ProjectResource', 'PubSub',
        function ($scope, $timeout, schemaParser, $q, $modal, DataModelResource, SchemaDataResource, FileResource, ProjectResource, PubSub) {
        $scope.internalName = 'Source Target Schema Mapper';

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

            delete dataModel['storage_type'];

            var targetSchema = schemaParser.fromDomainSchema(dataModel.schema);

            $scope.targetDataModel = dataModel;
            $scope.targetSchema = targetSchema;

            $scope.isTargetLoading = false;
            $scope.loadTargetError = '';
            $scope.isTargetLoaded = true;

            PubSub.broadcast('handleTargetSchemaSelected', targetSchema);
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

