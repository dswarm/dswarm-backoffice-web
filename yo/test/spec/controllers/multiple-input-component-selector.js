'use strict';

describe('Controller: MultipleInputComponentSelector', function () {
    var $rootScope, $controller, scope, multipleInputComponentSelector, componentSet, modalInstance;

    beforeEach(module('dmpApp'));

    beforeEach(inject(function(_$controller_, _$rootScope_) {

        $rootScope = _$rootScope_;
        $controller = _$controller_;

        scope = $rootScope.$new();

        componentSet = [{
            id : 'foo',
            targetName : 'bar',
            targetData : 'baz'
        }];
        modalInstance = jasmine.createSpyObj('$modalInstance', ['close', 'dismiss']);

        multipleInputComponentSelector = function () {

            return $controller('MultipleInputComponentSelectorCtrl', {
                $scope: scope,
                $modalInstance : modalInstance,
                componentSet: componentSet
            });
        };
    }));

    it('should create the MultipleInputComponentSelectorCtrl', function() {
        multipleInputComponentSelector();

        expect(angular.equals(scope.componentSet, componentSet)).toBe(true);
        expect(scope.selectedSet).toEqual([]);
        expect(scope.endpointListOptions).toEqual({
            data: 'componentSet',
            columnDefs: [
                {field: 'display', displayName: 'Name'}
            ],
            enableColumnResize: false,
            selectedItems: [],
            multiSelect: false
        });
    });
});
