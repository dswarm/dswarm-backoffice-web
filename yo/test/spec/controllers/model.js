'use strict';

describe('Controller: ModelCtrl', function () {
    var $httpBackend, $rootScope, scope, modelCtrl, schema;

    beforeEach(module('dmpApp', 'mockedSchema', 'mockedTargetSchema', 'mockedDataModel', 'mockedProject'));

    beforeEach(module(function($provide) {
        $provide.value('ApiEndpoint', '/dmp/');
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

        $httpBackend.whenGET('/dmp/projects').respond($injector.get('mockProjectJSON'));
        $httpBackend.whenGET('/dmp/projects/1').respond($injector.get('mockProjectJSON'));

        var $controller = $injector.get('$controller');

        modelCtrl = function () {
            return $controller('ModelCtrl', {
                '$scope': scope
            });
        };

    }));

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should have a ModelCtrl controller', function() {
        var ModelCtrl = modelCtrl();
        $httpBackend.flush();
        expect(ModelCtrl).not.toBe(null);
    });


    xit('should remove source from set', function() {

        var source = {
            name : 'foo',
            resourceId : 1,
            configId : 1,
            schema : schema,
            collapsed : true,
            selected : true
        };

        modelCtrl();

        scope.addSource(source.schema, source.resourceId, source.configId, source.collapsed, source.selected, source.name);

        expect(scope.sources.length).toBe(1);
        expect(scope.sources[0].name).toBe('foo');

        scope.removeSource(scope.sources[0]);

        expect(scope.sources.length).toBe(0);
    });

    xit('should send broadcast of selected source and set selected source value', function() {

        var source = {
            name : 'foo',
            dataModelId : 1,
            schemaId : 1,
            schema : schema,
            collapsed : true,
            selected : true
        },
            flag;

        runs(function() {
            flag = false;

            modelCtrl();

            scope.selectSource(source);

            setTimeout(function() {
                flag = true;
            }, 1);
        });

        waitsFor(function() {
            return flag;
        }, "The source should be selected", 100);

        runs(function() {
            expect(scope.currentSource).toBe(source);
        });

    });

    it('should load source data from server', function() {

        $httpBackend.expectGET('/dmp/projects');

        modelCtrl();

        scope.loadProjectData(1);

        $rootScope.$digest();
        $httpBackend.flush();

        expect(scope.project.input_data_model.id).toBe(34);

    });

});
