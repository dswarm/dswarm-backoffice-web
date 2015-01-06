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
    .controller('ComponentsCtrl', function($scope, FunctionResource, loDash) {
        $scope.internalName = 'Function List Widget';

        /**
         * Model for a list of functions, that are available.
         *
         * @type {Object}
         */
        $scope.functions = {
            'name': 'Functions',
            'show': true,
            'children': []
        };

        FunctionResource.query(function(funs) {
            // DD-435
            var funBlacklist = [
                'blacklist',
                'lookup',
                'setreplace',
                'whitelist'
            ];
            angular.forEach(funs, function(fun) {
                if (funBlacklist.indexOf(fun.name) > -1) {
                    fun.type = 'Disabled';
                }
            });
            // End DD-435

            funs =  loDash.sortBy(funs, 'name');

            $scope.functions.children = funs;
        });
    })
    .directive('components', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/components.html',
            controller: 'ComponentsCtrl'
        };
    });
