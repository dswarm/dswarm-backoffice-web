'use strict';

describe('Controller: SourceDataCtrl', function () {
    var $httpBackend, $rootScope, scope, sourceDataCtrl;

    beforeEach(module('dmpApp', 'mockedSchema', 'mockedRecord', 'mockedData', 'mockedProject'));

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
        scope.project = $injector.get('mockProjectJSON');

        $httpBackend.whenGET('/dmp/schemas/1').respond($injector.get('mockSchemaSimpleJSON'));
        $httpBackend.whenGET('/dmp/datamodels/1/data?atMost=3').respond($injector.get('mockDataJSON'));
        $httpBackend.whenGET('/dmp/datamodels/34/data?atMost=3').respond($injector.get('mockDataJSON'));

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
        $httpBackend.flush();

        expect(SourceDataCtrl).not.toBe(null);
    });

    it('should have a SourceDataCtrl controller', function() {
        var dataInclude;

        sourceDataCtrl();

        $httpBackend.flush();

        scope.showData = true;
        dataInclude = scope.dataInclude();

        expect(dataInclude).toBe('sourcedata');

    });

    it('should load data from server', function() {

        sourceDataCtrl();

        scope.loadData(1, 1, 'foo');

        $rootScope.$digest();
        $httpBackend.flush();

        expect(scope.showData).toBe(true);
        expect(scope.records.length).toBe(3);
        expect(scope.resourceName).toBe('test_csv.csv + null data model');

    });


});
