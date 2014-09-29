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
