'use strict';

describe('Controller: DataObjectCtrl', function () {
    var $httpBackend, $rootScope, scope, dataObjectCtrl;

    beforeEach(module('dmpApp'));

    var data = {
        "id": 1,
        "name": "_01.test.csv",
        "type": "FILE",
        "attributes": {
            "path": "/home/dmp/datamanagement-platform/init/../tmp/resources/_01.test.csv",
            "filetype": "text/csv",
            "filesize": -1
        }
    };

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        var $resource = $injector.get('$resource'),
            fileResource = $resource('/dmp/resources/:id');

        scope = $rootScope.$new();

        $httpBackend.when('GET', '/dmp/resources/1').respond(data);

        var $controller = $injector.get('$controller');

        dataObjectCtrl = function () {
            return $controller('DataObjectCtrl', {
                '$scope': scope,
                'FileResource': fileResource,
                '$routeParams': {resourceId: 1}
            });
        };
    }));

    it('should load the resource data object with ID 1', function () {
        var ctrl;
        $httpBackend.expectGET('/dmp/resources/1');
        scope.$apply(function () {
            ctrl = dataObjectCtrl();
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

        compare(data, scope.file);

    });


});
