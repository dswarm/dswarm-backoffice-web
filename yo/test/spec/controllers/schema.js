'use strict';

describe('Controller: SchemaCtrl', function () {
    var $httpBackend, $rootScope, scope, schemaCtrl, schema;

    beforeEach(module('dmpApp', 'mockedSchema', 'mockedTargetSchema', 'mockedDataModel', 'mockedProject'));

    beforeEach(module(function($provide) {
        $provide.value('ApiEndpoint', '/dmp/');
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();

        schema = $injector.get('mockSchemaJSON');

        $httpBackend.whenGET('/data/schema.json').respond(schema);
        $httpBackend.whenGET('/data/targetschema.json').respond($injector.get('mockTargetSchemaJSON'));

        $httpBackend.whenGET('/dmp/resources/1/configurations/1/schema').respond($injector.get('mockSchemaSimpleJSON'));
        $httpBackend.whenGET('/dmp/resources/1').respond($injector.get('mockSchemaSimpleJSON'));

        $httpBackend.whenGET('/dmp/projects/1').respond($injector.get('mockProjectJSON'));
        // QUICKFIX
        $httpBackend.whenGET('/dmp/datamodels/34').respond($injector.get('mockProjectJSON').input_data_model);
        // ENDQUICKFIX

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
        expect(SchemaCtrl).not.toBe(null);
    });

    it('should toggle collapse state', function() {

        var schema = { collapsed : true };

        schemaCtrl();

        scope.collapse(schema);

        expect(schema.collapsed).toBe(false);

        scope.collapse(schema);

        expect(schema.collapsed).toBe(true);

    });

    it('should return chevron id based on collapsed state', function() {

        var schema = { collapsed : true },
            chevron;

        schemaCtrl();

        chevron = scope.chevron(schema);

        expect(chevron).toBe('glyphicon-chevron-right');

        scope.collapse(schema);
        chevron = scope.chevron(schema);

        expect(chevron).toBe('glyphicon-chevron-down');

    });





});
