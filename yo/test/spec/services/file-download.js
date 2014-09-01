'use strict';

describe('file download service tests', function () {

    beforeEach(module('dmpApp'));

    var $rootScope, $location;

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
    }));

    it('should have a fileDownload service', inject(function (fileDownload) {
        expect(fileDownload).not.toBe(null);
    }));


    describe('for desktop', function () {

        var iFrameUrlChanged,
            _fileDownload,
            _Neo4jEndpoint,
            waitForIframeUrlChangeWithCallback = function(callback) {

                var fileUrl = _Neo4jEndpoint + 'rdf/getall?format=' + encodeURIComponent('application/n-quads');

                _fileDownload(fileUrl);

                setTimeout(function() {

                    if(window['fileDownloadFrame'].location.href.indexOf(_Neo4jEndpoint + 'rdf/getall?format=application%2Fn-quads') > -1) {
                        iFrameUrlChanged = true;
                    } else {
                        iFrameUrlChanged = false;
                    }
                    callback();
                }, 10);

            };

        beforeEach(inject(function ($window, fileDownload, Neo4jEndpoint) {

            _Neo4jEndpoint = Neo4jEndpoint;
            _fileDownload = fileDownload;

            $window.navigator.__defineGetter__('userAgent', function(){
                return( 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:32.0) Gecko/20100101 Firefox/32.0' );
            });

        }));

        beforeEach(function(done) {

            waitForIframeUrlChangeWithCallback(done);

        });

        it('should create iframe to download', inject(function () {

            expect(iFrameUrlChanged).toBeTruthy();

        }));

    });

    describe('for android', function () {

        beforeEach(inject(function ($window) {

            $window.navigator.__defineGetter__('userAgent', function(){
                return( 'android' );
            });

        }));

        it('should open download window', inject(function (fileDownload, Neo4jEndpoint, $window) {

            spyOn($window, 'open').and.callThrough();

            var fileUrl = Neo4jEndpoint + 'rdf/getall?format=' + encodeURIComponent('application/n-quads');

            fileDownload(fileUrl);

            expect($window.open).toHaveBeenCalledWith( Neo4jEndpoint + 'rdf/getall?format=application%2Fn-quads');

        }));

    });

    describe('for ios', function () {

        beforeEach(inject(function ($window) {

            $window.navigator.__defineGetter__('userAgent', function(){
                return( 'iphone' );
            });

        }));

        it('should open download window', inject(function (fileDownload, Neo4jEndpoint, $window) {

            spyOn($window, 'open').and.callThrough();

            var fileUrl = Neo4jEndpoint + 'rdf/getall?format=' + encodeURIComponent('application/n-quads');

            fileDownload(fileUrl);

            expect($window.open).toHaveBeenCalledWith( Neo4jEndpoint + 'rdf/getall?format=application%2Fn-quads');

        }));

    });

    describe('for other mobile', function () {

        beforeEach(inject(function ($window) {

            $window.navigator.__defineGetter__('userAgent', function(){
                return( 'blackberry' );
            });

        }));

        it('should redirect to download', inject(function (fileDownload, Neo4jEndpoint) {

            spyOn($location, 'path');

            var fileUrl = Neo4jEndpoint + 'rdf/getall?format=' + encodeURIComponent('application/n-quads');

            fileDownload(fileUrl);

            expect($location.path).toHaveBeenCalledWith( Neo4jEndpoint + 'rdf/getall?format=application%2Fn-quads');

        }));

    });





});