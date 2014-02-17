'use strict';

describe('Controller: DataConfigCsvCtrl', function () {
    var $httpBackend, $rootScope, $location, scope, dataConfigCsvCtrl, $jsonResponse, $jsonResponseGet;

    beforeEach(module('dmpApp', 'mockedDataConfig'));

    beforeEach(module(function($provide) {
        $provide.value('ApiEndpoint', '/dmp/');
    }));

    beforeEach(function() {
        spyOn(XMLHttpRequest.prototype, 'open').andCallThrough();
        spyOn(XMLHttpRequest.prototype, 'send');
    });

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');

        $jsonResponse = $injector.get('mockDataConfigSaveJSON');
        $jsonResponseGet = $injector.get('mockDataConfigGetJSON');

        $httpBackend.whenGET('/dmp/resources/42').respond($jsonResponseGet);
        $httpBackend.whenPOST('/dmp/datamodels').respond($jsonResponse);

        scope = $rootScope.$new();

        var $controller = $injector.get('$controller');

        dataConfigCsvCtrl = function () {

            return $controller('DataConfigCsvCtrl', {
                '$scope': scope,
                '$routeParams': {
                    resourceId: 42
                }
            });
        };
    }));

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should have a DataConfigCsvCtrl controller', function() {
        $httpBackend.expectGET('/dmp/resources/42');

        var DataConfigCsvCtrl = dataConfigCsvCtrl();

        $httpBackend.flush();
        expect(DataConfigCsvCtrl).not.toBe(null);
    });


    it('should change location on cancel', function() {
        $httpBackend.expectGET('/dmp/resources/42');

        dataConfigCsvCtrl();

        $httpBackend.flush();

        scope.onCancelClick();

        expect($location.path()).toBe('/data/');

    });

    it('should change location after save', function() {
        $httpBackend.expectGET('/dmp/resources/42');
        $httpBackend.expectPOST('/dmp/datamodels');

        dataConfigCsvCtrl();

        $location.path('#/data-config/1/csv');

        scope.config = {"id":1, "resourceId":1, "name":"foo","description":"bar","parameters":{"encoding":"UTF-8", "escape_character" : "\\", "quote_character" : "\"", "column_delimiter" : ",", "row_delimiter" : "\n"}};
        scope.resourceId = 1;

        scope.onSaveClick();

        $rootScope.$digest();
        $httpBackend.flush();

        expect($location.path()).toBe('/data/');

    });


});
