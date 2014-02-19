'use strict';

describe('Directive: SchemaList', function () {
    var $rootScope, $compile, $httpBackend;
    var element1, element2, scope1, scope2, files1, files2, files3;
    var elementHtml1 = '<schemalist from="resources" items="items"></div>';
    var elementHtml2 = '<schemalist from="otherThing" items="items"></div>';

    beforeEach(module('dmpApp'));

    beforeEach(module(function($provide) {
        $provide.value('ApiEndpoint', 'dmp/');
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, $templateCache) {

        $templateCache.put('views/directives/schema-list.html', '<div></div>');

        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;

        files1 = {
            id: 1,
            configurations: [{
                id: 1,
                parameters: {
                    storage_type: 'schema'
                }
            }]
        };

        files2 = {
            id: 1,
            attribute_paths: [1, 2, 3],
            record_class: {
                name: 'foo'
            }
        };
        files3 = {
            id: 2,
            attribute_paths: [1, 2, 3]
        };

        $httpBackend.whenGET('dmp/resources').respond([files1, {
            id: 2,
            configurations: [{
                id: 1,
                parameters: {
                    storage_type: 'foo'
                }
            }]
        }, {
            id: 3,
            configurations: [{
                id: 1,
                parameters: {}
            }]
        }, {
            id: 4
        }]);

        $httpBackend.whenGET('dmp/schemas').respond([files2, files3, {
            id: 3,
            attribute_paths: [],
            record_class: {
                name: 'bar'
            }
        }, {
            id: 4,
            attribute_paths: {},
            record_class: {
                name: 'baz'
            }
        }, {
            id: 5,
            record_class: {
                name: 'qux'
            }
        }]);

        scope1 = $rootScope.$new();
        scope1.items = [];

        scope2 = $rootScope.$new();
        scope2.items = [];

        var _element;

        _element = angular.element(elementHtml1);
        element1 = $compile(_element)(scope1);

        _element = angular.element(elementHtml2);
        element2 = $compile(_element)(scope2);
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });

    it('create the SchemaListCtrl from resources', function() {
        $httpBackend.expectGET('dmp/resources');

        scope1.$digest();
        $httpBackend.flush();
        var elScope = angular.element(element1.children()[0]).scope();

        expect(elScope.files.length).toBe(1);
        expect(angular.equals(elScope.files, [files1])).toBe(true);

        expect(elScope.schemaListOptions).toEqual({
            data: 'files',
            columnDefs: [
                {field:'name', displayName:'Name'},
                {field:'_$description', displayName:'Description '}
            ],
            enableColumnResize: false,
            selectedItems: [],
            multiSelect: false
        });
    });


    it('create the SchemaListCtrl from schemas', function() {
        $httpBackend.expectGET('dmp/schemas');

        scope2.$digest();
        $httpBackend.flush();
        var elScope = angular.element(element2.children()[0]).scope();

        expect(elScope.files.length).toBe(2);
        expect(angular.equals(elScope.files, [angular.extend({}, files2, {
            _$description : '3 attribute paths, record class: foo'
        }), angular.extend({}, files3, {
            _$description : '3 attribute paths, record class: undefined'
        })])).toBe(true);

        expect(elScope.schemaListOptions).toEqual({
            data: 'files',
            columnDefs: [
                {field:'name', displayName:'Name'},
                {field:'_$description', displayName:'Description '}
            ],
            enableColumnResize: false,
            selectedItems: [],
            multiSelect: false
        });
    });
});
