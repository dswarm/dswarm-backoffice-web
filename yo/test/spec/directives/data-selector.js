'use strict';

describe('Directive: DataSelector', function () {
    var $rootScope, $compile, element, scope;
    var elementHtml = '<dataselector></dataselector>';

    beforeEach(module('dmpApp'));

    beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache) {

        $templateCache.put('views/directives/data-selector.html', '<div></div>');

        $rootScope = _$rootScope_;
        $compile = _$compile_;

        scope = $rootScope.$new();

        var _element = angular.element(elementHtml);
        element = $compile(_element)(scope);
    }));

    it('should create the DataSelectorCtrl from resources', function() {
        scope.$digest();

        var elScope = element.scope();

        expect(elScope.internalName).toBe('Data Selector Widget');
        expect(elScope.dataSelectorShouldBeOpen).toBe(false);
        expect(elScope.result).toEqual({});
        expect(elScope.selectedSet).toEqual([]);
        expect(elScope.opts).toEqual({
            backdropFade: true,
            dialogFade: true,
            triggerClass: 'really in'
        });
    });

    it('should react to \'handleOpenDataSelector\' events', function() {
        scope.$digest();

        var elScope = element.scope();

        $rootScope.$broadcast('handleOpenDataSelector');

        expect(elScope.dataSelectorShouldBeOpen).toBe(true);
    });

    it('should close the dialog on close()', function() {
        scope.$digest();

        var elScope = element.scope();

        $rootScope.$broadcast('handleOpenDataSelector');
        elScope.close();

        expect(elScope.dataSelectorShouldBeOpen).toBe(false);
    });

    it('should broadcast the \'handleDataSelected\' event on data selection', function() {
        scope.$digest();

        var elScope = element.scope();

        spyOn($rootScope, '$broadcast');

        elScope.onSelectClick();

        expect($rootScope.$broadcast).toHaveBeenCalledWith('handleDataSelected', undefined);
    });
});
