'use strict';

describe('Directives DragDrop', function () {
    var guid;

    beforeEach(module('dmpApp'));

    beforeEach(module(function($provide) {

	guid = jasmine.createSpyObj('GUID', ['uuid4']);
	guid.uuid4.andReturn('1234');

	$provide.value('GUID', guid);
    }));

    describe('Directive: draggable', function() {
	var scope, $rootScope, $compile;
	var element;
	var elementHtml = '<div draggable></div>';

	beforeEach(inject(function ($injector) {

	    $rootScope = $injector.get('$rootScope');
	    $compile = $injector.get('$compile');

	    scope = $rootScope.$new();

	    var _element = angular.element(elementHtml);
	    element = $compile(_element)(scope);
	}));

	it('should set drag attributes', function () {

	    scope.$digest();

	    expect(element.attr('draggable')).toBe('true');
	    expect(element.attr('id')).toBe('1234');
	});

	it('should set respect an already present element id', function () {
	    element.attr('id', 'foo');

	    scope.$digest();

	    expect(element.attr('id')).toBe('foo');
	});

	it('should listen to the dragstart event', inject(function () {

	    scope.$digest();

	    var spy = jasmine.createSpy('spy');
	    $rootScope.$on('DRAG-START', spy);

	    var spyObj = jasmine.createSpyObj('dataTransfer', ['setData']);
	    var mockEvt = $.Event('dragstart');
	    mockEvt.dataTransfer = spyObj;

	    element.triggerHandler(mockEvt);


	    expect(spyObj.setData).toHaveBeenCalledWith('text', '1234');
	    expect(spy).toHaveBeenCalled();
	}));

	it('should listen to the dragend event', inject(function () {

	    scope.$digest();

	    var spy = jasmine.createSpy('spy');
	    $rootScope.$on('DRAG-END', spy);

	    var mockEvt = $.Event('dragend');
	    element.triggerHandler(mockEvt);

	    expect(spy).toHaveBeenCalled();
	}));

    });

    describe('Directive: DropTarget', function() {

	var scope, $rootScope, $compile;
	var element;
	var elementHtml = '<div drop-target></div>';

	beforeEach(inject(function ($injector) {

	    $rootScope = $injector.get('$rootScope');
	    $compile = $injector.get('$compile');

	    scope = $rootScope.$new();

	    var _element = angular.element(elementHtml);
	    element = $compile(_element)(scope);
	}));

	it('should set drag attributes', function () {
	    scope.$digest();

	    expect(element.attr('id')).toBe('1234');
	});

	it('should set respect an already present element id', function () {
	    element.attr('id', 'foo');

	    scope.$digest();

	    expect(element.attr('id')).toBe('foo');
	});

	it('should listen to the dragover event', inject(function () {

	    scope.$digest();

	    var mockEvt = $.Event('dragover');
	    var preventSpy = jasmine.createSpy('prevent');
	    mockEvt.dataTransfer = {};
	    mockEvt.preventDefault = preventSpy;

	    element.triggerHandler(mockEvt);

	    expect(preventSpy).toHaveBeenCalled();
	    expect(mockEvt.dataTransfer.dropEffect).toBe('move');
	}));

	it('should listen to the dragenter event', inject(function () {

	    scope.$digest();

	    var mockEvt = $.Event('dragenter');
	    element.triggerHandler(mockEvt);

	    expect(element.hasClass('lvl-over')).toBe(true);
	}));

	it('should listen to the dragleave event', inject(function () {

	    scope.$digest();

	    element.addClass('lvl-over');

	    var mockEvt = $.Event('dragleave');
	    element.triggerHandler(mockEvt);

	    expect(element.hasClass('lvl-over')).toBe(false);
	}));

    });

});
