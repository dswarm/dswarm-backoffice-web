'use strict';

/**
 * @ngdoc directive
 * @name dmpApp.directive:flashMessages
 * @description
 * # flashMessages
 */
angular.module('dmpApp')
    .controller('FlashMessagesCtrl', function($scope, flashMessage) {
        $scope.messages = flashMessage.messages();
    })
    .directive('flashMessages', function () {
        return {
            templateUrl: 'views/directives/flash-messages.html',
            restrict: 'EA',
            scope: {},
            controller: 'FlashMessagesCtrl',
            link: function postLink(scope, element, attrs) {
                scope.animation = attrs.animation || 'fade in';
            }
        };
    });
