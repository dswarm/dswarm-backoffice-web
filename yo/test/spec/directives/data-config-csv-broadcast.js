'use strict';

describe('Controller: DataConfigCsvCtrl', function () {
    var $httpBackend, $rootScope, scope, dataConfigCsvCtrl;

    beforeEach(module('dmpApp', 'mockedDataConfig'));

    beforeEach(function() {
        spyOn(XMLHttpRequest.prototype, 'open').andCallThrough();
        spyOn(XMLHttpRequest.prototype, 'send');
    });

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        var $resource = $injector.get('$resource')
            , fileResource = $resource('/dmp/resources/:id');

        scope = $rootScope.$new();

        spyOn($rootScope, '$broadcast');

        var win = {
            dmp: {
                jsRoutes: {
                    api: '/dmp/'
                }
            }
        };

        var $controller = $injector.get('$controller');

        dataConfigCsvCtrl = function () {

            return $controller('DataConfigCsvCtrl', {
                '$scope': scope,
                '$window' : win,
                'FileResource': fileResource
            });
        };
    }));

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should emit event on form object change', function () {

        dataConfigCsvCtrl();

        scope.config.name = 'configname';

        scope.onFieldChanged();

        expect($rootScope.$broadcast).toHaveBeenCalledWith("dataConfigUpdated",{ config : scope.config });
    });

});