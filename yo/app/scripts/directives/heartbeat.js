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
    .directive('heartbeat', function($timeout, $http, ApiEndpoint) {
        return function heartbeatLinkFn(scope, elem, attrs) {
            var intervalTime = +scope.$eval(attrs.interval) || 1000,
                endpoint = scope.$eval(attrs.endpoint),
                expected = scope.$eval(attrs.expected),
                config = {
                    method: 'GET',
                    url: ApiEndpoint + endpoint,
                    timeout: 1000
                },

                alive = true,
                cancelHeartbeat,

                interval = function intervalFn() {
                    cancelHeartbeat = $timeout(function checkHeartbeat() {
                        $http(config)
                            .success(function heartbeatSuccess(data) {
                                elem.removeClass('yellow red green');
                                elem.addClass((data === expected) ? 'green' : 'yellow');
                            })
                            .error(function heartbeatError() {
                                elem.removeClass('yellow green');
                                elem.addClass('red');
                            })
                            .finally(function() {
                                cancelHeartbeat = $timeout(intervalFn, intervalTime);
                            });
                    }, intervalTime);
                },

                toggleAlive = function toggleAliveFn(value) {
                    if (!value && cancelHeartbeat) {
                        $timeout.cancel(cancelHeartbeat);
                        cancelHeartbeat = null;
                        elem.removeClass('yellow red green');
                        elem.addClass('disabled');
                    } else {
                        elem.removeClass('disabled red green');
                        elem.addClass('yellow');
                        interval();
                    }
                };

            elem.bind('click', function() {
                alive = !alive;
                toggleAlive(alive);
            });

            toggleAlive(alive);
        };
    });
