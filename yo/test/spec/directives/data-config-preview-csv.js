'use strict';

describe('Controller: DataConfigPreviewCsvCtrl', function () {
    var $httpBackend, $rootScope, scope, dataConfigPreviewCsvCtrl, $timeout, $jsonResponse;

    var win = {
        _: {
            debounce: function(fn) {
                var args, thisArg;

                return function() {
                    args = arguments;
                    thisArg = this;

                    fn.apply(thisArg, arguments);
                };
            }
        }
    };

    beforeEach(module('dmpApp', 'mockedDataConfigPreviewCsv'));

    beforeEach(module(function($provide) {
        $provide.value('$window', win);
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $timeout = $injector.get('$timeout');

        $jsonResponse = $injector.get('mockDataConfigPreviewCsvJSON');

        scope = $rootScope.$new();

        $httpBackend.whenPOST('/dmp/resources/1/configurationpreview').respond($jsonResponse);

        var $controller = $injector.get('$controller');
        dataConfigPreviewCsvCtrl = function () {
            return $controller('DataConfigPreviewCsvCtrl', {
                $scope: scope
            });
        };

    }));


    it('should have a DataConfigPreviewCsvCtrl controller', function() {
        var DataConfigPreviewCsvCtrl = dataConfigPreviewCsvCtrl();
        expect(DataConfigPreviewCsvCtrl).not.toBe(null);
    });

    it('should push preview response to scope', function() {

        dataConfigPreviewCsvCtrl();

        scope.dataConfigUpdated({"id":1, "resourceId":1, "name":"foo","description":"bar","parameters":{"encoding":"UTF-8", "escape_character" : "\\", "quote_character" : "\"", "column_delimiter" : ",", "row_delimiter" : "\n"}}, 1);

        $rootScope.$digest();
        $httpBackend.flush();

        expect(scope.previewResult.length).toBe(5);

    });

    it('should run a preview update if next preview update is set', function() {

        dataConfigPreviewCsvCtrl();

        scope.nextUpdate = [{"id":1, "resourceId":1, "name":"foo","description":"bar","parameters":{"encoding":"UTF-8", "escape_character" : "\\", "quote_character" : "\"", "column_delimiter" : ",", "row_delimiter" : "\n"}}, 1];

        scope.checkNextConfigUpdate();

        $rootScope.$digest();

        $timeout.flush();
        $httpBackend.flush();

        expect(scope.previewResult.length).toBe(5);

    });

    it('should return grid id when flag is set', function() {

        var shouldInclude;

        dataConfigPreviewCsvCtrl();

        scope.showGrid = true;

        shouldInclude = scope.gridInclude();

        expect(shouldInclude).toBe('previewgrid');

    });

    it('should update scope data from result', function() {

        dataConfigPreviewCsvCtrl();

        scope.dataConfigUpdatedSave($jsonResponse);

        expect(scope.previewResult.length).toBe(5);
        expect(scope.colDefs.length).toBe(2);

    });

});
