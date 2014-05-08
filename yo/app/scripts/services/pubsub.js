'use strict';

angular.module('dmpApp').
/**
 * A factory that allows for inter-controller communication, a light wrapper
 * around $rootScope.$broadcast and $scope.$on
 * To listen to events, call
 *   `PubSub.subscribe($scope, channel, my_callback);`.
 *   Alternatively, you can just call `$scope.$on(channel, my_callback);`
 *   which is what PubSub.subscribe does, effectively.
 *
 *   my_callback is a Function(data, event), unless you use $scope.$on,
 *   then it is a Function(event, data). Thus, using PubSub allows for
 *   discarding the event parameter.
 *
 * To broadcast events, call `PubSub.broadcast(channel, message)`.
 *  message can be any object or primitive.
 *
 *  At the moment, there is no notion of un-subscribing.
 *
 */
    factory('PubSub', function($rootScope) {
        /**
         * broadcasts a message to a specific channel
         * @param channel {String}
         * @param message {*}
         */
        function broadcast(channel, message) {
            $rootScope.$broadcast(channel, message);
        }

        /**
         * subscribe to a channel
         * @param scp {$scope}
         * @param channel {String|Array} one channel or a list of channels
         * @param callback {Function(*, event)}
         */
        function subscribe(scp, channel, callback) {

            if(!scp._off) {
                scp._off = {};
            }

            if (angular.isArray(channel)) {
                angular.forEach(channel, function(chan) {
                    scp._off[chan] = scp.$on(chan, function(event, data) {
                        callback(data, event);
                    });
                });
            } else {
                scp._off[channel] = scp.$on(channel, function(event, data) {
                    callback(data, event);
                });
            }
        }

        /**
         * unsubscribes a channel or array of channels
         * @param scp
         * @param channel
         * @returns {*}
         */
        function unsubscribe(scp, channel) {

            if(scp._off) {

                if (angular.isArray(channel)) {
                    angular.forEach(channel, function(chan) {
                        scp._off[chan]();
                    });
                } else {
                    scp._off[channel]();
                }

            }
        }

        return {
            broadcast: broadcast,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };
    });
