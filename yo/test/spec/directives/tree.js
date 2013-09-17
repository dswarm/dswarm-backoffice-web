'use strict';

describe('Directive: tree', function() {
    var $rootScope, element, scope;

    beforeEach(module('dmpApp', 'mockedSchemaParsed', 'views/directives/tree.html'));

    beforeEach(inject(function($injector) {
        element = angular.element('<tree data="data"></tree>');

        $rootScope = $injector.get('$rootScope');
        scope = $rootScope.$new();

        scope.data = $injector.get('mockSchemaParsedJSON');
    }));

    it("should have the correct amount of tree nodes", inject(function($injector) {
        $injector.get('$compile')(element)(scope);
        $rootScope.$digest();

        var list = element.find('div');
        expect(list.length).toBe(33);
    }));
});
