'use strict';

describe('Controller: DataConfigCsvCtrl', function () {
    var $httpBackend, $rootScope, scope, targetSchemaSelectorCtrl;

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

        var $resource = $injector.get('$resource');

        scope = $rootScope.$new();

        spyOn($rootScope, '$broadcast');

        var $controller = $injector.get('$controller');

        targetSchemaSelectorCtrl = function () {

            return $controller('TargetSchemaSelectorCtrl', {
                '$scope': scope
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

    it('should emit event on schema select', function () {

        targetSchemaSelectorCtrl();

        scope.selectedSet.push('schemaname');

        scope.onSelectClick();

        expect($rootScope.$broadcast).toHaveBeenCalledWith("handleTargetSchemaSelected", 'schemaname' );
    });

});
