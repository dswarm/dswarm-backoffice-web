'use strict';

angular.module('dmpApp')
    .controller('TargetDataCtrl', ['$scope', '$http', '$q', 'Util', 'Lo-Dash', 'schemaParser', 'PubSub', function ($scope, $http, $q, Util, loDash, schemaParser, PubSub) {
        $scope.internalName = 'Target Data Widget';

        var schemaPromise;

        PubSub.subscribe($scope, 'outputDataSelected', function() {

            var schema = $scope.project.$output_data_model_schema,
                deferred = $q.defer();

            schemaPromise = deferred.promise;
            deferred.resolve(schema);
        });

        function mapToSchema(result, schema) {
            return schemaParser.parseFromDomainSchema(result, schema, true);
        }

        PubSub.subscribe($scope, 'transformationFinished', function(data) {
            var deferred = $q.defer()
                , all = $q.all([schemaPromise, deferred.promise]);

            all.then(function(results) {
                var schema = results[0],
                    transformation = results[1];

                if (angular.isArray(transformation)) {
                    //TODO: All records, or some configurable amount
                    transformation = loDash.take(transformation, 3);

                    $scope.records = loDash.map(transformation, function(t) {
                        return {
                            id: t['record_id'],
                            data: mapToSchema(t['record_data'], schema)
                        };
                    });
                } else {
                    $scope.data = mapToSchema(transformation, schema);
                }
            });

            deferred.resolve(data);
        });

    }])
    .directive('targetData', [ function () {
        return {
            scope: true,
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/target-data.html',
            controller: 'TargetDataCtrl'
        };
    }]);

