'use strict';

describe('Controller: DataConfigCsvCtrl', function () {
    var $httpBackend, $rootScope, scope, dataConfigCsvCtrl, spyee;

    var win = {
        _: {
            debounce: function(fn) {
                var args, thisArg;

                return function() {
                    args = arguments;
                    thisArg = this;

                    fn.apply(thisArg, arguments);
                };
            }
        },
        dmp: {
            jsRoutes: {
                api: '/dmp/'
            }
        }
    };

    beforeEach(module('dmpApp', 'mockedDataConfig'));

    beforeEach(module(function($provide) {
        $provide.value('$window', win);
    }));

    beforeEach(function() {
        spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
        spyOn(XMLHttpRequest.prototype, 'send');
    });

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();

        spyee = {
            foo: function(){}
        };

        scope.$on('dataConfigUpdated', function(event, data) {
            spyee.foo(data.config);
        });

        spyOn(spyee, 'foo');

        var $jsonResponseGet = $injector.get('mockDataConfigGetJSON');
        $httpBackend.whenGET('/dmp/resources/42').respond($jsonResponseGet);

        var $controller = $injector.get('$controller');

        dataConfigCsvCtrl = function () {

            return $controller('DataConfigCsvCtrl', {
                '$scope': scope,
                '$routeParams': {
                    resourceId: 42
                }
            });
        };
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    // why not ???
    xit('should not emit event on form name change', function () {
        $httpBackend.expectGET('/dmp/resources/42');

        scope.mode = 'create';

        dataConfigCsvCtrl();

        $httpBackend.flush();

        scope.config.name = 'configname';

        scope.$digest();

        expect(spyee.foo).not.toHaveBeenCalled();
    });

    it('should emit event on form object change', function () {

        scope.mode = 'create';

        $httpBackend.expectGET('/dmp/resources/42');

        dataConfigCsvCtrl();

        $httpBackend.flush();

        scope.config.parameters.column_delimiter = ';';

        scope.$digest();

        expect(spyee.foo).toHaveBeenCalledWith(scope.config);
    });

});
