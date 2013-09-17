'use strict';

describe('Controller: ComponentsCtrl', function () {
  var $httpBackend, $rootScope, scope, componentsCtrl;

  beforeEach(module('dmpApp', 'mockedFunctions'));

  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');

    scope = $rootScope.$new();

    $httpBackend.when('GET', '/data/functions.json').respond($injector.get('mockFunctionsJSON'));

    var $controller = $injector.get('$controller');

    componentsCtrl = function () {
      return $controller('ComponentsCtrl', {
        '$scope': scope
      });
    };
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have loaded function data', function () {
      $httpBackend.expectGET('/data/functions.json');
      componentsCtrl();
      $rootScope.$digest();
      $httpBackend.flush();

      expect(scope.functions.children.length).toBe(23);

    }
  );
});
