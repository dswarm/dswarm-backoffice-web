'use strict';

describe('Controller: Import', function () {
  var $rootScope, scope, importCtrl;

  beforeEach(module('dmpApp'));

  beforeEach(module(function($provide) {
//    spyOn(XMLHttpRequest.prototype, 'onloadstart').andCallThrough();
//    spyOn(XMLHttpRequest.prototype, 'onerror').andCallThrough();
//    spyOn(XMLHttpRequest.prototype, 'onreadystatechange').andCallThrough();
    spyOn(XMLHttpRequest.prototype, 'open').andCallThrough();
    spyOn(XMLHttpRequest.prototype, 'send');
  }));

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');

    scope = $rootScope.$new();

    var win = {
      dmp: {
        jsRoutes: {
          api: '/dmp/'
        }
      }
    };

    var $controller = $injector.get('$controller');

    importCtrl = function () {
      return $controller('ImportCtrl', {
        '$scope': scope,
        '$window': win
      });
    };
  }));

  it('should load the resource data objects', function () {
    var formData = new FormData()
      , ctrl = importCtrl(), data;

    data = scope.data = {
      file: (function(){
        var x = new Blob(["a,b,c\n"], {"type": "text/csv"});
        x.name = 'the_filename';
        return x;
      })(),
      name: 'filename',
      description: 'filedescription'
    };

    formData.append('file', data.file, 'the_filename');
    formData.append('name', data.name);
    formData.append('description', data.description);

    scope.submitForm();

    expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith(formData);
  })

});
