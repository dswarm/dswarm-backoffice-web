'use strict';

angular.module('dmpApp')
    .controller('TargetDataCtrl', function ($scope, $http, $q, Util, loDash,  schemaParser, PubSub) {
        $scope.internalName = 'Target Data Widget';

        function mapToSchema(result, schema) {
            return schemaParser.parseFromDomainSchema(result, schema, true);
        }

        PubSub.subscribe($scope, 'transformationFinished', function(transformation) {

            var schema = $scope.project._$output_data_model_schema;

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

    })
    .directive('targetData', function () {
        return {
            scope: true,
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/target-data.html',
            controller: 'TargetDataCtrl'
        };
    });

