'use strict';

angular.module('dmpApp')
    .controller('SchemaCtrl', ['$scope', '$http', 'schemaParser', '$q', 'SchemaDataResource', 'PubSub', function ($scope, $http, schemaParser, $q, SchemaDataResource, PubSub) {
        $scope.internalName = 'Source Target Schema Mapper';

        $scope.sourceSchema = {};
        $scope.targetSchema = {};


        var sourcePromise, targetPromise,
            sourceTransformer, targetTransformer;

        if (angular.isDefined($scope.resourceId) && angular.isDefined($scope.configId)) {
            sourcePromise = SchemaDataResource.schema({
                id: $scope.resourceId,
                cid: $scope.configId
            }).$promise;

            sourceTransformer = function(res) {
                return res['data'];
            };

            targetPromise = $http.get('/data/targetschema.json');
            targetTransformer = function(res) {
                return res['data'];
            };

        } else {
            sourcePromise = $http.get('/data/schema.json');
            targetPromise = $http.get('/data/targetschema.json');

            sourceTransformer = function(res) {
                return res['data'];
            };

            targetTransformer = function(res) {
                return res['data'];
            };
        }

        var allPromise = $q.all([sourcePromise, targetPromise]);

        allPromise.then(function (result) {
            var sourceSchema = sourceTransformer(result[0])
                , targetSchema = targetTransformer(result[1]);

            $scope.sourceSchema = schemaParser.mapData(sourceSchema['title'], sourceSchema);
            $scope.targetSchema = schemaParser.mapData(targetSchema['title'], targetSchema);

        });

        $scope.onTargetSchemaSelectorClick = function() {
            PubSub.broadcast('handleOpenTargetSchemaSelector', {});
        };

        PubSub.subscribe($scope, 'handleTargetSchemaSelected', function(args) {
            var latestConfigurationId = 0;

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
            });

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

