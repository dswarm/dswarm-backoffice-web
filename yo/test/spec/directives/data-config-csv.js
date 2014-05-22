'use strict';

describe('Controller: DataConfigCsvCtrl', function () {
    var $rootScope, $compile, $httpBackend, $location, PubSub;
    var $jsonResponse, $jsonResponseGet;
    var element, scope;
    var elementHtml = '<dataconfigcsv></dataconfigcsv>';

    var routeParams = {
        resourceId: 42
    };

//    function dumpSpy(spy, name) {
//        console.log(name + ' calls length', spy.calls.length);
//        spy.calls.forEach(function(call, i) {
//            console.log(name + ' call ' + i + ' args length', call.args.length);
//            call.args.forEach(function(arg, ii) {
//                console.log(name + ' call ' + i + ' arg ' + ii, JSON.stringify(arg, null, 2));
//            });
//        });
//    }

    beforeEach(module('dmpApp', 'mockedDataConfig'));

    beforeEach(module(function($provide) {
        $provide.value('$routeParams', routeParams);
        $provide.value('ApiEndpoint', '/dmp/');

        _.debounce = function(fn) {
            var args, thisArg;

            return function() {
                args = arguments;
                thisArg = this;

                fn.apply(thisArg, arguments);
            };
        };

        $provide.value('loDash', _);
    }));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $compile = $injector.get('$compile');
        PubSub = $injector.get('PubSub');

        $injector.get('$templateCache').put('views/directives/data-config-csv.html', '<div></div>');

        $jsonResponse = $injector.get('mockDataConfigSaveJSON');
        $jsonResponseGet = $injector.get('mockDataResourceGetJson');

        $httpBackend.whenGET('/dmp/resources/42').respond($jsonResponseGet);
        $httpBackend.whenGET('/dmp/resources/1').respond({});
        $httpBackend.whenPOST('/dmp/datamodels').respond($jsonResponse);

        routeParams.resourceId = 42;
        scope = $rootScope.$new();

        var _element = angular.element(elementHtml);
        element = $compile(_element)(scope);
    }));

    beforeEach(function() {
        spyOn(PubSub, 'broadcast');
        spyOn($rootScope, '$broadcast').andCallThrough();
    });

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should have a DataConfigCsvCtrl controller', function() {
        routeParams.resourceId = 1;
        $httpBackend.expectGET('/dmp/resources/1');

        scope.$digest();
        $httpBackend.flush();

        var elScope = scope.$$childHead;
        expect(elScope.resourceId).toBe(1);
        expect(elScope.presets).toEqual({
            fileFormat : [
                { name : 'Windows', 'row_delimiter' : '\\r\\n' },
                { name : 'Linux' , 'row_delimiter' : '\\n' }
            ],
            encoding : [
                { name : 'ISO-8859-1' },
                { name : 'ISO-8859-15' },
                { name : 'US-ASCII' },
                { name : 'UTF-8' },
                { name : 'UTF-16' },
                { name : 'UTF-16LE' },
                { name : 'UTF-16BE' },
                { name : 'Unicode' },
                { name : 'Windows-1252' }
            ],

            parameters : {
                'column_delimiter' : ',',
                'escape_character' : '\\',
                'quote_character' : '"',
                first_row_is_headings : true,
                'column_names' : 'columnN',
                'storage_type' : 'csv'
            }
        });

        expect(elScope.config).toEqual({
            parameters : {
                'column_delimiter' : ',',
                'escape_character' : '\\',
                'quote_character' : '"',
                first_row_is_headings : true,
                'column_names' : 'columnN',
                'storage_type' : 'csv'
            }
        });
    });

    it('should default to id 1 if invalid id given', function() {
        routeParams.resourceId = -1;
        $httpBackend.expectGET('/dmp/resources/1');

        scope.$digest();
        $httpBackend.flush();

        var elScope = scope.$$childHead;
        expect(elScope.resourceId).toBe(1);
    });

    it('should request the specified data Resource', function() {
        $httpBackend.expectGET('/dmp/resources/42');

        scope.$digest();
        $httpBackend.flush();

        var elScope = scope.$$childHead;
        expect(elScope.resourceId).toBe(42);
        expect(elScope.config).toEqual({
            parameters: {
                ignore_lines: 0,
                discard_rows: 2,
                at_most_rows: 5,
                column_delimiter: '^',
                escape_character : '\\\\',
                quote_character : '\\"',
                column_names : 'columnN',
                storage_type: 'csv'
            }
        });
        expect(elScope.atMostRowsActivate).toBe(true);
        expect(elScope.discardRowsActivate).toBe(true);
        expect(elScope.ignoreLinesActivate).toBeUndefined();
    });

    it('should update the row separator if the fileformat changes', function() {
        $httpBackend.expectGET('/dmp/resources/42');

        scope.$digest();
        $httpBackend.flush();

        expect(PubSub.broadcast).toHaveBeenCalled();

        var elScope = scope.$$childHead;

        elScope.config.parameters.fileFormat = {
            rowSeperator: '\t'
        };
        elScope.onFileFormatChanged();

        expect(elScope.config.parameters.rowSeperator).toBe('\t');

        delete elScope.config.parameters.fileFormat;
        elScope.onFileFormatChanged();

        expect(elScope.config.parameters.rowSeperator).toBe('\t');
    });

    it('should broadcast field changes', function() {
        $httpBackend.expectGET('/dmp/resources/42');

        scope.$digest();
        $httpBackend.flush();

        expect(PubSub.broadcast).toHaveBeenCalled();

        scope.$$childHead.onFieldChanged(false, true);

        expect(PubSub.broadcast).toHaveBeenCalledWith('dataConfigUpdated', {
            config: {
                parameters: {
                    ignore_lines: 0,
                    discard_rows: 2,
                    at_most_rows: 5,
                    column_delimiter: "^",
                    escape_character: "\\\\",
                    quote_character: "\\\"",
                    column_names: "columnN",
                    storage_type: "csv"
                }
            },
            resourceId: 42
        });
    });

    it('should broadcast field changes', function() {
        $httpBackend.expectGET('/dmp/resources/42');

        scope.$digest();
        $httpBackend.flush();

        var elScope = scope.$$childHead;

        expect(PubSub.broadcast).toHaveBeenCalled();

        elScope.atMostRowsActivate = false;
        elScope.config.parameters.ignore_lines = 9;

        scope.$digest();

        expect(PubSub.broadcast).toHaveBeenCalledWith('dataConfigUpdated', {
            config: {
                parameters: {
                    ignore_lines: 9,
                    discard_rows: 2,
                    column_delimiter: "^",
                    escape_character: "\\\\",
                    quote_character: "\\\"",
                    column_names: "columnN",
                    storage_type: "csv"
                }
            },
            resourceId: 42
        });
    });

    it('should change location on cancel', function() {
        $httpBackend.expectGET('/dmp/resources/42');

        scope.$digest();
        $httpBackend.flush();

        scope.$$childHead.onCancelClick();

        expect($location.path()).toBe('/data/');
    });

    it('should change location after save', function() {
        $httpBackend.expectGET('/dmp/resources/42');

        scope.$digest();
        $httpBackend.flush();

        var config = $jsonResponseGet.configurations[0];

        $httpBackend.expectPOST('/dmp/datamodels', {
            data_resource: $jsonResponseGet,
            name: $jsonResponseGet.name,
            description: $jsonResponseGet.description,
            configuration: {
                parameters: config.parameters
            }
        });

        scope.$$childHead.onSaveClick();

        $httpBackend.flush();

        expect($location.path()).toBe('/data/');
    });


});
