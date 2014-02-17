'use strict';

angular.module('dmpApp')
    .directive('healthCheck', ['$timeout', '$http', 'ApiEndpoint', function($timeout, $http, api) {
        return function heartbeatLinkFn(scope, elem, attrs) {
            var intervalTime = +scope.$eval(attrs.interval) || 1000,
                endpoint = scope.$eval(attrs.endpoint),
                healthy = scope.$eval(attrs.healthy),
                config = {
                    method: 'GET',
                    url: api + endpoint,
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
    }]);
