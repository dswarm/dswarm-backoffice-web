'use strict';

describe('Controller: SourceDataCtrl', function () {
    var $httpBackend, $rootScope, scope, sourceDataCtrl;

    beforeEach(module('dmpApp', 'mockedSchema', 'mockedRecord', 'mockedData'));


    var win = {
        dmp: {
            jsRoutes: {
                api: '/dmp/'
            }
        }
    };

    beforeEach(module(function($provide) {
        $provide.value('$window', win);
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();

        $httpBackend.whenGET('/dmp/resources/configurations/schema').respond($injector.get('mockSchemaSimpleJSON'));
        $httpBackend.whenGET('/dmp/resources/configurations/data?atMost=3').respond($injector.get('mockDataJSON'));

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

    it('should have a SchemaCtrl controller', function() {
        var SourceDataCtrl = sourceDataCtrl();
        expect(SourceDataCtrl).not.toBe(null);
    });

    it('should have a SchemaCtrl controller', function() {
        var dataInclude;

        sourceDataCtrl();

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
        expect(scope.resourceName).toBe('foo');

    });


});
