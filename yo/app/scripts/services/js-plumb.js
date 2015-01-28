/**
 * Copyright (C) 2013 – 2015  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 * http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

angular.module('dmpApp')
/**
 * Provide configurable options for jsPlumb.
 * @see http://jsplumbtoolkit.com/doc/parameters
 * These will be used whenever a new connection is created, via #connect,
 *   that is, they are not used for #makeSource and #makeTarget calls.
 *
 * to configure:
 * `myApp.config(function(jsPlumbOptionsProvider) {
   *    jsPlumbOptionsProvider.set({
   *      paintStyle: {
   *       strokeStyle: 'red'
   *      }
   *    });
   *  });`
 *
 */
    .provider('jsPlumbOptions', function() {
        var defaultOptions = {
            anchors: [                  // [anchor for source, anchor for target], everything is a [x, y, dx, dy, ox, oy]
                [1, 0.5, 1, 0, -9, -6],   // [right-most border, center), pointing right, pointing horizontally, move 9 pixels to the left, move 6 pixels to the top]
                [0, 0.5, -1, 0, -7, -6]   // [left-most border, center, pointing left, pointing horizontally, move 7 pixels to the left, move 6 pixels to the top]
            ],
            endpoint: 'Blank',          // do not display eny endpoints
            connector: ['Flowchart', {  // this thing makes a nice corner when elements overflow into the next row
                cornerRadius: 5
            }],
            detachable: false,          // do not allow interaction with mouse
            paintStyle: {
                lineWidth: 3,
                strokeStyle: 'black'
            },
            overlays: [
                ['Arrow', {
                    location: 1,            // at the source-end
                    width: 10,              // widest point of arrowhead
                    length: 12,             // longest span of arrowhead
                    foldback: 0.75          // tailpoint is at 9 pixels (12 * 0.75 = 9)
                }]
            ]
        } , options;

        /**
         * Set options to the default options.
         */
        function setDefault() {
            options = angular.extend({}, defaultOptions);
        }

        /**
         * Extend options with the provided options. The semantics of `extend'
         *   follow angular.extend
         *
         * @param opts {Object}  Extension to the current options
         */
        this.set = function(opts) {
            options = angular.extend(options || {}, opts);
        };

        /**
         * Provide the jsPlumbOptions.  This gets called during injection-time
         *   and will set-up the default options if options wasn't specified earlier.
         * @returns {Object}  The configured options
         */
        this.$get = function() {
            if (!options) {
                setDefault();
            }
            return options;
        };
    })
/**
 * Provide an injectable instance of jsPlumb. Defaults to jsPlumb.getInstance
 * but can be mocked out (so, injectable...)
 */
    .factory('jsPlumb', function($window) {
        return $window['jsPlumb'].getInstance();
    })
