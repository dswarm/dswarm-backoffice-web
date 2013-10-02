'use strict';

describe('Controller: SchemaCtrl', function () {
    var $httpBackend, $rootScope, scope, schemaCtrl;

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
        $httpBackend.whenGET('/data/targetschema.json').respond($injector.get('mockTargetSchemaJSON'));

        var $controller = $injector.get('$controller');

        schemaCtrl = function () {
            return $controller('SchemaCtrl', {
                '$scope': scope
            });
        };

    }));

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should have a SchemaCtrl controller', function() {
        var SchemaCtrl = schemaCtrl();
        $rootScope.$digest();
        $httpBackend.flush();
        expect(SchemaCtrl).not.toBe(null);
    });

    it('should have loaded source schema data', inject(function () {
            $httpBackend.expectGET('/data/schema.json');
            schemaCtrl();
            $rootScope.$digest();
            $httpBackend.flush();

            expect(scope.sourceSchema.name).toBe('OAI-PMH');
            expect(scope.sourceSchema.children.length).toBe(3);

        }
    ));

    it('should have loaded source schema data', inject(function () {
            $httpBackend.expectGET('/data/targetschema.json');
            schemaCtrl();
            $rootScope.$digest();
            $httpBackend.flush();

            expect(scope.targetSchema.name).toBe('OAI-PMH');
            expect(scope.targetSchema.children.length).toBe(15);

        }
    ));
});
