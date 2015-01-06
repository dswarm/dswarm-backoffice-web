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
    .directive('healthCheck', function($timeout, $http, ApiEndpoint) {
        return function heartbeatLinkFn(scope, elem, attrs) {
            var intervalTime = +scope.$eval(attrs.interval) || 1000,
                endpoint = scope.$eval(attrs.endpoint),
                healthy = scope.$eval(attrs.healthy),
                config = {
                    method: 'GET',
                    url: ApiEndpoint + endpoint,
                    timeout: 10000
                },

                alive = true,
                cancelHealthCheck,

                interval = function intervalFn() {
                    cancelHealthCheck = $timeout(function checkHealthCheck() {
                        $http(config)
                            .success(function healthcheckSuccess(data) {
                                elem.removeClass('yellow red green blue');
                                if (data[healthy]) {
                                    if (data[healthy].healthy) {
                                        elem.addClass('green');
                                        elem.attr('title', null);
                                    } else {
                                        elem.addClass('yellow');
                                        elem.attr('title', data[healthy].reason);
                                    }
                                } else {
                                    elem.addClass('red');
                                    elem.attr('title', 'no check for ' + healthy);
                                }

                            })
                            .error(function healthcheckError(e) {
                                elem.removeClass('yellow green blue');
                                elem.addClass('red');
                                elem.attr('title', 'health check failed ' + e);
                            })
                            .finally(function() {
                                cancelHealthCheck = $timeout(intervalFn, intervalTime);
                            });
                    }, intervalTime);
                },

                toggleAlive = function toggleAliveFn(value) {
                    if (!value && cancelHealthCheck) {
                        $timeout.cancel(cancelHealthCheck);
                        cancelHealthCheck = null;
                        elem.removeClass('yellow red green blue');
                        elem.addClass('disabled');
                        elem.attr('title', 'health check disabled, click to enable');
                    } else {
                        elem.removeClass('disabled red green yellow');
                        elem.addClass('blue');
                        elem.attr('title', 'health check in progress');
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
