'use strict';

angular.module('dmpApp')
    .directive('heartbeat', ['$timeout', '$http', 'Util', function($timeout, $http, Util) {
        return function heartbeatLinkFn(scope, elem, attrs) {
            var intervalTime = +scope.$eval(attrs.interval) || 1000,
                endpoint = scope.$eval(attrs.endpoint),
                expected = scope.$eval(attrs.expected),
                api = Util.apiEndpoint,
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
    }]);
