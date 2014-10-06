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
    .controller('MappingComponentConfigCtrl', function($scope, PubSub) {

        $scope.internalName = 'Mapping Component Config Widget';

        $scope.mappingComponentConfigShouldBeOpen = false;

        $scope.incomingPool = {};
        $scope.outgoingPool = {};

        $scope.selectedSet = [];

        $scope.opts = {
            backdropFade: true,
            dialogFade: true,
            triggerClass: 'really in'
        };

        $scope.onSelectClick = function() {
            $scope.targetSchemaSelectorShouldBeOpen = false;
        };

        $scope.close = function() {
            $scope.mappingComponentConfigShouldBeOpen = false;
        };

        function addIncoming(data) {

            if (!$scope.incomingPool[data.$$hashKey]) {
                $scope.incomingPool[data.$$hashKey] = [];
            }

            $scope.incomingPool[data.$$hashKey].push(data);
        }

        PubSub.subscribe($scope, 'handleOpenMappingComponentConfig', function(mappings) {

            $scope.incomingPool = {};
            $scope.outgoingPool = {};

            $scope.mappingComponentConfigShouldBeOpen = true;

            angular.forEach(mappings[0], function(value) {
                addIncoming(value.sourceData);
            });

            $scope.outgoingPool = mappings[1];


        });


    })
    .directive('mappingComponentConfig', function() {
        return {
            restrict: 'E',
            replace: false,
            scope: true,
            templateUrl: 'views/directives/mapping-component-config.html',
            controller: 'MappingComponentConfigCtrl'
        };
    });
