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
    .controller('MappingComponentController', function($scope, PubSub) {

        var incomingPool = {},
            outgoingPool = {};

        $scope.onEditClicked = function() {

            PubSub.broadcast('handleOpenMappingComponentConfig', [incomingPool, outgoingPool]);

        };

        PubSub.subscribe($scope, 'connectionSelected', function(data) {

            if ($(data.targetData).attr('id') === $scope.id) {
                incomingPool[data.id] = data;
            }

            if ($(data.sourceData).attr('id') === $scope.id) {
                outgoingPool[data.id] = data;
            }

        });

    })
    .directive('mappingComponent', function() {

        return {
            restrict: 'E',
            scope: {
                options: '='
            },
            controller: 'MappingComponentController',
            templateUrl: 'views/directives/mapping-component.html',
            link: function(scope) {
                angular.extend(scope, scope.options);
                scope.name = scope.name || '(Unknown)';

                scope.jspSourceOptions = {
                    scope: 'schema',
                    container: 'schema',
                    anchor: 'Continuous',
                    endpoint: ['Dot', {
                        radius: 5,
                        cssClass: 'source-endpoint'
                    }],
                    connectorOverlays: [
                        ['Arrow', {
                            location: 1,
                            width: 10,
                            length: 12,
                            foldback: 0.75
                        }]
                    ],
                    connector: 'StateMachine',
                    connectorStyle: {
                        strokeStyle: 'black',
                        lineWidth: 3
                    },
                    paintStyle: {
                        fillStyle: 'black',
                        lineWidth: 3
                    }
                };

                scope.jspTargetOptions = {
                    scope: 'schema',
                    container: 'schema',
                    anchor: 'Continuous',
                    endpoint: ['Dot', {
                        radius: 5,
                        cssClass: 'transparent'
                    }],
                    connector: 'StateMachine',
                    connectorStyle: {
                        strokeStyle: 'black',
                        lineWidth: 3
                    },
                    paintStyle: {
                        fillStyle: 'transparent',
                        lineWidth: 3
                    },
                    dropOptions: {
                        hoverClass: 'mapping-droppable'
                    }
                };
            }

        };

    });
