/**
 * Copyright (C) 2013 – 2016  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
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
