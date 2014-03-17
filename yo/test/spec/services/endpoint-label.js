'use strict';

describe('Service: endpointLabel', function () {
    var fakeModal, endpointLabel, $rootScope, $modal;

    beforeEach(module('dmpApp'));

    beforeEach(inject(function (_endpointLabel_, _$rootScope_, $q, _$modal_) {
        endpointLabel = _endpointLabel_;
        $rootScope = _$rootScope_;
        $modal = _$modal_;

        fakeModal = (function() {
            var defer = $q.defer();

            return {
                result: defer.promise,
                close: defer.resolve,
                dismiss: defer.reject
            };
        }());
    }));

    beforeEach(function() {
        this.addMatchers({
            toBeResolvedWith: function(expected) {
                var resolved;
                var msg = 'Expected "' + angular.mock.dump(this.actual) + '" to be resolved with "' + expected;

                this.message = function() {
                    return msg + '".';
                };

                this.actual.then(function(result) {
                    msg += '", but was resolved with "' + angular.mock.dump(result);
                    resolved = result;
                }, function(reason) {
                    msg += '", but was rejected with "' + angular.mock.dump(reason);
                });
                $rootScope.$digest();

                return resolved === expected;
            },
            toBeRejectedWith: function(expected) {
                var rejected;
                var msg = 'Expected "' + angular.mock.dump(this.actual) + '" to be rejected with "' + expected;

                this.message = function() {
                    return msg + '".';
                };

                this.actual.then(function(result) {
                    msg += '", but was resolved with "' + angular.mock.dump(result);
                }, function(reason) {
                    msg += '", but was rejected with "' + angular.mock.dump(reason);
                    rejected = reason;
                });
                $rootScope.$digest();

                return rejected === expected;
            },
            toBeCompleted: function() {
                var completed = false;

                this.message = function() {
                    return 'Expected "' + angular.mock.dump(this.actual) + '" to be completed".';
                };

                this.actual.then(function() {
                    completed = true;
                }, function() {
                    completed = true;
                });
                $rootScope.$digest();

                return completed;
            }
        });
    });

    afterEach(inject(function($document) {
        var body = $document.find('body');
        body.find('div.modal').remove();
        body.find('div.modal-backdrop').remove();
        body.removeClass('modal-open');
    }));

    it('should get the label', function () {
        var connection = jasmine.createSpyObj('connection', ['getLabel']);
        connection.getLabel.andReturn('foo');

        var actual = endpointLabel.get(connection);
        expect(actual).toBe('foo');
        expect(connection.getLabel).toHaveBeenCalled();
    });

    it('should set the label', function () {
        var connection = jasmine.createSpyObj('connection', ['setLabel', 'getLabelOverlay']);
        var labelOverlay = jasmine.createSpyObj('labelOverlay', ['addClass']);
        connection.getLabelOverlay.andReturn(labelOverlay);

        endpointLabel.set(connection, 'foo');

        expect(connection.setLabel).toHaveBeenCalledWith('foo');
        expect(connection.getLabelOverlay).toHaveBeenCalled();
        expect(labelOverlay.addClass).toHaveBeenCalledWith('mapping-label');
        expect(labelOverlay.addClass).toHaveBeenCalledWith('mapping-active');
    });

    it('should activate the label', function () {
        var connection = jasmine.createSpyObj('connection', ['getLabelOverlay']);
        var labelOverlay = jasmine.createSpyObj('labelOverlay', ['addClass']);

        // no overlay
        endpointLabel.activate(connection);
        expect(connection.getLabelOverlay).toHaveBeenCalled();
        expect(labelOverlay.addClass).not.toHaveBeenCalled();

        // with overlay
        connection.getLabelOverlay.andReturn(labelOverlay);

        endpointLabel.activate(connection);

        expect(connection.getLabelOverlay).toHaveBeenCalled();
        expect(labelOverlay.addClass).toHaveBeenCalledWith('mapping-label');
        expect(labelOverlay.addClass).toHaveBeenCalledWith('mapping-active');
    });

    it('should deactivate the label', function () {
        var connection = jasmine.createSpyObj('connection', ['getLabelOverlay']);
        var labelOverlay = jasmine.createSpyObj('labelOverlay', ['removeClass']);

        // no overlay
        endpointLabel.deactivate(connection);
        expect(connection.getLabelOverlay).toHaveBeenCalled();
        expect(labelOverlay.removeClass).not.toHaveBeenCalled();

        // with overlay
        connection.getLabelOverlay.andReturn(labelOverlay);

        endpointLabel.deactivate(connection);

        expect(connection.getLabelOverlay).toHaveBeenCalled();
        expect(labelOverlay.removeClass).toHaveBeenCalledWith('mapping-active');
    });

    it('should ask for the label and validate its input', function () {
        spyOn($modal, 'open').andReturn(fakeModal);

        var p = endpointLabel.ask('foo', 'bar');

        fakeModal.close('abcde');
        expect(p).toBeResolvedWith('abcde');
    });

    it('should ask for the label and reject its input', function () {
        spyOn($modal, 'open').andReturn(fakeModal);

        var p = endpointLabel.ask('foo', 'bar');

        fakeModal.close('abc');
        expect(p).toBeRejectedWith('invalid');
    });

    it('should ask for the label and reject on dismissal', function () {
        spyOn($modal, 'open').andReturn(fakeModal);

        var p = endpointLabel.ask('foo', 'bar');

        fakeModal.dismiss('cancel');
        expect(p).toBeRejectedWith('cancel');
    });

    it('should ask for the label and reject on dismissal', function () {
        spyOn($modal, 'open').andReturn(fakeModal);

        var p = endpointLabel.ask('foo', 'bar');

        fakeModal.dismiss('cancel');
        expect(p).toBeRejectedWith('cancel');
    });

    it('should render the prompt and help texts', inject(function ($document, $templateCache) {
        $templateCache.put('views/modals/re-label-connection.html', '<div><span id="test-text">{{ text }}</span><span id="test-help">{{ help }}</span></div>');
        spyOn($modal, 'open').andCallThrough();

        endpointLabel.ask();
        $rootScope.$digest();

        expect($document.find('#test-text').text()).toBe('Name this connection');
        expect($document.find('#test-help').text()).toBe('The name has to be at least 5 characters long');
    }));

    it('should be able to use label validation', inject(function ($document, $templateCache) {
        $templateCache.put('views/modals/re-label-connection.html', '<div><span ng-init="label=\'abcde\'" id="test-valid">{{ isValid(label) }}</span><span ng-init="label2=\'abe\'" id="test-invalid">{{ isValid(label2) }}</span></div>');
        spyOn($modal, 'open').andCallThrough();

        endpointLabel.ask();
        $rootScope.$digest();

        expect($document.find('#test-valid').text()).toBe('true');
        expect($document.find('#test-invalid').text()).toBe('false');
    }));

    it('should close with a valid label', inject(function ($document, $templateCache) {
        $templateCache.put('views/modals/re-label-connection.html', '<div><span ng-init="close(\'abcde\')" id="test-valid-close"></span></div>');
        spyOn($modal, 'open').andCallThrough();

        expect(endpointLabel.ask()).toBeResolvedWith('abcde');
    }));

    it('should not close with an invalid label', inject(function ($document, $templateCache) {
        $templateCache.put('views/modals/re-label-connection.html', '<div><span ng-init="close(\'abe\')" id="test-invalid-close"></span></div>');
        spyOn($modal, 'open').andCallThrough();

        expect(endpointLabel.ask()).not.toBeCompleted();
    }));

});
