'use strict';

describe('Service: endpointSelector', function () {
    var fakeModal, endpointSelector, $rootScope, $modal;

    function makeFakeConnection(endpoint, connector) {
        var ep = endpoint || {setPaintStyle: angular.noop};
        var c = connector || {addClass: angular.noop};

        return {
            test_id: 'foo-42',
            getLabel: function() {
                return 'foo';
            },
            endpoints: [ep],
            setPaintStyle: ep.setPaintStyle,
            additionalInput: [],
            getConnector: function() {
                return c;
            }
        };
    }

    function countPoolSize(filter) {
        var f = filter || function() { return true; };
        var instances = 0;
        endpointSelector.foreach(function(entry) {
            if (f(entry)) {
                instances++;
            }
        });
        return instances;
    }

    beforeEach(module('dmpApp'));

    beforeEach(inject(function (_endpointSelector_, _$rootScope_, $q, _$modal_) {
        endpointSelector = _endpointSelector_;
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

    it('should activate a connection', inject(function (endpointLabel) {
        spyOn(endpointLabel, 'activate');
        var EndpointSpy = jasmine.createSpyObj('Endpoint', ['setPaintStyle']);
        var ConnectorSpy = jasmine.createSpyObj('Connector', ['addClass']);

        var fakeConnection = makeFakeConnection(EndpointSpy, ConnectorSpy);

        endpointSelector.activate(fakeConnection);

        // added tp pool
        var entries = countPoolSize(function(entry) {
            expect(entry.test_id).toBe(fakeConnection.test_id);
            return true;
        });
        expect(entries).toBe(1);

        expect(fakeConnection.mappingId).toBeGreaterThan(-new Date() - 1);
        expect(EndpointSpy.setPaintStyle).toHaveBeenCalledWith({fillStyle: 'red'}); // endpoint
        expect(EndpointSpy.setPaintStyle).toHaveBeenCalledWith({strokeStyle: 'red'}); // connection

        expect(endpointLabel.activate).toHaveBeenCalledWith(fakeConnection);

        expect(ConnectorSpy.addClass).toHaveBeenCalledWith('mapping-active');
    }));

    it('should not activate a connection that has no label', function () {

        var fakeConnection = makeFakeConnection();
        fakeConnection.getLabel = function() {
            return null;
        };

        var ret = endpointSelector.activate(fakeConnection);

        // nothing added to pool
        endpointSelector.foreach(function() {
            this.fail('oh no!');
        }, this);

        expect(ret).toBe(null);
    });

    it('should activate, but not re-add the the pool', inject(function (endpointLabel) {
        spyOn(endpointLabel, 'activate');

        var fakeConnection = makeFakeConnection();

        endpointSelector.activate(fakeConnection);

        // activate again
        endpointSelector.activate(fakeConnection);

        // only one instance
        var instances = countPoolSize(function(entry) {
            expect(entry.test_id).toBe(fakeConnection.test_id);
            return true;
        });

        expect(instances).toBe(1);
    }));

    it('should activate a connection and respect their mappingId', inject(function (endpointLabel) {
        spyOn(endpointLabel, 'activate');

        var fakeConnection = makeFakeConnection();
        fakeConnection.mappingId = 1337;

        endpointSelector.activate(fakeConnection);

        expect(fakeConnection.mappingId).toBe(1337);
    }));

    it('should be able to reset the current pool', inject(function (endpointLabel) {
        spyOn(endpointLabel, 'activate');

        var fakeConnection = makeFakeConnection();

        endpointSelector.activate(fakeConnection);

        var instances = countPoolSize();
        expect(instances).toBeGreaterThan(0);


        endpointSelector.reset();

        instances = countPoolSize();
        expect(instances).toBe(0);
    }));

    it('should remove a connection from the pool', inject(function (endpointLabel) {
        spyOn(endpointLabel, 'activate');

        var fakeConnection = makeFakeConnection();

        endpointSelector.activate(fakeConnection);

        var instances = countPoolSize();
        expect(instances).toBe(1);

        endpointSelector.removeFromPool(fakeConnection);

        instances = countPoolSize();
        expect(instances).toBe(0);
    }));

    it('should add a connection from the pool', inject(function (endpointLabel) {
        spyOn(endpointLabel, 'activate');

        var fakeConnection = makeFakeConnection();

        endpointSelector.activate(fakeConnection);

        var instances = countPoolSize();
        expect(instances).toBe(1);

        endpointSelector.toPool(fakeConnection);

        instances = countPoolSize();
        expect(instances).toBe(2);
    }));

});
