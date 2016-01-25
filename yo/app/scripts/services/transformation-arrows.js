/**
 * Copyright (C) 2013 – 2016  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
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
    .factory('transformationArrows', function(jsPlumb, loDash, GUID, PubSub, convertUnits) {

        var connectionMapping = [],
            createdConnections = [],
            createdEndpoints = [],
            oneEmInPx = convertUnits.em2px(1),
            halfEm = (oneEmInPx * 0.5) | 0; // jshint ignore:line


        function createIdent(identifier, type) {
            return {
                ident: {
                    uuid: identifier,
                    type: type
                }
            };
        }

        function findConnectionIndex(identifier, type) {
            var ident = type ? createIdent(identifier, type) : identifier;
            return loDash.findIndex(connectionMapping, ident);
        }

        function findConnection(identifier, type) {
            var index = findConnectionIndex(identifier, type);
            if (index === -1) {
                return undefined;
            }
            return connectionMapping[index];
        }

        function registerConnection(identifier, type) {
            var ident = createIdent(identifier, type),
                index = findConnectionIndex(ident),
                guid = GUID.uuid4(),
                content = angular.extend(ident, {guid: guid});

            if (index === -1) {
                connectionMapping.push(content);
            } else {
                connectionMapping[index] = content;
            }

            return guid;
        }


        function doBatched(fn) {
            jsPlumb.doWhileSuspended(fn);
        }

        function createEndpoint(options, selector) {
            return jsPlumb.addEndpoint(selector, options);
        }

        function plumbOptions() {
            return {
                container: 'transformation',
                detachable: false,
                anchor: [
                    [0, 0.5, -1, 0, -halfEm, 0], // left with .5em offset
                    [1, 0.5, 1, 0, halfEm, 0] // right with .5em offset
                ],
                endpoint: 'Blank',
                connectorOverlays: [
                    ['Arrow', {
                        location: 1,
                        width: halfEm,
                        length: (oneEmInPx * 0.75) | 0, // jshint ignore:line
                        foldback: 0.75
                    }]
                ],
                connector: 'Straight',
                connectorStyle: {
                    strokeStyle: '#5E6C6D',
                    lineWidth: 2
                },
                paintStyle: {
                    fillStyle: '#5E6C6D',
                    strokeStyle: 'black',
                    lineWidth: 2
                }
            };
        }

        function plumbConnect(source, target, options) {
            var connection;
            var connectionOpts = {
                source: source,
                target: target
            };

            try {
                connection = jsPlumb.connect(connectionOpts, options);
                if (!source.data) {
                    source = $(source);
                }
                source.data('_outbound', connection);
            } catch (ignore) {
                // when the UI is particularly slow,
                // connect calls can happen before
                // the element exists in the DOM.
                // TODO: what to do in this case?
            }

            return connection;
        }

        function cacheCreatedEndpoints(endpoints, type) {
            var wrapped = loDash.map(endpoints, function(endpoint) {
                return {
                    type: type,
                    endpoint: endpoint
                };
            });

            createdEndpoints.push.apply(createdEndpoints, wrapped);
        }

        function createEndpoints(selectors, type, options) {

            var create = loDash.partial(createEndpoint, options);
            var endpoints = loDash.map(selectors, create);

            cacheCreatedEndpoints(endpoints, type);

            return endpoints;
        }

        function createConnection(selectors, type, options) {
            var endpoints = createEndpoints(selectors, type, options);
            var connection = plumbConnect(endpoints[0], endpoints[1]);

            createdConnections.push({
                type: type,
                connection: connection
            });

            return connection;
        }

        function connectOne(options, connection) {

            var target = findConnection(connection.target.uuid, connection.target.type),
                source = findConnection(connection.source.uuid, connection.source.type);

            if(target && source) {
                createConnection([source.guid, target.guid], connection.type, options);
            }
        }

        function connectAll(connections) {
            var opts = plumbOptions();
            if (loDash.isArray(connections)) {
                var connect = loDash.partial(connectOne, opts);
                doBatched(function() {
                    loDash.forEach(connections, connect);
                });
            } else {
                connectOne(opts, connections);
            }
        }

        function disconnectOneConnection(connection) {
            if (loDash.isObject(connection) && connection.endpoints) {
                try {
                    jsPlumb.detach(connection);
                } catch (ignore) {
                    // when we call this function on elements that were already removed from the DOM,
                    // some underlying call to jQuery(elem).offset() throws, since, well, there is no offset anymore.
                    // We treat this case as a success, assuming the connection is detached.
                }
            }
        }

        function disconnectOneEndpoint(endpoint) {
            try {
                jsPlumb.deleteEndpoint(endpoint);
            } catch (ignore) {
                // when we call this function on elements that were already removed from the DOM,
                // some underlying call to jQuery(elem).offset() throws, since, well, there is no offset anymore.
                // We treat this case as a success, assuming the connection is detached.
            }
        }

        function disconnectConnectionForType(type) {
            var connections = loDash.filter(createdConnections, { type: type });
            loDash.forEach(connections, function(connection) {
                disconnectOneConnection(connection.connection);
            });
            createdConnections = loDash.reject(createdConnections, { type: type });
        }

        function disconnectEndpointForType(type) {
            var endpoints = loDash.filter(createdEndpoints, { type: type });
            loDash.forEach(endpoints, function(endpoint) {
                disconnectOneEndpoint(endpoint.endpoint);
            });
            createdEndpoints = loDash.reject(createdEndpoints, { type: type });
        }

        function disconnectAll(options) {

            if (loDash.isEmpty(createdConnections)) {
                return;
            }

            if (loDash.isString(options.type)) {
                options.type = [ options.type ];
            }

            doBatched(function() {
                loDash.forEach(options.type, function(type) {
                    disconnectConnectionForType(type);
                    disconnectEndpointForType(type);
                });
            });
        }

        function clear() {
            connectionMapping = [];
            createdConnections = [];
            createdEndpoints = [];
        }

        // TODO: subscribe elsewhere and expose methods?
        PubSub.subscribe(null, ['projectDraftDiscarded', 'restoreCurrentProject'], clear);
        PubSub.subscribe(null, 'jsp-connector-connect', connectAll);
        PubSub.subscribe(null, 'jsp-connector-disconnect', disconnectAll);

        return {
            register: registerConnection,
            clear: clear
        };
    });
