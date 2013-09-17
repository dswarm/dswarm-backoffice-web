'use strict';

describe('File Resource', function () {
  var $httpBackend, $rootScope, scope;

  beforeEach(module('dmpApp'));

  var compare = function (expected, actual) {
    angular.forEach(expected, function (val, key) {
      if (angular.isObject(val) || angular.isArray(val)) {
        compare(val, actual[key]);
      } else {
        expect(actual[key]).toBe(val);
      }
    });
  };

  var datas = [
    { "id": 1, "name": "_01.test.csv", "type": "FILE", "attributes": { "path": "/home/dmp/datamanagement-platform/init/../tmp/resources/_01.test.csv", "filetype": "text/csv", "filesize": -1 } },
    { "id": 2, "name": "dmp.csv", "type": "FILE", "attributes": { "path": "/home/dmp/datamanagement-platform/init/../tmp/resources/dmp.csv", "filetype": "text/csv", "filesize": -1 } }
  ];

  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');

    var $window = $injector.get('$window');
    $window.dmp = {
      jsRoutes: {
        api: '/dmp/'
      }
    };

    scope = $rootScope.$new();

    $httpBackend.when('GET', '/dmp/resources').respond(datas);
    $httpBackend.when('GET', '/dmp/resources/1').respond(datas[0]);
  }));

  it('should load all resources on a query call', inject(function (FileResource) {
    var response;
    $httpBackend.expectGET('/dmp/resources');
    scope.$apply(function () {
      response = FileResource.query();
    });
    $httpBackend.flush();

    angular.forEach(datas, function (data, idx) {
      compare(data, response[idx]);
    });

  }));

  it('should load a specific resource on a get', inject(function (FileResource) {
    var response;
    $httpBackend.expectGET('/dmp/resources/1');
    scope.$apply(function () {
      response = FileResource.get({id: 1});
    });
    $httpBackend.flush();

    //noinspection JSUnusedAssignment
    compare(datas[0], response);

  }));
});
