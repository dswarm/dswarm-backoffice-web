'use strict';

describe('Controller: DataListCtrl', function () {
    var $httpBackend, $rootScope, scope, dataListCtrl,
        fakeModal, $modal;

    beforeEach(module('dmpApp'));

    var resources = [
        { uuid: 1, name: 'rs01'}
    ];

    var models = [
        { uuid: 1, name: 'dm01', data_resource: { uuid: 1 }, configuration: { uuid: 1, parameters: { storage_type: 'csv' } } }
    ];

    var projects = [
        {
            uuid: 3,
            name: "Foo",
            description: "Bar",
            mappings: [],
            functions: [],
            input_data_model: { uuid: 1, name: 'dm01', data_resource: { uuid: 1 }, configuration: { uuid: 1, parameters: {storage_type: 'csv' } } }
        }
    ];

    beforeEach(module(function ($provide) {
        $provide.value('ApiEndpoint', '/dmp/');
    }));

    beforeEach(inject(function ($q, _$modal_) {
        $modal = _$modal_;

        fakeModal = (function() {
            var defer = $q.defer();

            return {
                result: defer.promise,
                close: defer.resolve,
                dismiss: defer.reject
            };
        }());
    }));


    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();

        $httpBackend.when('GET', '/dmp/resources?format=short').respond(resources);
        $httpBackend.when('GET', '/dmp/datamodels?format=medium').respond(models);
        $httpBackend.when('GET', '/dmp/datamodels/1').respond(models[0]);
        $httpBackend.when('GET', '/dmp/projects?format=short').respond(projects);


        var $controller = $injector.get('$controller');

        dataListCtrl = function () {
            return $controller('DataListCtrl', {
                '$scope': scope
            });
        };
    }));

    it('should load the resource data objects', function () {
        var ctrl;
        $httpBackend.expectGET('/dmp/resources?format=short');
        $httpBackend.expectGET('/dmp/projects?format=short');
        scope.$apply(function () {
            ctrl = dataListCtrl();
        });
        $httpBackend.flush();

        var compare = function (expected, actual) {
            angular.forEach(expected, function (val, key) {
                if (angular.isObject(val) || angular.isArray(val)) {
                    compare(val, actual[key]);
                } else {
                    expect(actual[key]).toBe(val);
                }
            });
        };

        angular.forEach(resources, function (data, idx) {
            compare(data, scope.files[idx]);
        });
        angular.forEach(models, function (data, idx) {
            compare(data, scope.models[idx]);
        });
    });

    it('should generate a correct new project call', inject(function (ProjectResource) {

        var ctrl;
        $httpBackend.expectGET('/dmp/resources?format=short');
        $httpBackend.expectGET('/dmp/projects?format=short');
        scope.$apply(function () {
            ctrl = dataListCtrl();
        });
        $httpBackend.flush();

        spyOn(ProjectResource, "save");

        scope.onUseForNewProjectClick([
            { uuid: 1}
        ], { name: 'Foo', description: 'Bar'});

        $httpBackend.expectGET('/dmp/datamodels/1');

        $httpBackend.flush();

        var callArgs = ProjectResource.save.calls.mostRecent().args;

        expect(callArgs[1].input_data_model.uuid).toBe(1);
        expect(callArgs[1].name).toBe('Foo');
        expect(callArgs[1].description).toBe('Bar');

    }));

    it('data should be loaded', function () {

        var ctrl;

        $httpBackend.expectGET('/dmp/resources?format=short');
        $httpBackend.expectGET('/dmp/projects?format=short');

        scope.$apply(function () {
            ctrl = dataListCtrl();
        });
        $httpBackend.flush();

        $httpBackend.expectGET('/dmp/projects');

        scope.updateGridData();

        expect(scope.projects[0].uuid).toBe(3);

    });

    it('should remove project on onProjectDeleteClick', inject(function() {

        var ctrl;

        $httpBackend.expectGET('/dmp/resources?format=short');
        $httpBackend.expectGET('/dmp/projects?format=short');

        scope.$apply(function () {
            ctrl = dataListCtrl();
        });
        $httpBackend.flush();

        $httpBackend.expectDELETE('/dmp/projects').respond(201, '');

        scope.updateGridData();

        expect(scope.projects[0].uuid).toBe(3);

        spyOn($modal, 'open').and.returnValue(fakeModal);

        scope.onProjectDeleteClick([
            { uuid: '3' }
        ]);

        fakeModal.close();
        scope.$digest();

        $httpBackend.flush();

    }));

    it('should remove resource on onProjectDeleteClick', inject(function() {

        var ctrl;

        $httpBackend.expectGET('/dmp/resources?format=short');
        $httpBackend.expectGET('/dmp/projects?format=short');

        scope.$apply(function () {
            ctrl = dataListCtrl();
        });
        $httpBackend.flush();

        $httpBackend.expectDELETE('/dmp/resources').respond(201, '');

        scope.updateGridData();

        expect(scope.projects[0].uuid).toBe(3);

        spyOn($modal, 'open').and.returnValue(fakeModal);

        scope.onResourceDeleteClick([
            { uuid: '3' }
        ]);

        fakeModal.close();
        scope.$digest();

        $httpBackend.flush();

    }));

    it('should remove project on onProjectDeleteClick', inject(function() {

        var ctrl;

        $httpBackend.expectGET('/dmp/resources?format=short');
        $httpBackend.expectGET('/dmp/projects?format=short');

        scope.$apply(function () {
            ctrl = dataListCtrl();
        });
        $httpBackend.flush();

        $httpBackend.expectDELETE('/dmp/datamodels').respond(201, '');

        scope.updateGridData();

        expect(scope.projects[0].uuid).toBe(3);

        spyOn($modal, 'open').and.returnValue(fakeModal);

        scope.onDataModelDeleteClick([
            { uuid: '3' }
        ]);

        fakeModal.close();
        scope.$digest();

        $httpBackend.flush();

    }));

});
