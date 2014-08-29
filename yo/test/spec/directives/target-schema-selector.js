'use strict';

describe('Controller: TargetSchemaSelectorCtrl', function () {
    var $httpBackend, $rootScope, $modal, modalInstance, scope, targetSchemaSelectorCtrl;

    var win = {
        dmp: {
            jsRoutes: {
                api: ''
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

});
