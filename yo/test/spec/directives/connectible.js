'use strict';

describe('Directive: Connectibles', function () {
    var jsp;

    beforeEach(module('dmpApp'));

    beforeEach(module(function($provide) {

        jsp = jasmine.createSpyObj('jsp', ['connect', 'detach', 'detachAll']);

        $provide.value('jsP', jsp);
    }));

    describe('Directive: functionSource', function() {

        var element, scope, $rootScope, $compile, $timeout;

        var sourceElementHtml = '<div class="function-source" connect-with="{\'.target\': foo}" connect-when="bar"></div>';
        var targetElementHtml = '<div class="target"></div>';

        beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {

            $rootScope = _$rootScope_;
            $compile = _$compile_;
            $timeout = _$timeout_;

            scope = $rootScope.$new();

            var _element = angular.element(sourceElementHtml + targetElementHtml);
            element = $compile(_element)(scope);
        }));

        it('should not connect two elements if the conditions are not met', function() {
            scope.bar = false;
            scope.foo = false;

            scope.$digest();
            expect(jsp.connect).not.toHaveBeenCalled();

            scope.bar = true;
            scope.foo = false;

            scope.$digest();
            expect(jsp.connect).not.toHaveBeenCalled();

            scope.bar = false;
            scope.foo = true;

            scope.$digest();
            expect(jsp.connect).not.toHaveBeenCalled();

            scope.bar = true;
            scope.foo = true;   // requires some array or object

            scope.$digest();
            expect(jsp.connect).not.toHaveBeenCalled();
        });

        it('should not connect when no target element is available', function() {
            var newScope = $rootScope.$new();
            $compile(angular.element(sourceElementHtml))(newScope);

            newScope.bar = true;
            newScope.foo = {};

            newScope.$digest();

            $timeout.verifyNoPendingTasks();
            expect(jsp.connect).not.toHaveBeenCalled();
        });

        it('should only connect after the current cycle (timeout)', function() {
            scope.bar = true;
            scope.foo = {};

            scope.$digest();
            expect(jsp.connect).not.toHaveBeenCalled();

            $timeout.flush();
            expect(jsp.connect.calls.count()).toBe(2);
        });

        it('should connect two elements if the conditions are met', function() {
            scope.bar = true;
            scope.foo = {};

            scope.$digest();
            $timeout.flush();

            expect(jsp.connect.calls.count()).toBe(2);

            expect(jsp.connect.calls.argsFor(0)[0][0]).toBe(element[0]);
            expect(jsp.connect.calls.argsFor(0)[1][0]).toBe(element[1]);
            expect(jsp.connect.calls.argsFor(0)[2].anchors[0].slice(0, 4)).toEqual([0, 1, 0, 1]);
            expect(jsp.connect.calls.argsFor(0)[2].anchors[1].slice(0, 4)).toEqual([0, 0, 0, -1]);
            expect(jsp.connect.calls.argsFor(1)[0][0]).toBe(element[0]);
            expect(jsp.connect.calls.argsFor(1)[1][0]).toBe(element[1]);
            expect(jsp.connect.calls.argsFor(1)[2].anchors[0].slice(0, 4)).toEqual([1, 1, 0, 1]);
            expect(jsp.connect.calls.argsFor(1)[2].anchors[1].slice(0, 4)).toEqual([1, 0, 0, -1]);
        });

        it('should detach all connection when the project is discarded', function() {
            scope.bar = true;
            scope.foo = {};

            scope.$digest();

            $rootScope.$broadcast('projectDraftDiscarded');

            expect(jsp.detachAll.calls.count()).toBe(1);
            expect(jsp.detachAll.calls.argsFor(0)[0][0]).toBe(element[0]);
        });

    });


    describe('Directive: dmpConnectible', function() {

        var $rootScope, $compile;
        var scope, elements;
        var left, middle, right;

        var elementHtml = function(inner) {
            return '<div class="function" dmp-connectible>' + inner + '</div>';
        };

        beforeEach(inject(function(_$compile_, _$rootScope_) {

            $rootScope = _$rootScope_;
            $compile = _$compile_;

            scope = $rootScope.$new();
            scope.xs = [1, 2, 3];

            elements = $compile(angular.element(elementHtml('left') + elementHtml('middle') + elementHtml('right')))(scope);

            left = elements[0];
            middle = elements[1];
            right = elements[2];
        }));

        it('should not do anything upon creation', function() {

            scope.$digest();

            expect(jsp.detach).not.toHaveBeenCalled();
            expect(jsp.connect).not.toHaveBeenCalled();
        });

        it('should connect two consecutive elements together', inject(function($timeout) {

            scope.$digest();
            $timeout.flush();

            // detach all from first node till the end
            expect(jsp.detach.calls.argsFor(0)[0]).toBeUndefined();
            expect(jsp.detach.calls.argsFor(0)[1].length).toBe(0);
            expect(jsp.detach.calls.argsFor(0)[2].length).toBe(2);
            expect(jsp.detach.calls.argsFor(0)[2][0]).toBe(middle);
            expect(jsp.detach.calls.argsFor(0)[2][1]).toBe(right);

            expect(jsp.detach.calls.argsFor(1)[0]).toBeUndefined();
            expect(jsp.detach.calls.argsFor(1)[1].length).toBe(1);
            expect(jsp.detach.calls.argsFor(1)[1][0]).toBe(left);
            expect(jsp.detach.calls.argsFor(1)[2].length).toBe(1);
            expect(jsp.detach.calls.argsFor(1)[2][0]).toBe(middle);

            expect(jsp.detach.calls.argsFor(2)[0]).toBeUndefined();
            expect(jsp.detach.calls.argsFor(2)[1].length).toBe(1);
            expect(jsp.detach.calls.argsFor(2)[1][0]).toBe(middle);
            expect(jsp.detach.calls.argsFor(2)[2].length).toBe(1);
            expect(jsp.detach.calls.argsFor(2)[2][0]).toBe(right);

            // detach all from second node till the end
            expect(jsp.detach.calls.argsFor(3)[0]).toBeUndefined();
            expect(jsp.detach.calls.argsFor(3)[1].length).toBe(1);
            expect(jsp.detach.calls.argsFor(3)[1][0]).toBe(left);
            expect(jsp.detach.calls.argsFor(3)[2].length).toBe(1);
            expect(jsp.detach.calls.argsFor(3)[2][0]).toBe(right);

            expect(jsp.detach.calls.argsFor(4)[0]).toBeUndefined();
            expect(jsp.detach.calls.argsFor(4)[1].length).toBe(1);
            expect(jsp.detach.calls.argsFor(4)[1][0]).toBe(middle);
            expect(jsp.detach.calls.argsFor(4)[2].length).toBe(1);
            expect(jsp.detach.calls.argsFor(4)[2][0]).toBe(right);

            // detach all from the third node till the end
            expect(jsp.detach.calls.argsFor(5)[0]).toBeUndefined();
            expect(jsp.detach.calls.argsFor(5)[1].length).toBe(1);
            expect(jsp.detach.calls.argsFor(5)[1][0]).toBe(middle);
            expect(jsp.detach.calls.argsFor(5)[2].length).toBe(0);

            // connect all from the first till the end, and previous to current
            expect(jsp.connect.calls.argsFor(0)[0][0]).toBe(left);
            expect(jsp.connect.calls.argsFor(0)[1][0]).toBe(middle);

            expect(jsp.connect.calls.argsFor(1)[0][0]).toBe(middle);
            expect(jsp.connect.calls.argsFor(1)[1][0]).toBe(right);


            // connect all from the second till the end, and previous to current
            expect(jsp.connect.calls.argsFor(2)[0][0]).toBe(middle);
            expect(jsp.connect.calls.argsFor(2)[1][0]).toBe(right);

            expect(jsp.connect.calls.argsFor(3)[0][0]).toBe(left);
            expect(jsp.connect.calls.argsFor(3)[1][0]).toBe(middle);

            // connect all from the third till the end, and previous to current
            expect(jsp.connect.calls.argsFor(4)[0][0]).toBe(middle);
            expect(jsp.connect.calls.argsFor(4)[1][0]).toBe(right);

            expect(jsp.detach.calls.count()).toBe(6);
            expect(jsp.connect.calls.count()).toBe(5);
        }));

        it('should detach all connections on a tab switch', inject(function($timeout) {

            scope.$digest();
            $timeout.flush();

            expect(jsp.detach.calls.count()).toBe(6);
            expect(jsp.connect.calls.count()).toBe(5);

            $rootScope.$broadcast('tabSwitch');

            expect(jsp.detachAll.calls.count()).toBe(3);

            expect(jsp.detachAll.calls.argsFor(0)[0][0]).toBe(left);
            expect(jsp.detachAll.calls.argsFor(1)[0][0]).toBe(middle);
            expect(jsp.detachAll.calls.argsFor(2)[0][0]).toBe(right);

        }));
    });

});
