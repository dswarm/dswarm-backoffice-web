'use strict';

describe('Directive: Sortables', function () {

    beforeEach(module('dmpApp'));

    describe('functionSortable', function() {
        var element, scope, $rootScope, $compile, $timeout;
        var functionSortableOptions;
        var elementHtml = '<div class="function-sortable">';

        beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _functionSortableOptions_) {

            $rootScope = _$rootScope_;
            $compile = _$compile_;

            $timeout = _$timeout_;
            functionSortableOptions = _functionSortableOptions_;

            scope = $rootScope.$new();

            var _element = angular.element(elementHtml);
            element = $compile(_element)(scope);
        }));

        it('should call $#sortable after the cycle', function() {
            spyOn($.fn, 'sortable');

            scope.$digest();

            expect($.fn.sortable).not.toHaveBeenCalled();

            $timeout.flush();

            expect($.fn.sortable).toHaveBeenCalledWith(functionSortableOptions.options);

            $timeout.verifyNoPendingTasks();
        });

        it('should call $#sortable(\'destroy\') after $destroy', function() {
            spyOn($.fn, 'sortable');

            scope.$digest();
            $timeout.flush();
            element.trigger('$destroy');

            expect($.fn.sortable).toHaveBeenCalledWith('destroy');
        });

        it('should thrown an compile-time error if there is no $#sortable', function() {
            delete $.fn['sortable'];

            try {
                $compile(angular.element(elementHtml))(scope);
                fail();

            } catch (e) {

                expect(e.name).toBe('Error');
                expect(e instanceof Error).toBe(true);
                expect(e.message).toBe('The "sortable" function does not exist, you need to load jQuery-UI');
            }
        });
    });


    describe('componentDraggable', function() {
        var element, scope, $rootScope, $compile, $timeout;
        var componentDraggableOptions;
        var elementHtml = '<div class="component-member">';

        beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _componentDraggableOptions_) {

            $rootScope = _$rootScope_;
            $compile = _$compile_;
            $timeout = _$timeout_;
            componentDraggableOptions = _componentDraggableOptions_;

            scope = $rootScope.$new();

            var _element = angular.element(elementHtml);
            element = $compile(_element)(scope);
        }));

        it('should call $.draggable after the cycle', function() {
            spyOn($.fn, 'draggable');

            scope.$digest();

            expect($.fn.draggable).not.toHaveBeenCalled();

            $timeout.flush();

            expect($.fn.draggable).toHaveBeenCalledWith(componentDraggableOptions.options);

            $timeout.verifyNoPendingTasks();
        });

        it('should call $#draggable(\'destroy\') after $destroy', function() {
            spyOn($.fn, 'draggable');

            scope.$digest();
            $timeout.flush();
            element.trigger('$destroy');

            expect($.fn.draggable).toHaveBeenCalledWith('destroy');
        });

        it('should thrown an compile-time error if there is no $#draggable', function() {
            delete $.fn['draggable'];

            try {
                $compile(angular.element(elementHtml))(scope);
                fail();

            } catch (e) {

                expect(e.name).toBe('Error');
                expect(e instanceof Error).toBe(true);
                expect(e.message).toBe('The "draggable" function does not exist, you need to load jQuery-UI');
            }
        });
    });
});
