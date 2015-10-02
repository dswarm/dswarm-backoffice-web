'use strict';
/* jshint ignore:start */
describe('Directive: DataConfigXml', function () {
    var $rootScope, $compile, $httpBackend, $location;
    var $jsonResponse, $jsonResponseGet;
    var element, scope;
    var elementHtml = '<dataconfigxml></dataconfigxml>';

    var routeParams = {
        resourceId: 42,
        configType: 'xml'
    };

    beforeEach(module('dmpApp', 'mockedDataConfig'));

    beforeEach(module(function($provide) {
        $provide.constant('$routeParams', routeParams);
        $provide.value('ApiEndpoint', '/dmp/');
    }));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $compile = $injector.get('$compile');

        $httpBackend.whenGET('views/directives/data-config-xml.html').respond('<div></div>');

        $jsonResponse = $injector.get('mockDataConfigSaveJSON');
        $jsonResponseGet = $injector.get('mockDataConfigXMLResource');

        $httpBackend.whenGET('/dmp/resources/42').respond($jsonResponseGet);
        $httpBackend.whenGET('/dmp/resources/1').respond({});
        $httpBackend.whenPOST('/dmp/datamodels?enhanceDataResource=true').respond($jsonResponse);


        routeParams.resourceId = 42;
        scope = $rootScope.$new();

        var _element = angular.element(elementHtml);
        element = $compile(_element)(scope);
    }));

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should have a DataConfigXmlCtrl controller', function() {
        scope.mode = 'create';

        routeParams.resourceId = 1;

        $httpBackend.expectGET('views/directives/data-config-xml.html');
        $httpBackend.expectGET('/dmp/resources/1');

        scope.$digest();
        $httpBackend.flush();

//        var elScope = element.scope();
        var elScope = scope.$$childHead;
        expect(elScope.resourceId).toBe(1);
        expect(elScope.selectedSet).toEqual([]);
        expect(elScope.config).toEqual({
            parameters: {
                storage_type: 'xml'
            }
        });
    });


    it('should request the specified data Resource', function() {
        scope.mode = 'create';
        scope.mabxml = false;

        $httpBackend.expectGET('/dmp/resources/42');

        scope.$digest();
        $httpBackend.flush();

        var elScope = element.scope();
        expect(elScope.resourceId).toBe(42);
        expect(elScope.selectedSet).toEqual([{
            uuid: 1337,
            name: 'foo',
            description: 'bar'
        }]);

        expect(elScope.config).toEqual({
            name: 'foooo',
            description: 'bar baz',
            parameters: {
                schema_file: {
                    uuid: 1337,
                    name: 'foo',
                    description: 'bar'
                },
                storage_type: 'xml'
            }
        });
    });


    it('should change location on cancel', function() {
        scope.mode = 'create';

        $httpBackend.expectGET('/dmp/resources/42');

        scope.$digest();
        $httpBackend.flush();

        element.scope().onCancelClick();

        expect($location.path()).toBe('/data/');
    });

    it('should change location after save', function() {
        scope.mode = 'create';
        scope.mabxml = false;

        $httpBackend.expectGET('/dmp/resources/42');

        scope.$digest();
        $httpBackend.flush();

        element.scope().onSaveClick();

        $httpBackend.flush();

        expect($location.path()).toBe('/data/');

    });


});
