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

(function() {

    function sortableFactory(options, $timeout) {
        var functionName = options.fnName;

        return {
            restrict: 'C',
            scope: true,
            compile: function(tElement) {
                if (!angular.isFunction(tElement[functionName])) {
                    throw new Error('The "' + functionName + '" function does not exist, you need to load jQuery-UI');
                }

                return function(scope, iElement) {
                    var opts = angular.extend({},
                        options.options,
                            scope.sortableCallbacks || {});

                    $timeout(function() {
                        iElement[functionName].call(iElement, opts);
                        iElement['disableSelection']();

                        iElement.bind('$destroy', function() {
                            iElement[functionName].call(iElement, 'destroy');
                        });
                    }, 0, false);
                };
            }
        };
    }

    angular.module('dmpApp')
        .value('functionSortableOptions', {
            fnName: 'sortable',
            options: {
                tolerance: 'pointer',
                items: '.function',
                cancel: '.component',
                revert: 350,
                snap: true,
                forcePlaceholderSize: true,
                containment: '#transformation',
                //    cursor: 'move',
                cursorAt: {top: -5, left: -5},
                opacity: 0.7
            }
        })
        .value('componentDraggableOptions', {
            fnName: 'draggable',
            options: {
                appendTo: 'body',
                connectToSortable: '.function-sortable',
                containment: '#transformation',
                cursor: 'move',
                cursorAt: {top: -5, left: -5},
                helper: 'clone',
                opacity: 0.7,
                revert: 'invalid',
                revertDuration: 400
            }
        })
        .directive('functionSortable', function(functionSortableOptions, $timeout) {
            return sortableFactory(functionSortableOptions, $timeout);
        })
        .directive('componentMember', function(componentDraggableOptions, $timeout) {
            return sortableFactory(componentDraggableOptions, $timeout);
        });
}());
