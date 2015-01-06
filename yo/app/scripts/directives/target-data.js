/**
 * Copyright (C) 2013 – 2015  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 * http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

angular.module('dmpApp')
    .controller('TargetDataCtrl', function($scope, $http, $q, Util, loDash, gdmParser, PubSub) {
        $scope.internalName = 'Target Data Widget';

        $scope.selectedTab = 0;

        $scope.selectTab = function(tab) {
            $scope.selectedTab = tab;
        };

        function mapToSchema(result, schema) {
            return gdmParser.parse(result, schema, true);
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
    .directive('targetData', function() {
        return {
            scope: true,
            restrict: 'E',
            templateUrl: 'views/directives/target-data.html',
            controller: 'TargetDataCtrl'
        };
    });

