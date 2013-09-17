'use strict';

describe('Controller: DataListCtrl', function () {
  var $httpBackend, $rootScope, scope, dataListCtrl;

  beforeEach(module('dmpApp'));

  var datas = [
    { "id": 1, "name": "_01.test.csv", "type": "FILE", "attributes": { "path": "/home/dmp/datamanagement-platform/init/../tmp/resources/_01.test.csv", "filetype": "text/csv", "filesize": -1 } },
    { "id": 2, "name": "dmp.csv", "type": "FILE", "attributes": { "path": "/home/dmp/datamanagement-platform/init/../tmp/resources/dmp.csv", "filetype": "text/csv", "filesize": -1 } }
  ];

  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');

    var $resource = $injector.get('$resource')
      , fileResource = $resource('/dmp/resources/:id');

    scope = $rootScope.$new();

    $httpBackend.when('GET', '/dmp/resources').respond(datas);

    var $controller = $injector.get('$controller');

    dataListCtrl = function () {
      return $controller('DataListCtrl', {
        '$scope': scope,
        'FileResource': fileResource
      });
    };
  }));

  it('should load the resource data objects', function() {
    var ctrl;
    $httpBackend.expectGET('/dmp/resources');
    scope.$apply(function() {
       ctrl = dataListCtrl();
    });
    $httpBackend.flush();

    var compare = function(expected, actual) {
      angular.forEach(expected, function (val, key) {
        if (angular.isObject(val) || angular.isArray(val)) {
          compare(val, actual[key]);
        } else {
          expect(actual[key]).toBe(val);
        }
      });
    };

    angular.forEach(datas, function(data, idx) {
      compare(data, scope.files[idx]);
    });
  })

});
