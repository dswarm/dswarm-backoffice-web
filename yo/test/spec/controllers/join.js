'use strict';

describe('Controller: JoinCtrl', function () {
    var $rootScope, scope, joinCtrl;

    beforeEach(module('dmpApp'));

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');
        scope = $rootScope.$new();

        joinCtrl = function () {
            return $controller('JoinCtrl', {
                '$scope': scope
            });
        };
    }));

    it('should have some join items available', function() {
        joinCtrl();

        expect(scope.joinItems.length).toBe(1);
        expect(scope.joinItems[0].name).toBe('Insert Mapper');
        expect(scope.joinItems[0].action).toBe('mapper');

    });

    it('should start with no mappings configured', function() {
        joinCtrl();

        expect(scope.hasMappingComponents).toBeUndefined();
        expect(scope.mappingComponents.length).toBe(0);
    });

    it('should create a new join item', function() {
        joinCtrl();

        scope.joinItem('mapper');

        expect(scope.hasMappingComponents).toBe(true);
        expect(scope.mappingComponents.length).toBe(1);
        expect(scope.mappingComponents[0].description).toBe('a fine Join Mapper');
        expect(scope.mappingComponents[0].name).toBe('Join Mapper 1');
        expect(scope.mappingComponents[0].id).toBe('mapper-0');
    });

    it('should create a new join item with auto inc. ID', function() {
        joinCtrl();

        scope.joinItem('mapper');
        scope.joinItem('mapper');

        expect(scope.hasMappingComponents).toBe(true);
        expect(scope.mappingComponents.length).toBe(2);
        expect(scope.mappingComponents[0].id).toBe('mapper-0');
        expect(scope.mappingComponents[1].id).toBe('mapper-1');
    });

    it('should do nothing when used with an unknown mapper type', function() {
        joinCtrl();

        scope.joinItem('foo');

        expect(scope.hasMappingComponents).toBe(undefined);
        expect(scope.mappingComponents.length).toBe(0);
    });
});
