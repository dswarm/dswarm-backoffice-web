/**
 * Copyright (C) 2013, 2014  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
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
    .controller('DataConfigSchemaCtrl', function($scope, $location, $routeParams, DataConfigResource) {

        $scope.config = {
            name: 'schema',
            description: 'schema with id ' + $routeParams.resourceId,
            parameters: {
                'storage_type': 'schema'
            }
        };

        $scope.onFlagClick = function() {

            DataConfigResource.save({ id: $routeParams.resourceId }, $scope.config, function() {
                $location.path('/data/');
            });

        };

        $scope.onCancelClick = function() {
            $location.path('/data/');
        };

    })
    .directive('dataconfigschema', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/data-config-schema.html',
            controller: 'DataConfigSchemaCtrl'
        };
    });
