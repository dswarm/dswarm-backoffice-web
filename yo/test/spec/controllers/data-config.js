'use strict';

describe('Controller: DataConfig', function () {
    var $rootScope, scope, dataConfigCtrl;

    beforeEach(module('dmpApp'));

    beforeEach(function() {
        spyOn(XMLHttpRequest.prototype, 'open').andCallThrough();
        spyOn(XMLHttpRequest.prototype, 'send');
    });

    beforeEach(inject(function ($injector) {
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

        dataConfigCtrl = function () {

            return $controller('DataConfigCtrl', {
                '$scope': scope,
                '$window' : win,
                'FileResource': fileResource
            });
        };
    }));

    it('should emit event on form object change', function () {

        var ctrl = dataConfigCtrl();

        scope.config.name = 'configname';

        scope.onFieldChanged();

        expect($rootScope.$broadcast).toHaveBeenCalledWith("dataConfigUpdated",{ config : scope.config });
    });

});