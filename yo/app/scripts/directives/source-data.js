'use strict';

angular.module('dmpApp')
    .controller('SourceDataCtrl', ['$scope', '$http', '$q', 'schemaParser', 'DataModelResource', 'SchemaResource', 'SchemaDataResource', 'PubSub',
        function ($scope, $http, $q, schemaParser, DataModelResource, SchemaResource, SchemaDataResource, PubSub) {
        $scope.internalName = 'Source Data Widget';

        $scope.data = {};
        $scope.records = [];
        $scope.schema = {};

        $scope.showData = false;

        $scope.resourceName = '';

        $scope.dataInclude = function() {
            return $scope.showData ? 'sourcedata' : '';
        };

        PubSub.subscribe($scope, 'handleLoadData', function(args) {

            if(args && args.dataModelId) {

                $scope.loadData(args.dataModelId, args.schemaId, args.resourceName);
            } else {

                $scope.data = {};
                $scope.showData = false;
                $scope.resourceName = '';
            }

        });

        PubSub.subscribe($scope, 'getLoadData', function() {

            PubSub.broadcast('returnLoadData', {
                record : $scope.records[0],
                schema : $scope.schema
            });

        });

        $scope.loadData = function(dataModelId, schemaId, resourceName) {

            var schemaPromise, dataPromise,
                scopeSetter;

            $scope.resourceName = resourceName;

            if (dataModelId && schemaId) {

                dataPromise = DataModelResource.data({
                    id: dataModelId,
                    atMost: 3
                }).$promise;

                schemaPromise = SchemaResource.get({
                    id: schemaId
                }).$promise;

                scopeSetter = function(schemaResult, dataResult) {

                    var records = [];
                    angular.forEach(dataResult, function(record) {
                        records.push({
                            id: record.recordId,
                            data: schemaParser.parseFromDomainSchema(record, schemaResult)
                        });
                    });

                    $scope.schema = schemaResult;

                    $scope.records = records;

                    $scope.showData = true;

                };

            }

            var allPromise = $q.all([schemaPromise, dataPromise]);

            allPromise.then(function (result) {

                var schemaResult = result[0]
                    , dataResult = result[1];

                scopeSetter(schemaResult, dataResult);
            });


        };


    }])
    .directive('sourceData', [ function () {
        return {
            scope : true,
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/source-data.html',
            controller: 'SourceDataCtrl'
        };
    }]);
