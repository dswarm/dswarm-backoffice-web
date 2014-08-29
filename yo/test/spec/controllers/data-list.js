'use strict';

describe('Controller: DataListCtrl', function () {
    var $httpBackend, $rootScope, scope, dataListCtrl;

    beforeEach(module('dmpApp'));

    var resources = [
        { id: 1, name: 'rs01'}
    ];

    var models = [
        {id: 1, name: 'dm01', data_resource: {id: 1}, configuration: {id: 1, parameters: {storage_type: 'csv'}}}
    ];

    var projects = [
        {
            id: 3,
            name: "Foo",
            description: "Bar",
            mappings: [],
            functions: [],
            input_data_model: {id: 1, name: 'dm01', data_resource: {id: 1}, configuration: {id: 1, parameters: {storage_type: 'csv'}}}
        }
    ];

    beforeEach(module(function ($provide) {
        $provide.value('ApiEndpoint', '/dmp/');
    }));


    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();

        $httpBackend.when('GET', '/dmp/resources').respond(resources);
        $httpBackend.when('GET', '/dmp/datamodels').respond(models);
        $httpBackend.when('GET', '/dmp/projects').respond(projects);

        var $controller = $injector.get('$controller');

        dataListCtrl = function () {
            return $controller('DataListCtrl', {
                '$scope': scope
            });
        };
    }));

    it('should load the resource data objects', function () {
        var ctrl;
        $httpBackend.expectGET('/dmp/resources');
        $httpBackend.expectGET('/dmp/projects');
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
        $httpBackend.expectGET('/dmp/resources');
        $httpBackend.expectGET('/dmp/projects');
        scope.$apply(function () {
            ctrl = dataListCtrl();
        });
        $httpBackend.flush();

        spyOn(ProjectResource, "save");

        scope.onUseForNewProjectClick([
            { id: 2}
        ], { name: 'Foo', description: 'Bar'});

        var callArgs = ProjectResource.save.calls.mostRecent().args;

        expect(callArgs[1].input_data_model.id).toBe(2);
        expect(callArgs[1].name).toBe('Foo');
        expect(callArgs[1].description).toBe('Bar');

    }));

    it('data should be loaded', function () {

        var ctrl;

        $httpBackend.expectGET('/dmp/resources');
        $httpBackend.expectGET('/dmp/projects');

        scope.$apply(function () {
            ctrl = dataListCtrl();
        });
        $httpBackend.flush();

        $httpBackend.expectGET('/dmp/projects');

        scope.updateGridData();

        expect(scope.projects[0].id).toBe(3);

    });

});
