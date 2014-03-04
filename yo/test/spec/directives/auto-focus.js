'use strict';

describe('Directive: autoFocus', function () {
    var $rootScope, $compile;
    var scope, element;
    var elementHtml = '<div auto-focus></div>';

    // load the directive's module
    beforeEach(module('dmpApp'));

    beforeEach(inject(function ($injector) {
        $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();
    }));

    it('should set the focus on the provided element after 13 milliseconds', inject(function ($compile, $timeout) {
        var _element = angular.element(elementHtml);
        element = $compile(_element)(scope)[0];

        spyOn(element, 'focus');

        scope.$digest();

        expect(element.focus).not.toHaveBeenCalled();

        $timeout.flush(12);

        expect(element.focus).not.toHaveBeenCalled();

        $timeout.flush(1);

        expect(element.focus).toHaveBeenCalled();

        $timeout.verifyNoPendingTasks();
    }));
});
