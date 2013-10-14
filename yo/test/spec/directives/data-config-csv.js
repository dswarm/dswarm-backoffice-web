'use strict';

describe('Controller: DataConfigCsvCtrl', function () {
    var $httpBackend, $rootScope, $location, scope, dataConfigCsvCtrl, $jsonResponse, $jsonResponseGet;

    var win = {
        _: {
            debounce: function(fn, timeout) {
                return function() {
                    fn();
                }
            },
            max: _.max
        },
        dmp: {
            jsRoutes: {
                api: ''
            }
        }
    };

    beforeEach(module('dmpApp', 'mockedDataConfig'));

    beforeEach(module(function($provide) {
        $provide.value('$window', win);
    }));

    beforeEach(function() {
        spyOn(XMLHttpRequest.prototype, 'open').andCallThrough();
        spyOn(XMLHttpRequest.prototype, 'send');
    });

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');

        var $resource = $injector.get('$resource');

        $jsonResponse = $injector.get('mockDataConfigSaveJSON');
        $jsonResponseGet = $injector.get('mockDataConfigGetJSON');

        $httpBackend.whenGET('resources/1/configurations').respond($jsonResponseGet);
        $httpBackend.whenPOST('resources/1/configurations').respond($jsonResponse);

        scope = $rootScope.$new();

        var $controller = $injector.get('$controller');

        dataConfigCsvCtrl = function () {

            return $controller('DataConfigCsvCtrl', {
                '$scope': scope
            });
        };
    }));

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should have a DataConfigCsvCtrl controller', function() {
        var DataConfigCsvCtrl = dataConfigCsvCtrl();
        expect(DataConfigCsvCtrl).not.toBe(null);
    });


    it('should change location on cancel', function() {

        dataConfigCsvCtrl();

        scope.onCancelClick();

        expect($location.path()).toBe('/#/data/');

    });

    it('should change location after save', function() {

        $httpBackend.expectGET('resources/1/configurations');
        $httpBackend.expectPOST('resources/1/configurations');

        dataConfigCsvCtrl();

        $location.path('#/data-config/1/csv');

        scope.config = {"id":1, "resourceId":1, "name":"foo","description":"bar","parameters":{"encoding":"UTF-8", "escape_character" : "\\", "quote_character" : "\"", "column_delimiter" : ",", "row_delimiter" : "\n"}};
        scope.resourceId = 1;

        scope.onSaveClick();

        $rootScope.$digest();
        $httpBackend.flush();

        expect($location.path()).toBe('/#/data/');

    });


});
