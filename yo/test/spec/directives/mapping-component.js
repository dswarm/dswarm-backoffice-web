'use strict';

describe('Directive: MappingComponent', function() {
    var elm, scope;

    beforeEach(module('dmpApp', 'views/directives/mapping-component.html'));

    beforeEach(module(function($provide) {
        // dont test any jsplumb stuff
        $provide.value('jsP', {
            makeTarget: angular.noop,
            makeSource: angular.noop,
            on: angular.noop
        });
    }));

    beforeEach(inject(function($injector) {
        var $rootScope = $injector.get('$rootScope');

        elm = angular.element('<mapping-component options="component"></mapping-component>');

        scope = $rootScope.$new();
    }));

    it('should create a mapping well', inject(function($compile) {
        scope.component = {
            description: 'Some Foobar',
            name: 'baz',
            id: 'qux-42'
        };
        $compile(elm)(scope);
        scope.$digest();

        expect(elm.length).toBe(1);
        expect(elm.find('small').text()).toBe('qux-42');
        expect(elm.find('h4').text()).toBe('bazqux-42');
        expect(elm.text().trim().replace(/\s+/g, ' ')).toBe('bazqux-42 Some Foobar');

        expect(elm.attr('dmp-endpoint')).toBe('');
        expect(elm.attr('js-plumb-target-options')).toBe('jspTargetOptions');
        expect(elm.attr('js-plumb-source-options')).toBe('jspSourceOptions');
        expect(elm.attr('source')).toBe('true');
        expect(elm.attr('target')).toBe('true');

        var classes = [].slice.call(elm[0].classList);
        expect(classes).toContain('well');
        expect(elm[0].tagName).toBe('DIV');
    }));

    it('should have at least (Unknown) as name', inject(function($compile) {
        scope.component = {};
        $compile(elm)(scope);
        scope.$digest();

        expect(elm.length).toBe(1);
        expect(elm.find('small').text()).toBe('');
        expect(elm.find('h4').text()).toBe('(Unknown)');
        expect(elm.text().trim().replace(/\s+/g, ' ')).toBe('(Unknown)');
    }));

});
