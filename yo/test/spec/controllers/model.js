'use strict';

describe('Controller: ModelCtrl', function () {
    var $httpBackend, $rootScope, $q;
    var scope, modelCtrl, schema, expectModelCtrl, mockProjectJSON;
    var shouldRejectModal;

    beforeEach(module('dmpApp', 'mockedSchema', 'mockedTargetSchema', 'mockedDataModel', 'mockedProject'));

    beforeEach(module(function($provide) {
        $provide.value('ApiEndpoint', '/dmp/');
        $provide.value('jsP', {
            detachEveryConnection: angular.noop
        });
        $provide.value('schemaParser', {
            fromDomainSchema: angular.identity
        });
        $provide.value('localStorageService', {
            get: function(id) {
                if (id === 'project.draft.9') {
                    var mockProjectJSON2 = angular.copy(mockProjectJSON);
                    mockProjectJSON2.id = 9;
                    return  mockProjectJSON2;
                }
                return null;
            },
            set: angular.noop,
            remove: angular.noop
        });
        $provide.value('$modal', {
            open: function() {
                var defer = $q.defer();
                if (shouldRejectModal) {
                    defer.reject();
                } else {
                    defer.resolve();
                }
                return {
                    result: defer.promise
                };
            }
        });
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');

        shouldRejectModal = false;

        scope = $rootScope.$new();

        schema = $injector.get('mockSchemaJSON');

        $httpBackend.whenGET('/data/schema.json').respond(schema);
        $httpBackend.whenGET('/data/targetschema.json').respond($injector.get('mockTargetSchemaJSON'));

        $httpBackend.whenGET('/dmp/resources/1/configurations/1/schema').respond($injector.get('mockSchemaSimpleJSON'));
        $httpBackend.whenGET('/dmp/resources/1').respond($injector.get('mockSchemaSimpleJSON'));

        mockProjectJSON = $injector.get('mockProjectJSON');
        $httpBackend.whenGET('/dmp/projects').respond(mockProjectJSON);
        $httpBackend.whenGET('/dmp/projects/1').respond(mockProjectJSON);
        $httpBackend.whenGET('/dmp/projects/6').respond(mockProjectJSON);
        $httpBackend.whenPUT('/dmp/projects/6').respond(mockProjectJSON);

        var $controller = $injector.get('$controller');

        modelCtrl = function (projectId) {
            return $controller('ModelCtrl', {
                '$scope': scope,
                '$routeParams': {projectId: projectId}
            });
        };

        expectModelCtrl = function (projectId) {
            $httpBackend.expectGET('/dmp/projects');
            var ctrl = modelCtrl(projectId);
            $httpBackend.flush();
            return ctrl;
        };

    }));

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should have a ModelCtrl controller', function() {
        var ModelCtrl = expectModelCtrl();
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
        expectModelCtrl();

        scope.loadProjectData(1);
        $rootScope.$digest();
        $httpBackend.flush();

        expect(scope.project.input_data_model.id).toBe(34);
    });

    it('should close alters', function() {
        expectModelCtrl();

        scope.alerts.push('alert1');
        scope.alerts.push('alert2');

        scope.closeAlert(0);
        expect(scope.alerts.length).toBe(1);

        scope.closeAlert();
        expect(scope.alerts.length).toBe(1);

        scope.closeAlert(1);
        expect(scope.alerts.length).toBe(1);
    });

    it('should set the output data model', inject(function($timeout, PubSub) {
        expectModelCtrl();

        spyOn(PubSub, 'broadcast');

        scope.setOutputDataModel({schema: 'foo'});

        expect(scope.project.output_data_model).toEqual({schema: 'foo'});
        expect(scope.project._$output_data_model_schema).toEqual('foo');
        expect(scope.isOutputDataModelLoaded).toBe(true);

        expect(PubSub.broadcast).not.toHaveBeenCalled();
        $timeout.flush();

        expect(PubSub.broadcast).toHaveBeenCalledWith('outputDataSelected', {});
    }));

    it('should set the output data model via schema', inject(function($timeout, PubSub) {
        expectModelCtrl();

        spyOn(PubSub, 'broadcast');

	scope.setOutputSchema({schema: 'foo'});

        expect(scope.project.output_data_model).toEqual({schema: 'foo'});
        expect(scope.project._$output_data_model_schema).toEqual('foo');
        expect(scope.isOutputDataModelLoaded).toBe(true);

        expect(PubSub.broadcast).not.toHaveBeenCalled();
        $timeout.flush();

        expect(PubSub.broadcast).toHaveBeenCalledWith('outputDataSelected', {});
    }));


    it('should detach every connection on a location change', inject(function(jsP) {
        expectModelCtrl();

        spyOn(jsP, 'detachEveryConnection');

        scope.$emit('$locationChangeStart', 'doo');

        expect(jsP.detachEveryConnection).toHaveBeenCalled();
    }));

    it('should load a project from cache', inject(function(localStorageService) {

        spyOn(localStorageService, 'get').andCallThrough();

        expectModelCtrl();

        var foo = jasmine.createSpyObj('foo', ['callback']);

        scope.loadProjectData(9, foo.callback);

        expect(localStorageService.get).toHaveBeenCalledWith('project.draft.9');
        expect(foo.callback).toHaveBeenCalled();
    }));

    it('should save a project', function() {
        expectModelCtrl();

        $httpBackend.expectPUT('/dmp/projects/6');

        scope.onSaveProjectClick();

        $httpBackend.flush();
        expect(scope.projectIsDraft).toBe(false);
    });

    it('should save a project from an alert button', function() {
        expectModelCtrl();

        scope.alerts.push({name: 'foo'});

        $httpBackend.expectPUT('/dmp/projects/6');

        scope.onSaveProjectClick(0);

        expect(scope.alerts[0].busy).toBe(true);

        $httpBackend.flush();
        expect(scope.projectIsDraft).toBe(false);
        expect(scope.alerts.length).toBe(0);

        // ----

        scope.projectIsDraft = true;

        $httpBackend.expectPUT('/dmp/projects/6');

        scope.onSaveProjectClick(0);

        expect(scope.alerts.length).toBe(0);

        $httpBackend.flush();
        expect(scope.projectIsDraft).toBe(false);
        expect(scope.alerts.length).toBe(0);

        // ----

        scope.projectIsDraft = true;
        scope.alerts.push({name: 'foo', busy: true});

        scope.onSaveProjectClick(0);

        expect(scope.projectIsDraft).toBe(true);
        expect(scope.alerts.length).toBe(1);
    });

    it('should discard a project', function() {
//        $templateCache.put('views/controller/confirm-discard-draft.html', '<div></div>');
        expectModelCtrl();

        $httpBackend.expectGET('/dmp/projects/6');

        scope.onDiscardDraftClick();
        scope.$apply();

        $httpBackend.flush();

        expect(scope.projectIsDraft).toBe(false);
    });

    it('should discard a project from an alert button', function() {
        expectModelCtrl();

        scope.alerts.push({name: 'foo'});

        $httpBackend.expectGET('/dmp/projects/6');

        scope.onDiscardDraftClick(0);
        scope.$apply();

        expect(scope.alerts[0].busy).toBe(true);

        $httpBackend.flush();
        expect(scope.projectIsDraft).toBe(false);
        expect(scope.alerts.length).toBe(0);

        // ----

        scope.projectIsDraft = true;

        $httpBackend.expectGET('/dmp/projects/6');

        scope.onDiscardDraftClick(0);
        scope.$apply();

        expect(scope.alerts.length).toBe(0);

        $httpBackend.flush();
        expect(scope.projectIsDraft).toBe(false);
        expect(scope.alerts.length).toBe(0);

        // ----

        scope.projectIsDraft = true;
        scope.alerts.push({name: 'foo', busy: true});

        scope.onDiscardDraftClick(0);
        scope.$apply();

        expect(scope.projectIsDraft).toBe(true);
        expect(scope.alerts.length).toBe(1);
    });

    it('should leave the alter open, but unbusy when the discard was rejected', function() {
        shouldRejectModal = true;
        var previousDraftStatus;

        expectModelCtrl();

        previousDraftStatus = scope.projectIsDraft;
        scope.onDiscardDraftClick();
        scope.$apply();

        expect(scope.projectIsDraft).toBe(previousDraftStatus);

        // ----

        scope.alerts.push({name: 'foo'});

        previousDraftStatus = scope.projectIsDraft;
        scope.onDiscardDraftClick(0);
        scope.$apply();

        expect(scope.alerts[0].busy).toBe(false);
        expect(scope.projectIsDraft).toBe(previousDraftStatus);

        // ----

        scope.alerts = [];

        previousDraftStatus = scope.projectIsDraft;
        scope.onDiscardDraftClick(0);
        scope.$apply();

        expect(scope.alerts.length).toBe(0);
        expect(scope.projectIsDraft).toBe(previousDraftStatus);
    });
});
