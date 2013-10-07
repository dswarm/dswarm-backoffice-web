'use strict';

describe('Controller: DataConfigPreviewCtrl', function () {
    var $httpBackend, $rootScope, scope, dataConfigPreviewCtrl, $timeout, $jsonResponse;

    beforeEach(module('dmpApp', 'mockedDataConfigPreview'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $timeout = $injector.get('$timeout');

        $jsonResponse = $injector.get('mockDataConfigPreviewJSON');

        scope = $rootScope.$new();

        $httpBackend.whenPOST('resources/1/configurationpreview').respond($jsonResponse);

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

    it('should push preview response to scope', function() {

        dataConfigPreviewCtrl();

        scope.dataConfigUpdated({"id":1, "resourceId":1, "name":"foo","description":"bar","parameters":{"encoding":"UTF-8", "escape_character" : "\\", "quote_character" : "\"", "column_delimiter" : ",", "row_delimiter" : "\n"}});

        $rootScope.$digest();
        $httpBackend.flush();

        expect(scope.previewResult.length).toBe(5);

    });

    it('should run a preview update if next preview update is set', function() {

        dataConfigPreviewCtrl();

        scope.nextUpdate = {"id":1, "resourceId":1, "name":"foo","description":"bar","parameters":{"encoding":"UTF-8", "escape_character" : "\\", "quote_character" : "\"", "column_delimiter" : ",", "row_delimiter" : "\n"}};

        scope.checkNextConfigUpdate();

        $rootScope.$digest();

        $timeout.flush();
        $httpBackend.flush();

        expect(scope.previewResult.length).toBe(5);

    });

    it('should return grid id when flag is set', function() {

        var shouldInclude;

        dataConfigPreviewCtrl();

        scope.showGrid = true;

        shouldInclude = scope.gridInclude();

        expect(shouldInclude).toBe('previewgrid');

    });

    it('should update scope data from result', function() {

        dataConfigPreviewCtrl();

        scope.dataConfigUpdatedSave($jsonResponse);

        expect(scope.previewResult.length).toBe(5);
        expect(scope.colDefs.length).toBe(2);

    });

});
