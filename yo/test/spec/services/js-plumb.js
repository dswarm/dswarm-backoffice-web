'use strict';

describe('jsPlump service tests', function () {

    beforeEach(module('dmpApp'));


    describe('the dummied jsPlumb', function() {

        beforeEach(module('dmpApp', function ($provide) {
            $provide.value('jsPlumb', {
                connect: function (options) {
                    var connection = {
                        source: options.source[0],
                        target: options.target[0]
                    };

                    options.source.addClass('_jsPlumb_endpoint_anchor_');
                    options.target.addClass('_jsPlumb_endpoint_anchor_');

                    return connection;
                },
                detach: function (connection) {
                    angular.element(connection.source).removeClass('_jsPlumb_endpoint_anchor_');
                    angular.element(connection.target).removeClass('_jsPlumb_endpoint_anchor_');


                    connection.source = null;
                    connection.target = null;
                }
            });
        }));

        it('should have connect and detach methods', inject(function (jsP) {
            expect(angular.isFunction(jsP.connect)).toBe(true);
            expect(angular.isFunction(jsP.detach)).toBe(true);
        }));

        it('should connect two nodes', inject(function (jsP) {
            var src = angular.element('<div>')
                , tgt = angular.element('<div>');

            var connection = jsP.connect(src, tgt);

            expect(src.hasClass('_jsPlumb_endpoint_anchor_')).toBe(true);
            expect(tgt.hasClass('_jsPlumb_endpoint_anchor_')).toBe(true);

            expect(connection.source).toBe(src[0]);
            expect(connection.target).toBe(tgt[0]);

            expect(src.data('_outbound')).not.toBe(null);
            expect(src.data('_outbound')).toBe(connection);
        }));


        it('should detach a connection between two nodes', inject(function (jsP) {
            var src = angular.element('<div>')
                , tgt = angular.element('<div>');

            var connection = jsP.connect(src, tgt);

            jsP.detach(connection, src, tgt);

            expect(src.hasClass('_jsPlumb_endpoint_anchor_')).toBe(false);
            expect(tgt.hasClass('_jsPlumb_endpoint_anchor_')).toBe(false);

            expect(connection.source).toBe(null);
            expect(connection.target).toBe(null);

            expect(src.data('_outbound')).toBe(null);
        }));

    });

    describe('the mocked jsPlumb', function(){

        it('should detach all connections of a given element', inject(function(jsP, jsPlumb) {
            spyOn(jsPlumb, 'detachAllConnections');
            jsP.detachAll(['foo']);

            expect(jsPlumb.detachAllConnections).toHaveBeenCalledWith('foo', {fireEvent: false});
        }));

        it('should delete an endpoint', inject(function(jsP, jsPlumb) {
            spyOn(jsPlumb, 'deleteEndpoint');
            jsP.deleteEndpoint('foo');

            expect(jsPlumb.deleteEndpoint).toHaveBeenCalledWith('foo');
        }));

        it('should make a source element', inject(function(jsP, jsPlumb) {
            spyOn(jsPlumb, 'makeSource');
            jsP.makeSource(['foo'], null, 'bar');

            expect(jsPlumb.makeSource).toHaveBeenCalledWith('foo', 'bar');
        }));

        it('should make a target element', inject(function(jsP, jsPlumb) {
            spyOn(jsPlumb, 'makeTarget');
            jsP.makeTarget(['foo'], null, 'bar');

            expect(jsPlumb.makeTarget).toHaveBeenCalledWith('foo', 'bar');
        }));

        it('should unmake a source element', inject(function(jsP, jsPlumb) {
            spyOn(jsPlumb, 'unmakeSource');
            jsP.unmakeSource(['foo']);

            expect(jsPlumb.unmakeSource).toHaveBeenCalledWith('foo');
        }));

        it('should unmake a target element', inject(function(jsP, jsPlumb) {
            spyOn(jsPlumb, 'unmakeTarget');
            jsP.unmakeTarget(['foo']);

            expect(jsPlumb.unmakeTarget).toHaveBeenCalledWith('foo');
        }));

        it('should repaint everything', inject(function(jsP, jsPlumb) {
            spyOn(jsPlumb, 'repaintEverything');
            jsP.repaintEverything();

            expect(jsPlumb.repaintEverything).toHaveBeenCalled();
        }));

        it('should add an endpoint', inject(function(jsP, jsPlumb) {
            spyOn(jsPlumb, 'addEndpoint');
            jsP.addEndpoint('foo', true, 'bar');

            expect(jsPlumb.addEndpoint).toHaveBeenCalledWith('foo', true, 'bar');
        }));

        it('should remove all endpoints', inject(function(jsP, jsPlumb) {
            spyOn(jsPlumb, 'removeAllEndpoints');
            jsP.removeAllEndpoints('foo', true);

            expect(jsPlumb.removeAllEndpoints).toHaveBeenCalledWith('foo', true);
        }));

        it('should give all connections', inject(function(jsP, jsPlumb) {
            spyOn(jsPlumb, 'getAllConnections');
            jsP.getAllConnections();

            expect(jsPlumb.getAllConnections).toHaveBeenCalled();
        }));

        it('should detach every connection', inject(function(jsP, jsPlumb) {
            spyOn(jsPlumb, 'detachEveryConnection');
            jsP.detachEveryConnection('foo');

            expect(jsPlumb.detachEveryConnection).toHaveBeenCalledWith('foo');
        }));

    });

});
