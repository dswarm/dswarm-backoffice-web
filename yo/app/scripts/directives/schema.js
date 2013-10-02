'use strict';

angular.module('dmpApp')
    .controller('SchemaCtrl', ['$scope', '$http', 'schemaParser', '$q', 'SchemaDataResource', function ($scope, $http, schemaParser, $q, SchemaDataResource) {
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

