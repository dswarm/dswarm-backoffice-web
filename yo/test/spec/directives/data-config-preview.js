'use strict';

describe('Controller: DataConfigPreviewCtrl', function () {
    var $httpBackend, $rootScope, scope, dataConfigPreviewCtrl;

    beforeEach(module('dmpApp', 'mockedDataConfigPreview'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();

        $httpBackend.whenPOST('resources/1/configurationpreview').respond($injector.get('mockDataConfigPreviewJSON'));

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

        scope.dataConfigUpdated({"id":1, "resourceId":1, "name":"foo","description":"bar","parameters":{"encoding":"UTF-8", "escape_character" : "\\", "quote_character" : "\"", "column_delimiter" : ",", "row_delimiter" : "\n"}});

        $rootScope.$digest();
        $httpBackend.flush();

        expect(scope.previewResult.length).toBe(5);

    });
});
