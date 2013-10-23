'use strict';

angular.module('dmpApp')
    .controller('SchemaCtrl', ['$scope', '$http', 'schemaParser', '$q', 'SchemaDataResource', 'FileResource', 'PubSub', function ($scope, $http, schemaParser, $q, SchemaDataResource, FileResource, PubSub) {
        $scope.internalName = 'Source Target Schema Mapper';

        $scope.sources = [];
        $scope.currentSource = {};
        $scope.targetSchema = {};

        $scope.isTargetLoading = false;
        $scope.isSourceLoading = true;
        $scope.loadTargetError = '';

        $scope.onTargetSchemaSelectorClick = function() {
            PubSub.broadcast('handleOpenTargetSchemaSelector', {});
        };

        $scope.onAddDataClick = function() {
            PubSub.broadcast('handleOpenDataSelector', {});
        };

        $scope.collapse = function(schema) {
            schema.collapsed = (schema.collapsed) ? false : true;
        };

        $scope.removeSource = function(source) {

            var index=$scope.sources.indexOf(source)
            $scope.sources.splice(index,1);

            $scope.currentSource = {};

            PubSub.broadcast('handleLoadData', { });


        };

        $scope.loadSourceData = function(resourceId, configId) {

            var sourcePromise, resourcePromise,
                sourceTransformer;

            if (angular.isDefined(resourceId) && angular.isDefined(configId)) {
                sourcePromise = SchemaDataResource.schema({
                    id: resourceId,
                    cid: configId
                }).$promise;

                resourcePromise = FileResource.get({
                    id: resourceId
                }).$promise;

                sourceTransformer = function(res) {
                    return res['data'];
                };

                var allPromise = $q.all([sourcePromise, resourcePromise]);

                allPromise.then(function (result) {
                    var sourceSchema = sourceTransformer(result[0]),
                        resourceData = result[1];

                    $scope.addSource(
                        schemaParser.mapData(sourceSchema['title'], sourceSchema),
                        resourceId,
                        configId,
                        true,
                        true,
                        resourceData.name
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
                resourceId : source.resourceId,
                configId : source.configId,
                resourceName : source.name
            });

            $scope.currentSource = source;
            $scope.currentSource.selected = true;
        };

        $scope.loadSourcePreview = function(source) {
            $scope.selectSource(source);
        };

        $scope.addSource = function(schema, resourceId, configId, collpased, selected, name) {

            $scope.sources.push(
                {
                    name : name,
                    resourceId : resourceId,
                    configId : configId,
                    schema : schema,
                    collapsed : collpased,
                    selected : selected

                }
            );

            $scope.selectSource($scope.sources[$scope.sources.length-1]);

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

        PubSub.subscribe($scope, 'handleTargetSchemaSelected', function(args) {
            var latestConfigurationId = 0;

            $scope.isTargetLoading = true;
            $scope.loadTargetError = '';

            angular.forEach(args.configurations, function(configuration) {

                if(configuration.id >= latestConfigurationId) {
                    latestConfigurationId = configuration.id;
                }

            });

            SchemaDataResource.schema({
                id: args.id,
                cid: latestConfigurationId
            }, function(result) {
                $scope.targetSchema = schemaParser.mapData(result.data['title'], result.data);

                $scope.isTargetLoading = false;
                $scope.loadTargetError = '';
            }, function(error) {

                if(error && error.status === 404) {
                    $scope.loadTargetError = 'please choose a configured schema';
                } else {
                    $scope.loadTargetError = 'error laoding chosen schema';
                }

                $scope.isTargetLoading = false;

            });

        });

        $scope.loadSourceData($scope.resourceId, $scope.configId);

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

