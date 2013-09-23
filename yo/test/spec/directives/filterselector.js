'use strict';

describe('Controller: FilterSelectorCtrl', function () {
    var $httpBackend, $rootScope, scope, component, filterSelectorCtrl;

    beforeEach(module('dmpApp'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();

        var $controller = $injector.get('$controller');
        filterSelectorCtrl = function () {
            return $controller('FilterSelectorCtrl', {
                $scope: scope
            });
        };

    }));


    it('should have a FilterSelectorCtrl controller', function() {
        var FilterSelectorCtrl = filterSelectorCtrl();
        expect(FilterSelectorCtrl).not.toBe(null);
    });
});