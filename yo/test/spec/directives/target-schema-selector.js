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
        spyOn(XMLHttpRequest.prototype, 'open').andCallThrough();
        spyOn(XMLHttpRequest.prototype, 'send');
    });

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        $modal = $injector.get('$modal');

        var $resource = $injector.get('$resource');

        scope = $rootScope.$new();

        modalInstance = $modal.open({
            templateUrl: 'views/directives/filter.html',
            controller: 'FilterCtrl'
        });

        spyOn($rootScope, '$broadcast');

        var $controller = $injector.get('$controller');

        targetSchemaSelectorCtrl = function () {

            return $controller('TargetSchemaSelectorCtrl', {
                '$scope': scope,
                '$modalInstance' : modalInstance
            });
        };

    }));

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should have a TargetSchemaSelectorCtrl controller', function() {
        var TargetSchemaSelectorCtrl = targetSchemaSelectorCtrl();
        expect(TargetSchemaSelectorCtrl).not.toBe(null);
    });

});
