'use strict';
/* jshint ignore:start */
describe('Directive: MappingComponentConfig', function () {
    var $rootScope, $compile, $httpBackend;
    var element, scope;
    var elementHtml = '<mapping-component-config></mapping-component-config>';

    beforeEach(module('dmpApp'));

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        $compile = $injector.get('$compile');

        $httpBackend.whenGET('views/directives/mapping-component-config.html').respond('<div></div>');

        scope = $rootScope.$new();

        var _element = angular.element(elementHtml);
        element = $compile(_element)(scope);
    }));

    it('should create an MappingComponentConfigCtrl', function() {
        $httpBackend.expectGET('views/directives/mapping-component-config.html');
        scope.$digest();
        $httpBackend.flush();

        var elScope = element.scope();

        expect(elScope.internalName).toBe('Mapping Component Config Widget');
        expect(elScope.mappingComponentConfigShouldBeOpen).toBe(false);
        expect(elScope.incomingPool).toEqual({});
        expect(elScope.outgoingPool).toEqual({});
        expect(elScope.opts).toEqual({
            backdropFade: true,
            dialogFade: true,
            triggerClass: 'really in'
        });
    });

    it('should close a dialog', function() {
        $httpBackend.expectGET('views/directives/mapping-component-config.html');
        scope.$digest();
        $httpBackend.flush();

        var elScope = element.scope();

        elScope.onSelectClick();
        expect(elScope.targetSchemaSelectorShouldBeOpen).toBe(false);

        elScope.mappingComponentConfigShouldBeOpen = true;
        elScope.close();
        expect(elScope.mappingComponentConfigShouldBeOpen).toBe(false);
    });

    it('should react to adding mapping components', function() {
        $httpBackend.expectGET('views/directives/mapping-component-config.html');
        scope.$digest();
        $httpBackend.flush();

        var elScope = element.scope();

        $rootScope.$broadcast('handleOpenMappingComponentConfig', [
            [
                {
                    sourceData: {
                        $$hashKey: '1',
                        name: 'foo'
                    }
                },
                {
                    sourceData: {
                        $$hashKey: '2',
                        name: 'bar'
                    }
                },
                {
                    sourceData: {
                        $$hashKey: '1',
                        name: 'baz'
                    }
                }
            ],
            'foo'
        ]);

        expect(elScope.incomingPool).toEqual({
            '1': [{
                $$hashKey: '1',
                name: 'foo'
            }, {
                $$hashKey: '1',
                name: 'baz'
            }],
            '2': [{
                $$hashKey: '2',
                name: 'bar'
            }]
        });
        expect(elScope.outgoingPool).toBe('foo');
    });
});
