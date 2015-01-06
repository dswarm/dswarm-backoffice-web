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
    .controller('DataSelectorCtrl', function($scope, PubSub) {

        $scope.internalName = 'Data Selector Widget';

        $scope.dataSelectorShouldBeOpen = false;
        $scope.result = {};

        $scope.selectedSet = [];

        $scope.opts = {
            backdropFade: true,
            dialogFade: true,
            triggerClass: 'really in'
        };

        $scope.onSelectClick = function() {
            PubSub.broadcast('handleDataSelected', $scope.selectedSet[0]);
            $scope.dataSelectorShouldBeOpen = false;
        };

        $scope.close = function() {
            $scope.dataSelectorShouldBeOpen = false;
        };

        PubSub.subscribe($scope, 'handleOpenDataSelector', function() {
            $scope.dataSelectorShouldBeOpen = true;
        });

    })
    .directive('dataselector', function() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'views/directives/data-selector.html',
            controller: 'DataSelectorCtrl'
        };
    });
