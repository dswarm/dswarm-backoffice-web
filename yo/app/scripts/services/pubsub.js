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

        function ask(scope, send, args, reply, onReceive) {
            subscribe(scope, reply, function() {
                var a = [].slice.call(arguments);
                onReceive.apply(null, a);

                unsubscribe(scope, reply);
            });
            broadcast(send, args);
        }

        return {
            broadcast: broadcast,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            ask: ask
        };
    });
