'use strict';

describe('Controller: SchemaCtrl', function () {
    var $httpBackend, $rootScope, scope, schemaCtrl, schema;

    var win = {
        dmp: {
            jsRoutes: {
                api: '/dmp/'
            }
        },
        _: _
    };

    beforeEach(module('dmpApp', 'mockedSchema', 'mockedTargetSchema', 'mockedDataModel', 'mockedProject'));

    beforeEach(module(function($provide) {
        $provide.value('$window', win);
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();

        spyOn($rootScope, '$broadcast');

        schema = $injector.get('mockSchemaJSON');

        $httpBackend.whenGET('/data/schema.json').respond(schema);
        $httpBackend.whenGET('/data/targetschema.json').respond($injector.get('mockTargetSchemaJSON'));

        $httpBackend.whenGET('/dmp/resources/1/configurations/1/schema').respond($injector.get('mockSchemaSimpleJSON'));
        $httpBackend.whenGET('/dmp/resources/1').respond($injector.get('mockSchemaSimpleJSON'));

        $httpBackend.whenGET('/dmp/projects/1').respond($injector.get('mockProjectJSON'));

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

    it('should broadcast handleOpenDataSelector', function() {

        schemaCtrl();

        scope.onAddDataClick();

        expect($rootScope.$broadcast).toHaveBeenCalledWith("handleOpenDataSelector",{ });
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

    it('should add source and it should be selected', function() {

        var source = {
            name : 'foo',
            resourceId : 1,
            configId : 1,
            schema : schema,
            collapsed : true,
            selected : true
        };

        schemaCtrl();

        scope.addSource(source.schema, source.resourceId, source.configId, source.collapsed, source.selected, source.name);

        expect(scope.sources.length).toBe(1);
        expect(scope.sources[0].name).toBe('foo');

        expect(scope.currentSource).toBe(scope.sources[0]);

    });

    it('should remove source from set', function() {

        var source = {
            name : 'foo',
            resourceId : 1,
            configId : 1,
            schema : schema,
            collapsed : true,
            selected : true
        };

        schemaCtrl();

        scope.addSource(source.schema, source.resourceId, source.configId, source.collapsed, source.selected, source.name);

        expect(scope.sources.length).toBe(1);
        expect(scope.sources[0].name).toBe('foo');

        scope.removeSource(scope.sources[0]);

        expect(scope.sources.length).toBe(0);

    });

    it('should send broadcast of selected source and set selected source value', function() {

        var source = {
            name : 'foo',
            dataModelId : 1,
            schemaId : 1,
            schema : schema,
            collapsed : true,
            selected : true
        };

        schemaCtrl();

        scope.selectSource(source);

        expect($rootScope.$broadcast).toHaveBeenCalledWith("handleLoadData",{
            dataModelId : source.dataModelId,
            schemaId : source.schemaId,
            resourceName : source.name
        });

        expect(scope.currentSource).toBe(source);

    });

    it('should load source data from server', function() {

        $httpBackend.expectGET('/dmp/projects/1');

        schemaCtrl();

        scope.loadSourceData(1);

        $rootScope.$digest();
        $httpBackend.flush();

        expect(scope.sources.length).toBe(1);

    });

});
