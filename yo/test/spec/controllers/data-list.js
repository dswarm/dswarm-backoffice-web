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

  beforeEach(module(function($provide) {
    $provide.value('Util', {
      apiEndpoint: '/dmp/'
    });
  }));


  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');

    scope = $rootScope.$new();

    $httpBackend.when('GET', '/dmp/resources').respond(resources);
    $httpBackend.when('GET', '/dmp/datamodels').respond(models);

    var $controller = $injector.get('$controller');

    dataListCtrl = function () {
      return $controller('DataListCtrl', {
        '$scope': scope
      });
    };
  }));

  it('should load the resource data objects', function() {
    var ctrl;
    $httpBackend.expectGET('/dmp/resources');
    $httpBackend.expectGET('/dmp/datamodels');
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

    angular.forEach(resources, function(data, idx) {
      compare(data, scope.files[idx]);
    });
    angular.forEach(models, function(data, idx) {
      compare(data, scope.models[idx]);
    });
  })

});
