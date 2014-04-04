'use strict';

describe('Service: BuildInfo/Version', function () {

    beforeEach(module('dmpApp'));

    describe('Service: BuildInf', function() {
        var scope, element, html = '<div app-version></div>';

        beforeEach(inject(function (_$compile_, _$rootScope_) {

            scope = _$rootScope_.$new();

            element = _$compile_(angular.element(html))(scope);
        }));

        it('should render a version text', function() {

            scope.$digest();

            var expected = 'Web: HEAD -- API: HEAD at latest';

            expect(element.text()).toBe(expected);
            expect(element.attr('id')).toBe('footer-build-information');
        });
    });
});