/**
 * Provide the js-plumb service that is meant to be used by the application.
 * Code that deals with the jsPlumb specifics should go in here.
 */
    .factory('jsP', function(jsPlumbOptions, jsPlumb, GUID) {

        // Save original getCachedData for later use
        jsPlumb.__getCachedData = jsPlumb.getCachedData;

        /**
         * Overwrite original jsP getCachedData
         * @param elId {string} an element id
         * @returns {*} chaed position data
         */
        jsPlumb.getCachedData = function(elId) {

            var $2 = $('#' + elId);

            if ($2.length && !$2.is(':visible')) {

                $2.closest('.jsPanchor:visible').find('.jsPanchorIcon:visible').first().attr('id', GUID.uuid4());
                elId = $2.closest('.jsPanchor:visible').find('.jsPanchorIcon:visible').first().attr('id');

            }

            return jsPlumb.__getCachedData(elId);

        };


        /**
         * Create a new connection between two nodes, that is, it draws an arrow
         * unless configured otherwise. connection is directed from source to target
         * @param source {JQLite|jQuery} source of the new connection
         * @param target {JQLite|jQuery} target of the new connection
         * @param opts {Object}  addition options for jsPlumb
         * @returns {jsPlumb.Connection}
         */
        function connect(source, target, opts) {
            var connection = jsPlumb.connect(angular.extend({
                source: source,
                target: target
            }, jsPlumbOptions, opts || {}));

            if (!source.data) {
                source = $(source);
            }

            source.data('_outbound', connection);

            return connection;
        }

        /**
         * Detach an existing connection between the two given elements.
         * @param connection {jsPlumb.Connection}
         * @param source {JQLite|jQuery}
         * @param target {JQLite|jQuery}
         */
        function detach(connection, source, target) {
            if (connection && connection.source === source[0] && connection.target === target[0]) {
                jsPlumb.detach(connection);
                if (source.data) {
                    source.data('_outbound', null);
                }
            }
        }

        /**
         * Detach original function
         * @param connection
         */
        function detachOriginal(connection) {
            if (angular.isObject(connection) && connection.endpoints) {
                jsPlumb.detach(connection);
            }
        }

        /**
         * Detach all connections that were bound to the given element.
         * TODO: this fires an event. capture event and fire a custom one, maybe?
         * @param element {jqLite|jQuery}
         */
        function detachAll(element) {
            jsPlumb.detachAllConnections(element[0], {fireEvent: false});
        }

        /**
         * Deleletes endpoints
         * @param element {jqLite|jQuery}
         */
        function deleteEndpoint(element) {
            jsPlumb.deleteEndpoint(element);
        }

        /**
         * Create a source out of an element. A source can then be used to draw
         *   new connections via mouse.  The style of these connections should go
         *   to `opts`.
         * @see http://jsplumbtoolkit.com/doc/connections#sourcesandtargets
         * @param element {jqLite|jQuery}  the soon-to-be source element
         * @param attrs {Object}  an angular element attributes instance
         * @param opts {Object}  jsPlumb creation options
         */
        function makeSource(element, attrs, opts) {
            jsPlumb.makeSource(element[0], opts);
        }

        /**
         * Create a target out of an element. A target is a valid drop target for
         *   connections, that are drawn out of a source element.  The style of
         *   these connections should go to `opts`, although I'm not quite sure, how
         *   different styles for sources and targets affect each other.
         * @param element {jqLite|jQuery}  the soon-to-be target element
         * @param attrs {Object}  an angular element attributes instance
         * @param opts {Object}  jsPlumb creation options
         */
        function makeTarget(element, attrs, opts) {
            jsPlumb.makeTarget(element[0], opts);
        }

        /**
         * Cancel previous makeSource calls.  If element wasn't a source, nothing
         *   happens
         * @see http://jsplumbtoolkit.com/doc/connections#sourcesandtargets
         * @param element {jqLite|jQuery}  the current source element
         */
        function unmakeSource(element) {
            jsPlumb.unmakeSource(element[0]);
        }

        /**
         * Cancel previous makeTarget calls.  If element wasn't a target, nothing
         *   happens.
         * @param element {jqLite|jQuery}  the current target element
         */
        function unmakeTarget(element) {
            jsPlumb.unmakeTarget(element[0]);
        }

        /**
         * Register eventhandler on jsPlumb.
         * @see http://jsplumbtoolkit.com/doc/events
         * @param event {String}  the name of the event, e.g. 'click'
         * @param callback {Function}  the event handler, that gets called when
         *   the event fires
         */
        function on(event, callback) {
            jsPlumb.bind(event, callback);
        }

        /**
         * Repaints an element and its connections. This method gets new sizes for the elements before painting anything.
         * @see http://jsplumbtoolkit.com/apidocs/jsPlumbInstance.html
         * @param el {String | Element | Selector} The element in question.
         */
        function repaintEverything() {
            jsPlumb.repaintEverything();
        }

        /**
         * Convert element to endpoint to be used by connect
         * @param el {jqLite|jQuery} DOM element
         * @param params {object} Set of parameters
         * @param referenceParams {object=} Set of parameters
         * @returns {*}
         */
        function addEndpoint(el, params, referenceParams) {
            return jsPlumb.addEndpoint(el, params, referenceParams);
        }

        /**
         * Removes all current set endpoints
         * @param el {jqLite|jQuery} connection element
         * @param recurse {boolean} Reursive?
         */
        function removeAllEndpoints(el, recurse) {
            jsPlumb.removeAllEndpoints(el, recurse);
        }

        /**
         * get all connections managed by the instance of jsplumb.
         * @returns {*}
         */
        function getAllConnections() {
            return jsPlumb.getAllConnections();
        }

        /**
         * detaches every connection
         * @param params
         */
        function detachEveryConnection(params) {
            jsPlumb.detachEveryConnection(params);
        }

        /**
         * Resets the jsPlumb instance
         */
        function reset() {
            jsPlumb.reset();
        }

        return {
            on: on,
            connect: connect,
            detach: detach,
            detachAll: detachAll,
            makeSource: makeSource,
            makeTarget: makeTarget,
            unmakeSource: unmakeSource,
            unmakeTarget: unmakeTarget,
            repaintEverything: repaintEverything,
            addEndpoint: addEndpoint,
            removeAllEndpoints: removeAllEndpoints,
            deleteEndpoint: deleteEndpoint,
            getAllConnections: getAllConnections,
            detachEveryConnection: detachEveryConnection,
            reset: reset,
            detachOriginal: detachOriginal
        };
    });
