'use strict';

describe('Controller: DataConfigPreviewCsvCtrl', function () {
    var $httpBackend, $rootScope, scope, dataConfigPreviewXmlCtrl, $timeout, $jsonResponse10, $jsonResponse20;

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
        }
    };

    beforeEach(module('dmpApp', 'mockedDataConfigPreviewXml'));

    beforeEach(module(function($provide) {
        $provide.value('$window', win);
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $timeout = $injector.get('$timeout');

        $jsonResponse10 = $injector.get('mockDataConfigPreviewXml10JSON');
        $jsonResponse20 = $injector.get('mockDataConfigPreviewXml20JSON');

        scope = $rootScope.$new();

        var $controller = $injector.get('$controller');
        dataConfigPreviewXmlCtrl = function () {
            return $controller('DataConfigPreviewXmlCtrl', {
                $scope: scope
            });
        };

    }));


    it('should have a DataConfigPreviewXmlCtrl controller', function() {
        var DataConfigPreviewXmlCtrl = dataConfigPreviewXmlCtrl();
        expect(DataConfigPreviewXmlCtrl).not.toBe(null);
    });

    it('should push preview response to scope', function() {

        $httpBackend.whenGET('/dmp/resources/1/lines?atMost=50&encoding=UTF-8').respond($jsonResponse10);

        scope.resourceId = 1;
        scope.previewOptions = {
            at_most_rows : 10
        };

        dataConfigPreviewXmlCtrl();

        $rootScope.$digest();
        $httpBackend.flush();

        expect(scope.previewResult.length).toBe(310);

    });

    it('should push push preview response to scope with more required lines', function() {

        $httpBackend.whenGET('/dmp/resources/1/lines?atMost=50&encoding=UTF-8').respond($jsonResponse10);
        $httpBackend.whenGET('/dmp/resources/1/lines?atMost=20&encoding=UTF-8').respond($jsonResponse20);

        scope.resourceId = 1;

        dataConfigPreviewXmlCtrl();

        $rootScope.$digest();
        $httpBackend.flush();

        expect(scope.previewResult.length).toBe(310);

        scope.previewOptions = {
            at_most_rows : 20
        };

        $rootScope.$digest();
        $httpBackend.flush();

        expect(scope.previewResult.length).toBe(870);

    });

});
