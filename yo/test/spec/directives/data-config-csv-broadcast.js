'use strict';

describe('Controller: DataConfigCsvCtrl', function () {
    var $httpBackend, $rootScope, scope, dataConfigCsvCtrl;

    var win = {
        _: {
            debounce: function(fn, timout) {
                return function() {
                    fn();
                }
            }
        },
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

        dataConfigCsvCtrl = function () {

            return $controller('DataConfigCsvCtrl', {
                '$scope': scope
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
