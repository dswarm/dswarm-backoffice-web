'use strict';

describe('Controller: DataConfigPreviewCtrl', function () {
    var $httpBackend, $rootScope, scope, dataConfigPreviewCtrl;

    beforeEach(module('dmpApp', 'mockedDataConfigPreview'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();

        $httpBackend.whenPOST('resources/configurationPreview').respond($injector.get('mockDataConfigPreviewJSON'));

        var $controller = $injector.get('$controller');
        dataConfigPreviewCtrl = function () {
            return $controller('DataConfigPreviewCtrl', {
                $scope: scope
            });
        };

    }));


    it('should have a DataConfigPreviewCtrl controller', function() {
        var DataConfigPreviewCtrl = dataConfigPreviewCtrl();
        expect(DataConfigPreviewCtrl).not.toBe(null);
    });

    xit('should push preview response to scope', function() {

        dataConfigPreviewCtrl();

        scope.dataConfigUpdated({});

        $rootScope.$digest();
        $httpBackend.flush();

        expect(scope.previewResult.length).toBe(5);
        expect(scope.previewOptions.columnDefs.length).toBe(2);

    });
});
