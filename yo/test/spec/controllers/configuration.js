'use strict';

beforeEach(module('dmpApp'));

describe('Controller: ConfigurationCtrl', function () {

    var configurationCtrl,
        scope,
        mockedConfiguration,
        mockedConfigurationInternal;

    beforeEach(module('dmpApp', 'mockedConfiguration'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();

        mockedConfiguration = $injector.get('mockConfigurationComponentJSON');
        mockedConfigurationInternal = $injector.get('mockConfigurationComponentInternalJSON');

        scope.component = {
            "name" : 'equals',
            "reference" : 'equals',
            "parameters" : {
                "string" :{
                    "type" : 'text'
                }
            }
        };

        scope.$digest();

        configurationCtrl = function () {
            return $controller('ConfigurationCtrl', {
                $scope: scope
            });
        };

    }));

    it('should have a ConfigurationCtrl controller', function() {
        var ConfigurationCtrl = configurationCtrl();
        expect(ConfigurationCtrl).not.toBe(null);
    });

    it('should return a regexp pattern', function() {
        configurationCtrl();

        var pattern = scope.getPattern('foo');

        expect(pattern.toString()).toBe('/^foo$/');
    });

    it('should return correct form classes', function() {
        configurationCtrl();

        var classes = scope.formClasses({
            $invalid : true,
            $valid : false
        }, false);

        expect(classes['has-error']).toBe(true);
        expect(classes['has-success']).toBe(false);

        classes = scope.formClasses({
            $invalid : false,
            $valid : true
        }, false);

        expect(classes['has-error']).toBe(false);
        expect(classes['has-success']).toBe(true);

        classes = scope.formClasses({
            $invalid : true,
            $valid : false
        }, true);

        expect(classes['has-error']).toBe(true);
        expect(classes['has-success']).toBe(false);

        classes = scope.formClasses({
            $invalid : false,
            $valid : true
        }, true);

        expect(classes['has-error']).toBe(false);
        expect(classes['has-success']).toBe(false);

    });

    it('should reset component onCancelClick', function() {
        configurationCtrl();

        scope.$broadcast('handleEditConfig', {
            component : mockedConfiguration
        });

        expect(scope.component).not.toBe(null);

        scope.onCancelClick();

        expect(scope.component).toBe(null);
    });

    it('should handle handleEditConfig event', function() {
        configurationCtrl();

        scope.$broadcast('handleEditConfig', {
            component : mockedConfiguration
        });

        expect(scope.component.description).toBe(mockedConfigurationInternal.description);
        expect(scope.component.parameters.length).toBe(1);

    });

    it('should send data onSaveClick', inject(function(PubSub) {
        configurationCtrl();

        scope.$broadcast('handleEditConfig', {
            component : mockedConfiguration
        });

        expect(scope.component).not.toBe(null);

        spyOn(PubSub, 'broadcast');

        angular.forEach(scope.component.parameters, function(paramDef) {
            var param = paramDef.key;

            if(param === 'value') {
                paramDef.data = 'bar';
            }
        });

        scope.component.parameters['value'] = 'bar';

        scope.onSaveClick();

        expect(PubSub.broadcast).toHaveBeenCalledWith('handleConfigEdited', { id : -1402495665792, parameter_mappings : { value : 'bar' } });
    }));


});
