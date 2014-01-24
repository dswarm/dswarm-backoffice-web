'use strict';

describe('Controller: SourceDataCtrl', function () {
    var $httpBackend, $rootScope, scope, sourceDataCtrl;

    beforeEach(module('dmpApp', 'mockedSchema', 'mockedRecord', 'mockedData'));

    beforeEach(module(function($provide) {
        $provide.value('Util', {
            apiEndpoint: '/dmp/'
        });
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();

        $httpBackend.whenGET('/dmp/schemas/1').respond($injector.get('mockSchemaSimpleJSON'));
        $httpBackend.whenGET('/dmp/datamodels/1/data?atMost=3').respond($injector.get('mockDataJSON'));

        var $controller = $injector.get('$controller');
        sourceDataCtrl = function () {
            return $controller('SourceDataCtrl', {
                $scope: scope
            });
        };

    }));

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should have a SourceDataCtrl controller', function() {
        var SourceDataCtrl = sourceDataCtrl();
        expect(SourceDataCtrl).not.toBe(null);
    });

    it('should have a SourceDataCtrl controller', function() {
        var dataInclude;

        sourceDataCtrl();

        scope.showData = true;
        dataInclude = scope.dataInclude();

        expect(dataInclude).toBe('sourcedata');

    });

    it('should load data from server', function() {

        $httpBackend.expectGET('/dmp/schemas/1');

        sourceDataCtrl();

        scope.loadData(1, 1, 'foo');

        $rootScope.$digest();
        $httpBackend.flush();

        expect(scope.showData).toBe(true);
        expect(scope.records.length).toBe(3);
        expect(scope.resourceName).toBe('foo');

    });


});
