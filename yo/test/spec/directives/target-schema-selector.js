'use strict';

describe('Controller: TargetSchemaSelectorCtrl', function () {
    var $httpBackend,
        $rootScope, scope,
        $modal, modalInstance, fakeModal,
        targetSchemaSelectorCtrl,
        mockedProject;

    var win = {
        dmp: {
            jsRoutes: {
                api: ''
            }
        }
    };

    beforeEach(module('dmpApp', 'mockedDataConfig', 'mockedProject'));

    beforeEach(module(function($provide) {
        $provide.value('$window', win);
    }));

    beforeEach(function() {
        spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
        spyOn(XMLHttpRequest.prototype, 'send');
    });

    beforeEach(inject(function ($injector, $q) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        mockedProject = $injector.get('mockProjectJSON2');

        scope = $rootScope.$new();

        var templateUrl = 'foo';

        $modal = $injector.get('$modal');
        modalInstance = $modal.open({
            templateUrl: templateUrl
        });

        $httpBackend.whenGET(templateUrl).respond('');

        var $controller = $injector.get('$controller');

        targetSchemaSelectorCtrl = function () {

            return $controller('TargetSchemaSelectorCtrl', {
                '$scope': scope,
                '$modalInstance' : modalInstance,
                'project' : {}
            });
        };

        fakeModal = (function() {
            var defer = $q.defer();

            return {
                result: defer.promise,
                close: defer.resolve,
                dismiss: defer.reject
            };
        }());

    }));

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should have a TargetSchemaSelectorCtrl controller', function() {
        var TargetSchemaSelectorCtrl = targetSchemaSelectorCtrl();
        $httpBackend.flush();
        expect(TargetSchemaSelectorCtrl).not.toBe(null);
    });

    it('should close the modal with onSelectClick when no project data is available', function() {

        spyOn(modalInstance, 'close').and.callThrough();

        var TargetSchemaSelectorCtrl = targetSchemaSelectorCtrl();
        $httpBackend.flush();
        expect(TargetSchemaSelectorCtrl).not.toBe(null);

        scope.onSelectClick();
        expect(modalInstance.close).toHaveBeenCalledWith(undefined);

    });

    it('should dismiss the modal with close', function() {

        spyOn(modalInstance, 'dismiss').and.callThrough();

        var TargetSchemaSelectorCtrl = targetSchemaSelectorCtrl();
        $httpBackend.flush();
        expect(TargetSchemaSelectorCtrl).not.toBe(null);

        scope.close();
        expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');

    });

});
