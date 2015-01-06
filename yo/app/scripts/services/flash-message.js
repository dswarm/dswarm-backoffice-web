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

/**
 * @ngdoc service
 * @name dmpApp.flashMessage
 * @description
 * # flashMessage
 * Factory in the dmpApp.
 */
angular.module('dmpApp')
    .factory('flashMessage', function ($timeout, loDash) {
        var messages = [];
        var availableTypes = ['info', 'warning', 'danger', 'success'];

        function removeMsg(msg) {
            var index = messages.indexOf(msg);
            if (index !== -1) {
                messages.splice(index, 1);
            }
        }

        function addMessage(type, message, options) {
            if (availableTypes.indexOf(type) === -1) {
                throw new Error('Invalid message type');
            }

            options = options || {};
            var msg = {
                type: type,
                msg: message,
                close: function() {
                    removeMsg(msg);
                }
            };

            if (angular.isDefined(options.timeout)) {
                var timeout = $timeout(function () {
                    msg.close();
                }, options.timeout);
                msg.cancelTimeout = function() {
                    $timeout.cancel(timeout);
                };
            }

            messages.push(msg);
        }

        return {
            add: addMessage,
            info: loDash.partial(addMessage, 'info'),
            success: loDash.partial(addMessage, 'success'),
            failure: loDash.partial(addMessage, 'danger'),
            messages: function() {
                return messages;
            }
        };
    });
