'use strict';

describe('Controller: FilterCtrl', function () {
    var $httpBackend, $rootScope, $modal, modalInstance, scope, component, FilterCtrl;

    beforeEach(module('dmpApp', 'mockedSchema', 'mockedRecord', 'mockedComponent'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        $modal = $injector.get('$modal');
        scope = $rootScope.$new();

        component = $injector.get('mockComponentJSON');

        scope.activeMapping = {
            'payload' : component,
            '_$filters' : [{"filter":{"name":"OAI-PMH","show":true,"editableTitle":true,"children":[{"name":"GetRecord","show":true,"editableTitle":true,"children":[{"name":"record","show":true,"editableTitle":true,"children":[{"name":"header","show":true,"editableTitle":true,"children":[{"name":"identifier","show":true,"editableTitle":true,"$$hashKey":"0IH"},{"name":"datestamp","show":false,"editableTitle":true,"$$hashKey":"0II","title":"2010-07-28"},{"name":"setSpec","show":true,"editableTitle":true,"$$hashKey":"0IJ"}],"hasChildren":true,"$$hashKey":"0H1"},{"name":"metadata","show":true,"editableTitle":true,"children":[{"name":"oai_dc:dc","show":true,"editableTitle":true,"children":[{"name":"dc:title","show":true,"editableTitle":true,"$$hashKey":"0IT"},{"name":"dc:creator","show":true,"editableTitle":true,"$$hashKey":"0IU"},{"name":"dc:subject","show":true,"editableTitle":true,"$$hashKey":"0IV"},{"name":"dc:description","show":true,"editableTitle":true,"$$hashKey":"0IW"},{"name":"dc:publisher","show":true,"editableTitle":true,"$$hashKey":"0IX"},{"name":"dc:contributor","show":true,"editableTitle":true,"$$hashKey":"0IY"},{"name":"dc:date","show":true,"editableTitle":true,"$$hashKey":"0IZ"},{"name":"dc:type","show":true,"editableTitle":true,"$$hashKey":"0J0"},{"name":"dc:format","show":true,"editableTitle":true,"$$hashKey":"0J1"},{"name":"dc:identifier","show":true,"editableTitle":true,"$$hashKey":"0J2"},{"name":"dc:source","show":true,"editableTitle":true,"$$hashKey":"0J3"},{"name":"dc:language","show":true,"editableTitle":true,"$$hashKey":"0J4"},{"name":"dc:relation","show":true,"editableTitle":true,"$$hashKey":"0J5"},{"name":"dc:coverage","show":true,"editableTitle":true,"$$hashKey":"0J6"},{"name":"dc:rights","show":true,"editableTitle":true,"$$hashKey":"0J7"}],"hasChildren":true,"$$hashKey":"0IQ"}],"hasChildren":true,"$$hashKey":"0H2"},{"name":"about","show":true,"editableTitle":true,"$$hashKey":"0H3"}],"hasChildren":true,"$$hashKey":"0GY"}],"hasChildren":true,"$$hashKey":"0GH"},{"name":"request","show":true,"editableTitle":true,"children":[{"name":"@verb","show":true,"editableTitle":true,"$$hashKey":"0HA"},{"name":"@identifier","show":true,"editableTitle":true,"$$hashKey":"0HB"},{"name":"@metadataPrefix","show":true,"editableTitle":true,"$$hashKey":"0HC"},{"name":"@from","show":true,"editableTitle":true,"$$hashKey":"0HD"},{"name":"@until","show":true,"editableTitle":true,"$$hashKey":"0HE"},{"name":"@set","show":true,"editableTitle":true,"$$hashKey":"0HF"},{"name":"@resumptionToken","show":true,"editableTitle":true,"$$hashKey":"0HG"}],"hasChildren":true,"$$hashKey":"0GI"},{"name":"responseDate","show":true,"editableTitle":true,"$$hashKey":"0GJ"}],"hasChildren":true},"inputfilters":[{"title":"2010-07-28","name":"datestamp","path":"OAI-PMH.GetRecord.record.header.datestamp"}],"name":"2010-07-28"}]
        };


        modalInstance = {
            dismiss: function(){},
            close: function(){}
        };

        $httpBackend.whenGET('/data/schema.json').respond($injector.get('mockSchemaJSON'));
        $httpBackend.whenGET('/data/record.json').respond($injector.get('mockRecordJSON'));

        $httpBackend.whenGET('views/directives/filter.html').respond('<div>Modal Content</div>');

        var $controller = $injector.get('$controller');
        FilterCtrl = $controller('FilterCtrl', {
            '$scope': scope,
            '$modalInstance': modalInstance
        })

    }));

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should have a FilterCtrl controller', function() {
        expect(FilterCtrl).not.toBe(null);
    });

    it('should have filtered input data', function() {
        scope.update();
        expect(scope.dataSource['isFiltered']).toBe(true);

    });

    it('should have filter input data with no match', function() {
        scope.update();
        expect(scope.dataSource['filterNoMatch']).toBe(true);

    });



});
