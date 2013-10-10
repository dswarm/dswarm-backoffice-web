'use strict';

angular.module('dmpApp')
    .directive('heartbeat', ['$timeout', '$http', '$window', function($timeout, $http, $window) {
        return function heartbeatLinkFn(scope, elem, attrs) {
            var intervalTime = +scope.$eval(attrs.interval) || 1000,
                endpoint = scope.$eval(attrs.endpoint),
                expected = scope.$eval(attrs.expected),
                api = $window['dmp']['jsRoutes']['api'],
                config = {
                    method: 'GET',
                    url: api + endpoint,
                    timeout: 1000
                },

                alive = true,
                cancelHeartbeat,

                interval = function intervalFn() {
                    cancelHeartbeat = $timeout(function checkHeartbeat() {
                        $http(config)
                            .success(function heartbeatSuccess(data) {
                                elem.removeClass('yellow red green');
                                elem.addClass((data === expected)? 'green' : 'yellow');
                            })
                            .error(function heartbeatSuccess() {
                                elem.removeClass('yellow green');
                                elem.addClass('red');
                            })
                            .finally(function() {
                                cancelHeartbeat = $timeout(intervalFn, intervalTime, false);
                            });
                    }, intervalTime, false);
                },

                toggleAlive = function toggleAliveFn(value) {
                    if (!value && cancelHeartbeat) {
                        $timeout.cancel(cancelHeartbeat);
                        cancelHeartbeat = null;
                        elem.removeClass('yellow red green');
                        elem.addClass('disabled');
                    } else if(!cancelHeartbeat) {
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
    }]);
