'use strict';

describe('Directive: Heartbeat', function () {
    var element, scope, $rootScope, $compile, $timeout, $httpBackend;
    var elementHtml = '<div heartbeat endpoint="\'ping\'" expected="\'pong\'"></div>';

    function getClasses(jqElem) {
        return Array.prototype.slice.call(jqElem[0].classList);
    }

    beforeEach(module('dmpApp'));

    beforeEach(module(function($provide) {
        $provide.value('Util', {
            apiEndpoint: 'foo/'
        });
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _$httpBackend_) {

        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;

        scope = $rootScope.$new();

        var _element = angular.element(elementHtml);
        element = $compile(_element)(scope);
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });

    it('send a ping periodically every second', function() {
        $httpBackend.expectGET('foo/ping').respond('pong');

        scope.$digest();
        $httpBackend.verifyNoOutstandingRequest();

        $timeout.flush(999);
        $httpBackend.verifyNoOutstandingRequest();

        $timeout.flush(1);
        $httpBackend.flush();


        $timeout.flush();

        $httpBackend.expectGET('foo/ping').respond('pong');
        $timeout.flush(999);
        $httpBackend.verifyNoOutstandingRequest();

        $timeout.flush(1);
        $httpBackend.flush();

        $timeout.flush();
    });

    it('should modify the classses of the container element', function() {
        var classes;

        scope.$digest();

        classes = getClasses(element);

        expect(classes).toContain('yellow');
        expect(classes).not.toContain('red');
        expect(classes).not.toContain('green');
        expect(classes).not.toContain('disabled');

        $httpBackend.expectGET('foo/ping').respond('pong');
        $timeout.flush();
        $httpBackend.flush();
        scope.$digest();

        classes = getClasses(element);

        expect(classes).toContain('green');
        expect(classes).not.toContain('red');
        expect(classes).not.toContain('yellow');
        expect(classes).not.toContain('disabled');


        $httpBackend.expectGET('foo/ping').respond('pang');
        $timeout.flush(1000);
        $timeout.flush();
        $httpBackend.flush();
        scope.$digest();

        classes = getClasses(element);

        expect(classes).toContain('yellow');
        expect(classes).not.toContain('green');
        expect(classes).not.toContain('red');
        expect(classes).not.toContain('disabled');


        $httpBackend.expectGET('foo/ping').respond(400, 'gone');
        $timeout.flush(1000);
        $timeout.flush();
        $httpBackend.flush();
        scope.$digest();

        classes = getClasses(element);

        expect(classes).toContain('red');
        expect(classes).not.toContain('green');
        expect(classes).not.toContain('yellow');
        expect(classes).not.toContain('disabled');
    });

    it('should send no heartbeat if disabled', function() {
        var classes;

        scope.$digest();

        element.trigger('click');

        classes = getClasses(element);

        expect(classes).toContain('disabled');
        expect(classes).not.toContain('red');
        expect(classes).not.toContain('green');
        expect(classes).not.toContain('yellow');

        $timeout.flush(2000);
        $timeout.verifyNoPendingTasks();
    });

    it('should reactivate itself if disabled and then clicked', function() {
        var classes;

        scope.$digest();

        element.trigger('click');

        $timeout.flush(1000);
        $timeout.verifyNoPendingTasks();

        element.trigger('click');

        classes = getClasses(element);

        expect(classes).toContain('yellow');
        expect(classes).not.toContain('red');
        expect(classes).not.toContain('green');
        expect(classes).not.toContain('disabled');

        $httpBackend.expectGET('foo/ping').respond('pong');
        $timeout.flush(1000);
        $httpBackend.flush();
        scope.$digest();

        classes = getClasses(element);

        expect(classes).toContain('green');
        expect(classes).not.toContain('red');
        expect(classes).not.toContain('yellow');
        expect(classes).not.toContain('disabled');
    });

});
