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

                return function (scope, iElement) {
                    var opts = angular.extend({},
                        options.options,
                        scope.sortableCallbacks || {});

                    $timeout(function () {
                        iElement[functionName].call(iElement, opts);
                        iElement['disableSelection']();

                        iElement.bind('$destroy', function () {
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
        .directive('functionSortable', function (functionSortableOptions, $timeout) {
            return sortableFactory(functionSortableOptions, $timeout);
        })
        .directive('componentMember', function (componentDraggableOptions, $timeout) {
            return sortableFactory(componentDraggableOptions, $timeout);
        });
}());
