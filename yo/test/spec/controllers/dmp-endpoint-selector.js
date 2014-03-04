'use strict';

describe('Controller: DmpEndpointSelector', function () {
    var $rootScope, $controller, scope, dmpEndpointSelector, endpointSet, modalInstance;

    beforeEach(module('dmpApp'));

    beforeEach(inject(function(_$controller_, _$rootScope_) {

        $rootScope = _$rootScope_;
        $controller = _$controller_;

        scope = $rootScope.$new();

        endpointSet = [{
            id : 'foo',
            targetName : 'bar',
            targetData : 'baz'
        }];
        modalInstance = jasmine.createSpyObj('$modalInstance', ['close', 'dismiss']);

        dmpEndpointSelector = function () {

            return $controller('DmpEndpointSelectorCtrl', {
                $scope: scope,
                $modalInstance : modalInstance,
                endpointSet: endpointSet
            });
        };
    }));

    it('should create the DataEndpointSelectorCtrl', function() {
        dmpEndpointSelector();

        expect(angular.equals(scope.endpointSet, endpointSet)).toBe(true);
        expect(scope.selectedSet).toEqual([]);
        expect(scope.schemaListOptions).toEqual({
            data: 'endpointSet',
            columnDefs: [{
                field : 'sourceName',
                displayName : 'Source'
            }, {
                field : 'targetName',
                displayName : 'Target'
            }, {
                field : 'label',
                displayName : 'Name'
            }],
            enableColumnResize: false,
            selectedItems: [],
            multiSelect: false
        });
    });
});
