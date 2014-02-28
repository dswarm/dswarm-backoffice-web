'use strict';

xdescribe('Directive: DmpEndpoint', function () {
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

        sourceScope = $rootScope.$new();
        sourceScope.opts = {
            'foo': 'bar'
        };
        targetScope = $rootScope.$new();
        sourceScope.opts = {
            'foo': 'bar'
        };

        var _element;

        _element = angular.element(elementHtmlSource);
        elementSource = $compile(_element)(sourceScope);

        _element = angular.element(elementHtmlTarget);
        elementTarget = $compile(_element)(targetScope);
    }));

    it('should create the JsPlumb connections for the source', inject(function(jsP) {
        spyOn(jsP, 'makeSource');
        spyOn(jsP, 'unmakeSource');
        spyOn(jsP, 'makeTarget');
        spyOn(jsP, 'unmakeTarget');

        sourceScope.$digest();

        expect(jsP.makeSource).toHaveBeenCalled();
        expect(jsP.makeTarget).not.toHaveBeenCalled();
        expect(jsP.unmakeTarget).toHaveBeenCalled();
        expect(jsP.unmakeSource).not.toHaveBeenCalled();

    }));

    it('should create the JsPlumb connections for the target', inject(function(jsP) {
        spyOn(jsP, 'makeSource');
        spyOn(jsP, 'unmakeSource');
        spyOn(jsP, 'makeTarget');
        spyOn(jsP, 'unmakeTarget');

        targetScope.$digest();

        expect(jsP.makeSource).not.toHaveBeenCalled();
        expect(jsP.makeTarget).toHaveBeenCalled();
        expect(jsP.unmakeTarget).not.toHaveBeenCalled();
        expect(jsP.unmakeSource).toHaveBeenCalled();
    }));
});
