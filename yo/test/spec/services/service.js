'use strict';

describe('Service: BuildInfo/Version', function () {

    beforeEach(module('dmpApp'));

    describe('Service: BuildInfo', function() {
        var $httpBackend;
        var buildInfo;

        beforeEach(inject(function (_buildInfo_, _$httpBackend_) {
            $httpBackend = _$httpBackend_;

            $httpBackend.whenGET('/data/version.json').respond({
                web: 'web',
                api: 'api'
            });

            buildInfo = _buildInfo_;
        }));

        it('provide a promise to eventually access the buildInfo', function () {
            expect(!!buildInfo.get).toBe(true);

            buildInfo.get(function(web, api) {
                expect(web).toBe('web');
                expect(api).toBe('api');
            });
        });
    });


    describe('Service: BuildInf', function() {
        var $httpBackend;
        var scope, element, html = '<div app-version></div>';

        beforeEach(inject(function (_endpointLabel_, _$httpBackend_, _$compile_, _$rootScope_) {

            $httpBackend = _$httpBackend_;

            $httpBackend.whenGET('/data/version.json').respond({
                web: {
                    revision: 'web',
                    date: 'date'
                },
                api: {
                    revision: 'api'
                }
            });
            scope = _$rootScope_.$new();

            element = _$compile_(angular.element(html))(scope);
        }));

        it('should render a version text', inject(function ($window) {
            scope.$digest();
            $httpBackend.flush();

            var expected = 'Web: web -- API: api at date';

            expect(element.text()).toBe(expected);
            expect(element.attr('id')).toBe('footer-build-information');

            expect($window.dmp.version).toBe(expected);
        }));
    });
});
