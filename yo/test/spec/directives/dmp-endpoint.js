'use strict';

describe('Directive: DmpEndpoint', function() {
    var $rootScope, $compile;
    var sourceScope, targetScope, elementSource, elementTarget;
    var elementHtmlSource = '<div dmp-endpoint jsp-source-options="opts"></div>';
    var elementHtmlTarget = '<div dmp-endpoint jsp-target-options="opts"></div>';

    beforeEach(module('dmpApp'));
//
//    beforeEach(module(function($provide) {
//        // dont test any jsplumb stuff
//        $provide.value('jsP', {
//            makeTarget: angular.noop,
//            makeSource: angular.noop,
//            on: angular.noop,
//            guid: angular.noop
//        });
//    }));

    beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache) {

        $templateCache.put('views/directives/data-selector.html', '<div></div>');

        $rootScope = _$rootScope_;
        $compile = _$compile_;

        var parentScope = $rootScope.$new();
        parentScope.data = {
            _$path_id: 20
        };

        sourceScope = parentScope.$new();
        sourceScope.opts = {
            'foo': 'bar'
        };
        sourceScope.projectIsMabXml = function() {
            return false;
        };
        targetScope = parentScope.$new();
        targetScope.opts = {
            'foo': 'bar'
        };
        targetScope.projectIsMabXml = function() {
            return false;
        };

        var _element;

        _element = angular.element(elementHtmlSource);
        elementSource = $compile(_element)(sourceScope);

        _element = angular.element(elementHtmlTarget);
        elementTarget = $compile(_element)(targetScope);
    }));

    it('should create the JsPlumb connections for the source', inject(function() {
        sourceScope.$digest();
        var elScope = elementSource.scope();

        elementSource.trigger('click');

        expect(elScope.isSelected).toBe(true);
    }));

    it('should de-select the source connector, if clicked twice', inject(function() {
        sourceScope.$digest();
        var elScope = elementSource.scope();

        elementSource.trigger('click');

        expect(elScope.isSelected).toBe(true);


        elementSource.trigger('click');

        expect(elScope.isSelected).toBe(false);
    }));

    it('should de-select the other source connectors, if clicked on another source', inject(function() {
        sourceScope.$digest();
        var elScope = elementSource.scope();

        elementSource.trigger('click');

        expect(elScope.isSelected).toBe(true);


        var anotherScope = $rootScope.$new();
        anotherScope.data = { _$path_id: 20 };
        anotherScope.opts = { foo: 'baz' };
        var anotherElement = $compile(angular.element(elementHtmlSource))(anotherScope);
        anotherScope.$digest();
        var anotherElScope = anotherElement.scope();

        anotherElement.trigger('click');

        expect(elScope.isSelected).toBe(false);
        expect(anotherElScope.isSelected).toBe(true);
    }));

    it('should do nothing on target click if there was no source selected', function() {

        targetScope.$digest();
        elementTarget.trigger('click');
    });

    it('should connect a source and a target together', inject(function($q, endpointSelector) {
        var fakePromise = {then: function() {
            return fakePromise;
        }};

        spyOn(endpointSelector, 'connectionParamPromise').andReturn(fakePromise);

        sourceScope.$digest();
        targetScope.$digest();

        elementSource.trigger('click');
        elementTarget.trigger('click');

        expect(endpointSelector.connectionParamPromise).toHaveBeenCalled();
    }));
});
