'use strict';

angular.module('dmpApp')
    .controller('SourceDataCtrl', ['$scope', '$http', '$q', 'schemaParser', 'SchemaDataResource', function ($scope, $http, $q, schemaParser, SchemaDataResource) {
        $scope.internalName = 'Source Data Widget';

        $scope.data = {};

        var schemaPromise, dataPromise,
            schemaTransformer, dataTransformer,
            scopeSetter;

        if ($scope.resourceId && $scope.configId) {
            schemaPromise = SchemaDataResource.schema({
                id: $scope.resourceId,
                cid: $scope.configId
            }).$promise;

            schemaTransformer = function(res) {
                return res['data'];
            };

            dataPromise = SchemaDataResource.data({
                id: $scope.resourceId,
                cid: $scope.configId,
                atMost: 3
            }).$promise;

            dataTransformer = angular.identity;

            scopeSetter = function(schemaResult, dataResult) {
                var records = [];
                angular.forEach(dataResult, function(record) {
                    records.push({
                        id: record.recordId,
                        data: schemaParser.parseAny(record, schemaResult['title'], schemaResult)
                    });
                });

                $scope.records = records;
            }

        } else {
            schemaPromise = $http.get('/data/schema.json');
            dataPromise = $http.get('/data/record.json');

            schemaTransformer = function(res) {
                return res['data'];
            };

            dataTransformer = function(res) {
                return res['data'];
            };

            scopeSetter = function(schemaResult, dataResult) {
                $scope.data = schemaParser.parseAny(
                    dataResult[schemaResult['title']], schemaResult['title'], schemaResult);
            }
        }

        var allPromise = $q.all([schemaPromise, dataPromise]);

        allPromise.then(function (result) {
            var schemaResult = schemaTransformer(result[0])
                , dataResult = dataTransformer(result[1]);

            scopeSetter(schemaResult, dataResult);
        });
    }])
    .directive('sourceData', [ function () {
        return {
            scope: {
                'resourceId': '@',
                'configId': '@'
            },
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/source-data.html',
            controller: 'SourceDataCtrl'
        };
    }]);
