'use strict';

describe('Controller: Export', function () {
    var $rootScope, scope, exportCtrl, fileDownloadMock, mockDataModelsJSON;

    beforeEach(module('dmpApp', 'mockedDataModel'));

    beforeEach(function () {
        spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
        spyOn(XMLHttpRequest.prototype, 'send');
    });


    beforeEach(function () {

        fileDownloadMock = jasmine.createSpy('fileDownload');

        module(function ($provide) {
            $provide.value('fileDownload', fileDownloadMock);
        });

    });

    beforeEach(inject(function ($injector, $httpBackend) {
        $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();

        var win = {
            dmp: {
                jsRoutes: {
                    api: '/dmp/'
                }
            }
        };

        var $controller = $injector.get('$controller');

        exportCtrl = function () {
            return $controller('ExportCtrl', {
                '$scope': scope,
                '$window': win
            });
        };

        mockDataModelsJSON = $injector.get('mockDataModelsJSON');

        $httpBackend.whenGET('/dmp/datamodels').respond(mockDataModelsJSON);

    }));

    it('should have a ExportCtrl controller', function() {
        var ExportCtrl = exportCtrl();
        expect(ExportCtrl).not.toBe(null);
    });

    it('should have a called fileDownload with url to get all export data when clicking onExportAllClick', inject(function (fileDownload, Neo4jEndpoint) {

        exportCtrl();
        scope.onExportAllClick('application/n-quads');
        expect(fileDownload).toHaveBeenCalledWith( Neo4jEndpoint + 'rdf/getall?format=application%2Fn-quads');
    }));

    it('should have a called fileDownload with correct url when clicking onExportModelClick', inject(function (fileDownload, ApiEndpoint) {

        exportCtrl();

        scope.selectedModel = mockDataModelsJSON;

        scope.onExportModelClick('application/n-quads');
        expect(fileDownload).toHaveBeenCalledWith( ApiEndpoint + 'datamodels/1/export?format=application%2Fn-quads');
    }));


    it('should update grid data on updateGridData', inject(function ($httpBackend) {

        $httpBackend.expectGET('/dmp/datamodels');
        exportCtrl();
        $rootScope.$digest();
        $httpBackend.flush();

        scope.updateGridData();

        expect(scope.models.length).toBe(3);

    }));



});
