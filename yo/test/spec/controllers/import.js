'use strict';

describe('Controller: Import', function () {
    var $rootScope, scope, importCtrl;

    beforeEach(module('dmpApp'));

    beforeEach(function () {
        spyOn(XMLHttpRequest.prototype, 'open').andCallThrough();
        spyOn(XMLHttpRequest.prototype, 'send');
    });


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
            , data;

        importCtrl();

        data = scope.data = {
            file: (function () {
                var x;
                try {
                    x = new Blob(["a,b,c\n"], {"type": "text/csv"});
                } catch (error) {
                    // phantomJS (Jenkins) doesn't know about Blob as constructor
                    // https://code.google.com/p/phantomjs/issues/detail?id=1013
                    if (error.name === 'TypeError') {
                        var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder
                            , builder = new BlobBuilder();

                        builder.append('a,b,c\n');

                        x = builder.getBlob("text/csv");
                    }
                }
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
    });

});
