'use strict';

describe('Directive TargetData', function () {
    var element, scope, $rootScope, $compile, gdmParserSpy;
    var elementHtml = '<target-data></target-data>';

    beforeEach(module('dmpApp'));

    beforeEach(module(function($provide) {
        gdmParserSpy = jasmine.createSpyObj('gdmParser', ['parse']);
        gdmParserSpy['parse'].andReturn('parsed');
        $provide.value('gdmParser', gdmParserSpy);
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');

        $injector.get('$templateCache').put('views/directives/target-data.html', '<div></div>');

        scope = $rootScope.$new();
        scope.project = {
            _$output_data_model_schema: 'schema'
        };

        var _element = angular.element(elementHtml);
        element = $compile(_element)(scope);
    }));


    it('should have a TargetDataCtrl controller', function() {
        scope.$digest();
        var elScope = element.scope();

        expect(elScope.internalName).toBe('Target Data Widget');
    });

    it('should react to the \'transformationFinished\' event for a single transformation', function() {
        scope.$digest();
        var elScope = element.scope();

        $rootScope.$broadcast('transformationFinished', 'transformation');

        expect(gdmParserSpy.parse).toHaveBeenCalledWith('transformation', 'schema', true);
        expect(elScope.records).toBeUndefined();
        expect(elScope.data).toBe('parsed');
    });

    it('should react to the \'transformationFinished\' event for multiple transformations', function() {
        scope.$digest();
        var elScope = element.scope();

        $rootScope.$broadcast('transformationFinished', [{
            record_id: 1,
            record_data: 'transformation1'
        }, {
            record_id: 2,
            record_data: 'transformation2'
        }]);

        expect(gdmParserSpy.parse).toHaveBeenCalledWith('transformation1', 'schema', true);
        expect(gdmParserSpy.parse).toHaveBeenCalledWith('transformation2', 'schema', true);
        expect(elScope.data).toBeUndefined();
        expect(elScope.records).toEqual([{
            id: 1,
            data: 'parsed'
        }, {
            id: 2,
            data: 'parsed'
        }]);
    });

    it('should react to the \'transformationFinished\' event for multiple transformations, keeping at most 3', function() {
        scope.$digest();
        var elScope = element.scope();

        $rootScope.$broadcast('transformationFinished', [{
            record_id: 1,
            record_data: 'transformation1'
        }, {
            record_id: 2,
            record_data: 'transformation2'
        }, {
            record_id: 3,
            record_data: 'transformation3'
        }, {
            record_id: 4,
            record_data: 'transformation4'
        }, {
            record_id: 5,
            record_data: 'transformation5'
        }, {
            record_id: 6,
            record_data: 'transformation6'
        }]);

        expect(gdmParserSpy.parse).toHaveBeenCalledWith('transformation1', 'schema', true);
        expect(gdmParserSpy.parse).toHaveBeenCalledWith('transformation2', 'schema', true);
        expect(gdmParserSpy.parse).toHaveBeenCalledWith('transformation3', 'schema', true);

        expect(gdmParserSpy.parse.calls.length).toBe(3);

        expect(elScope.data).toBeUndefined();
        expect(elScope.records).toEqual([{
            id: 1,
            data: 'parsed'
        }, {
            id: 2,
            data: 'parsed'
        }, {
            id: 3,
            data: 'parsed'
        }]);
    });
});
