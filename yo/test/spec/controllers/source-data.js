'use strict';

describe('Controller: SourceDataCtrl', function () {
    var $httpBackend, $rootScope, scope, sourceDataCtrl;

    beforeEach(module('dmpApp', 'mockedSchema', 'mockedRecord'));


    var win = {
        dmp: {
            jsRoutes: {
                api: '/dmp/'
            }
        }
    };

    beforeEach(module('dmpApp', 'mockedSchema', 'mockedTargetSchema'));

    beforeEach(module(function($provide) {
        $provide.value('$window', win);
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();

        $httpBackend.whenGET('/data/schema.json').respond($injector.get('mockSchemaJSON'));
        $httpBackend.whenGET('/data/record.json').respond($injector.get('mockRecordJSON'));

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

});
