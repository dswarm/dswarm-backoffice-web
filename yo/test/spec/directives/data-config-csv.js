'use strict';

describe('Controller: DataConfigCsvCtrl', function () {
    var $rootScope, $compile, $httpBackend, $location, $controller, PubSub;
    var dataConfigCtrl;
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
        $controller = $injector.get('$controller');
        PubSub = $injector.get('PubSub');

        dataConfigCtrl = function () {

            return $controller('DataConfigCtrl', {
                '$scope': scope,
                '$routeParams': {
                    resourceId: 42
                }
            });
        };

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

        dataConfigCtrl();

        scope.$digest();
        $httpBackend.flush();

        expect(scope.resourceId).toBe(1);
        expect(scope.presets).toEqual({
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

        expect(scope.config).toEqual({
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

        dataConfigCtrl();

        scope.$digest();
        $httpBackend.flush();

        expect(scope.resourceId).toBe(1);
    });

    it('should request the specified data Resource', function() {
        $httpBackend.expectGET('/dmp/resources/42');

        dataConfigCtrl();

        scope.$digest();
        $httpBackend.flush();

        expect(scope.resourceId).toBe(42);
        expect(scope.config).toEqual({
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
        expect(scope.atMostRowsActivate).toBe(true);
        expect(scope.discardRowsActivate).toBe(true);
        expect(scope.ignoreLinesActivate).toBeUndefined();
    });

    it('should update the row separator if the fileformat changes', function() {
        $httpBackend.expectGET('/dmp/resources/42');

        dataConfigCtrl();

        scope.$digest();
        $httpBackend.flush();

        expect(PubSub.broadcast).toHaveBeenCalled();

        scope.config.parameters.fileFormat = {
            rowSeperator: '\t'
        };
        scope.onFileFormatChanged();

        expect(scope.config.parameters.rowSeperator).toBe('\t');

        delete scope.config.parameters.fileFormat;
        scope.onFileFormatChanged();

        expect(scope.config.parameters.rowSeperator).toBe('\t');
    });

    it('should broadcast field changes', function() {
        $httpBackend.expectGET('/dmp/resources/42');

        dataConfigCtrl();

        scope.$digest();
        $httpBackend.flush();

        expect(PubSub.broadcast).toHaveBeenCalled();

        scope.onFieldChanged(false, true);

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

        dataConfigCtrl();

        scope.$digest();
        $httpBackend.flush();

        expect(PubSub.broadcast).toHaveBeenCalled();

        scope.atMostRowsActivate = false;
        scope.config.parameters.ignore_lines = 9;

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

        dataConfigCtrl();

        scope.$digest();
        $httpBackend.flush();

        scope.onCancelClick();

        expect($location.path()).toBe('/data/');
    });

    it('should change location after save', function() {
        $httpBackend.expectGET('/dmp/resources/42');

        dataConfigCtrl();

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

        scope.onSaveClick();

        $httpBackend.flush();

        expect($location.path()).toBe('/data/');
    });


});
