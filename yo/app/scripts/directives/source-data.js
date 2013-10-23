'use strict';

angular.module('dmpApp')
    .controller('SourceDataCtrl', ['$scope', '$http', '$q', 'schemaParser', 'SchemaDataResource', 'PubSub', function ($scope, $http, $q, schemaParser, SchemaDataResource, PubSub) {
        $scope.internalName = 'Source Data Widget';

        $scope.data = {};

        $scope.showData = false;

        $scope.resourceName = '';

        $scope.dataInclude = function() {
            return $scope.showData ? 'sourcedata' : '';
        };

        PubSub.subscribe($scope, 'handleLoadData', function(args) {

            if(args && args.resourceId) {
                $scope.loadData(args.resourceId, args.configId, args.resourceName);
            } else {
                $scope.data = {};
                $scope.showData = false;
                $scope.resourceName = '';
            }

        });

        $scope.loadData = function(resourceId, configId, resourceName) {

            var schemaPromise, dataPromise,
                schemaTransformer, dataTransformer,
                scopeSetter;

            $scope.resourceName = resourceName;

            if (resourceId && configId) {
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

                    $scope.showData = true;

                };

            }

            var allPromise = $q.all([schemaPromise, dataPromise]);

            allPromise.then(function (result) {
                var schemaResult = schemaTransformer(result[0])
                    , dataResult = dataTransformer(result[1]);

                scopeSetter(schemaResult, dataResult);
            });

        };


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
