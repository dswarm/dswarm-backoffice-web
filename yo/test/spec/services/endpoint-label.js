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
        jasmine.addMatchers({
            toBeResolvedWith: function() {

                return {
                    compare: function(actual, expected) {

                        var resolved,
                            result = {
                                message : 'Expected "' + angular.mock.dump(actual) + '" to be resolved with "' + expected
                            };

                        actual.then(function(result) {
                            result.message += '", but was resolved with "' + angular.mock.dump(result);
                            resolved = result;
                        }, function(reason) {
                            result.message += '", but was rejected with "' + angular.mock.dump(reason);
                        });
                        $rootScope.$digest();

                        result.pass = resolved === expected;

                        return result;

                    }
                };

            },
            toBeResolvedObjectWith: function() {

                return {
                    compare: function(actual, expected, test) {

                        var resolved,
                            result = {
                                message : 'Expected "' + angular.mock.dump(actual) + '" to be resolved with "' + expected
                            };

                        actual.then(function(result) {
                            result.message += '", but was resolved with "' + angular.mock.dump(result[test]);
                            resolved = result[test];
                        }, function(reason) {
                            result.message += '", but was rejected with "' + angular.mock.dump(reason);
                        });
                        $rootScope.$digest();

                        result.pass = resolved === expected;

                        return result;

                    }
                };

            },
            toBeRejectedWith: function() {

                return {
                    compare: function(actual, expected) {

                        var rejected,
                            result = {
                                message : 'Expected "' + angular.mock.dump(actual) + '" to be resolved with "' + expected
                            };

                        actual.then(function(result) {
                            result.message += '", but was resolved with "' + angular.mock.dump(result);
                        }, function(reason) {
                            result.message += '", but was rejected with "' + angular.mock.dump(reason);
                            rejected = reason;
                        });
                        $rootScope.$digest();

                        result.pass = rejected === expected;
                        result.message += '".';

                        return result;

                    }
                };

            },
            toBeCompleted: function() {

                return {
                    compare: function(actual) {

                        var completed = false,
                            result = {
                                message : 'Expected "' + angular.mock.dump(actual) + '" to be completed".'
                            };

                        actual.then(function() {
                            completed = true;
                        }, function() {
                            completed = true;
                        });
                        $rootScope.$digest();

                        result.pass = completed;

                        return result;

                    }
                };

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
        connection.getLabel.and.returnValue('foo');

        var actual = endpointLabel.get(connection);
        expect(actual).toBe('foo');
        expect(connection.getLabel).toHaveBeenCalled();
    });

    it('should set the label', function () {
        var connection = jasmine.createSpyObj('connection', ['setLabel', 'getLabelOverlay']);
        var labelOverlay = jasmine.createSpyObj('labelOverlay', ['addClass']);
        connection.getLabelOverlay.and.returnValue(labelOverlay);

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
        connection.getLabelOverlay.and.returnValue(labelOverlay);

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
        connection.getLabelOverlay.and.returnValue(labelOverlay);

        endpointLabel.deactivate(connection);

        expect(connection.getLabelOverlay).toHaveBeenCalled();
        expect(labelOverlay.removeClass).toHaveBeenCalledWith('mapping-active');
    });

    it('should ask for the label and validate its input', function () {
        spyOn($modal, 'open').and.returnValue(fakeModal);

        var p = endpointLabel.ask('foo', 'bar');

        fakeModal.close({label : 'abcde'});
        expect(p).toBeResolvedObjectWith('abcde', 'label');
    });

    it('should ask for the label and reject its input', function () {
        spyOn($modal, 'open').and.returnValue(fakeModal);

        var p = endpointLabel.ask('foo', 'bar');

        fakeModal.close('ab');
        expect(p).toBeRejectedWith('invalid');
    });

    it('should ask for the label and reject on dismissal', function () {
        spyOn($modal, 'open').and.returnValue(fakeModal);

        var p = endpointLabel.ask('foo', 'bar');

        fakeModal.dismiss('cancel');
        expect(p).toBeRejectedWith('cancel');
    });

    it('should ask for the label and reject on dismissal', function () {
        spyOn($modal, 'open').and.returnValue(fakeModal);

        var p = endpointLabel.ask('foo', 'bar');

        fakeModal.dismiss('cancel');
        expect(p).toBeRejectedWith('cancel');
    });

    it('should render the prompt and help texts', inject(function ($document, $templateCache) {
        $templateCache.put('views/modals/re-label-connection.html', '<div><span id="test-text">{{ text }}</span><span id="test-help">{{ help }}</span></div>');
        spyOn($modal, 'open').and.callThrough();

        endpointLabel.ask();
        $rootScope.$digest();

        expect($document.find('#test-text').text()).toBe('Name this mapping');
        expect($document.find('#test-help').text()).toBe('The name has to be at least 3 characters long');
    }));

    it('should be able to use label validation', inject(function ($document, $templateCache) {
        $templateCache.put('views/modals/re-label-connection.html', '<div><span ng-init="label=\'abcde\'" id="test-valid">{{ isValid(label) }}</span><span ng-init="label2=\'ab\'" id="test-invalid">{{ isValid(label2) }}</span></div>');
        spyOn($modal, 'open').and.callThrough();

        endpointLabel.ask();
        $rootScope.$digest();

        expect($document.find('#test-valid').text()).toBe('true');
        expect($document.find('#test-invalid').text()).toBe('false');
    }));

    it('should close with a valid label', inject(function ($document, $templateCache) {
        $templateCache.put('views/modals/re-label-connection.html', '<div><span ng-init="close({label : \'abcde\'})" id="test-valid-close"></span></div>');
        spyOn($modal, 'open').and.callThrough();

        expect(endpointLabel.ask()).toBeResolvedObjectWith('abcde', 'label');
    }));

    it('should not close with an invalid label', inject(function ($document, $templateCache) {
        $templateCache.put('views/modals/re-label-connection.html', '<div><span ng-init="close(\'ab\')" id="test-invalid-close"></span></div>');
        spyOn($modal, 'open').and.callThrough();

        expect(endpointLabel.ask()).not.toBeCompleted();
    }));

});
