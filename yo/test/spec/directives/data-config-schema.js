'use strict';

describe('Controller: DataConfigSchemaCtrl', function () {
    var $httpBackend, $rootScope, $location, scope, dataConfigSchemaCtrl, $jsonResponse;

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

        $httpBackend.whenPOST('/dmp/resources/42/configurations').respond($jsonResponse);

        scope = $rootScope.$new();

        var $controller = $injector.get('$controller');

        dataConfigSchemaCtrl = function () {

            return $controller('DataConfigSchemaCtrl', {
                '$scope': scope,
                '$routeParams': {
                    'resourceId': 42
                }
            });
        };
    }));

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should have a DataConfigSchemaCtrl controller', function() {
        var DataConfigSchemaCtrl = dataConfigSchemaCtrl();

        expect(DataConfigSchemaCtrl).not.toBe(null);

        expect(scope.config.name).toBe('schema');
        expect(scope.config.description).toBe('schema with id 42');
        expect(scope.config.parameters.storage_type).toBe('schema');
    });


    it('should change location on cancel', function() {

        dataConfigSchemaCtrl();

        scope.onCancelClick();

        expect($location.path()).toBe('/data/');

    });

    it('should change location after save', function() {

        $httpBackend.expectPOST('/dmp/resources/42/configurations');
        dataConfigSchemaCtrl();

        scope.onFlagClick();

        $rootScope.$digest();
        $httpBackend.flush();

        expect($location.path()).toBe('/data/');
    });


});
