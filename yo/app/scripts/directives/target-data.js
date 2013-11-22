'use strict';

angular.module('dmpApp')
    .controller('TargetDataCtrl', ['$scope', '$http', '$q', 'Util', 'Lo-Dash', 'schemaParser', 'PubSub', 'SchemaDataResource', function ($scope, $http, $q, Util, loDash, schemaParser, PubSub, SchemaDataResource) {
        $scope.internalName = 'Target Data Widget';

        var schemaPromise;

        PubSub.subscribe($scope, 'handleTargetSchemaSelected', function(args) {

            var latestConfig = Util.latestBy(args.configurations, 'id').id;

            schemaPromise = SchemaDataResource.schema({
                id: args.id,
                cid: latestConfig
            }).$promise;
        });

        function mapToSchema(result, schema) {
            var returnValue = {};
            if (result && result[schema['title']]) {
                returnValue = schemaParser.parseAny(result[schema['title']], schema['title'], schema);
            }

            return returnValue;
        }

        PubSub.subscribe($scope, 'transformationFinished', function(data) {
            var deferred = $q.defer()
                , all = $q.all([schemaPromise, deferred.promise]);

            all.then(function(results) {
                var schema = results[0].data
                    , transformation = results[1];

                if (angular.isArray(transformation)) {
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

