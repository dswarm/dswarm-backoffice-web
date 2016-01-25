/**
 * Copyright (C) 2013 – 2016  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
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
    .controller('JoinCtrl', function($scope) {

        $scope.joinItems = [
            {name: 'Insert Mapper', action: 'mapper'}
        ];

        $scope.mappingComponents = [];


        var mappingComponentFactory = (function() {
            var globalCounter = {};

            function getId(name) {
                return globalCounter.hasOwnProperty(name) ? ++globalCounter[name] : (globalCounter[name] = 0);
            }

            /**
             * @return {{description: String, name: String}}
             */
            function MappingComponentFactory(name) {
                switch (name) {
                    case 'mapper':
                        var nextId = getId(name)
                            , componentId = name + '-' + nextId;
                        return {
                            description: 'a fine Join Mapper',
                            name: 'Join Mapper ' + (nextId + 1),
                            id: componentId,
                            data: {
                                name: 'mapper.' + componentId
                            }
                        };
                    default:
                        return null;
                }
            }

            return MappingComponentFactory;
        })();


        $scope.joinItem = function(action) {
            var component = mappingComponentFactory(action);
            if (component) {
                $scope.mappingComponents.push(component);
                $scope.hasMappingComponents = true;
            }
        };

    });
