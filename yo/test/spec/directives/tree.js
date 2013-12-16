'use strict';

describe('Directive: tree', function() {
    var $rootScope, element, scope;

    beforeEach(module('dmpApp', 'mockedSchemaParsed', 'views/directives/tree.html'));

    beforeEach(inject(function($injector) {
        element = angular.element('<tree data="data.schema" name="data.name" as-source layer="0"></tree>');

        $rootScope = $injector.get('$rootScope');
        scope = $rootScope.$new();

        scope.data = $injector.get('mockSchemaPostParsedJson');
    }));

    it("should have the correct amount of tree nodes", inject(function($injector) {
        $injector.get('$compile')(element)(scope);
        $rootScope.$digest();

        var list = element.find('div');
        expect(list.length).toBe(143);
    }));
});
