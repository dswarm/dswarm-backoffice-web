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
    .directive('functionSource', function($timeout, $rootScope, jsP, PubSub) {

        var connectWithSources = [],
            scope, iElement, iAttrs;

        var doLink = function(scopeCurrent, iElementCurrent, iAttrsCurrent) {

            scope = scopeCurrent;
            iElement = iElementCurrent;
            iAttrs = iAttrsCurrent;

            var drawn = false;
            scope.$watch(iAttrs.connectWhen, function(source) {
                if (!drawn && source) {
                    var connectWith = scope.$eval(iAttrs.connectWith);
                    angular.forEach(connectWith, function(defined, selector) {
                        if (defined && (defined.length || angular.isObject(defined))) {
                            var target = iElement.siblings(selector);
                            connectWithSources.push(iElement);
                            if (target.length) {
                                $timeout(function() {
                                    var opts = {
                                        anchors: [
                                            [0, 1, 0, 1, -4, -9],
                                            [0, 0, 0, -1, -4, -9]
                                        ],
                                        connector: 'Straight',
                                        endpoint: 'Blank',
                                        overlays: [
                                            ['Arrow', {
                                                location: 1,
                                                width: 10,
                                                length: 12,
                                                foldback: 0.75
                                            }]
                                        ],
                                        paintStyle: {
                                            lineWidth: 3,
                                            strokeStyle: 'black'
                                        }
                                    };
                                    jsP.connect(iElement, target, opts);

                                    var secondOpts = angular.copy(opts);
                                    secondOpts.anchors[0][0] = 1;
                                    secondOpts.anchors[0][4] = -8;
                                    secondOpts.anchors[1][0] = 1;
                                    secondOpts.anchors[1][4] = -8;
                                    jsP.connect(iElement, target, secondOpts);

                                    drawn = true;
                                }, 0);
                            }
                        }
                    });
                }
            });
        };

        PubSub.subscribe($rootScope, ['projectDraftDiscarded', 'changeOutputModel', 'restoreCurrentProject'], function() {
            angular.forEach(connectWithSources, function(source) {
                jsP.detachAll(source);
            });
        });

        PubSub.subscribe($rootScope, 'paintPlumbs', function() {
            doLink(scope, iElement, iAttrs);
        });

        return {
            restrict: 'C',
            link: function(scope, iElement, iAttrs) {
                doLink(scope, iElement, iAttrs);
            }
        };
    })
    .directive('dmpConnectible', function($timeout, jsP) {
        return {
            restrict: 'A',
            scope: true,
            controller: ['$scope', '$element', function($scope, $element) {
                $scope.$element = $element;
            }],
            link: function(scope, iElement) {
                scope.$on('tabSwitch', function() {
                    jsP.detachAll(scope.$element);
                });

                $timeout(function() {
                    var src = scope.$element.prev('.function')
                        , next = scope.$element.nextAll('.function')
                        , outbound = src.data('_outbound');

                    jsP.detach(outbound, src, next);

                    if (next.length) {
                        var prev = iElement
                            , l = next.length;

                        for (var i = 0; i < l; i++) {
                            var current = next.slice(i, i + 1);

                            outbound = prev.data('_outbound');
                            jsP.detach(outbound, prev, current);
                            jsP.connect(prev, current);

                            prev = current;
                        }
                    }
                    if (src.length) {
                        jsP.connect(src, iElement);
                    }
                }, 0, false);
            }
        };
    });
