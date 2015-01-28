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
    .directive('jsPlumbConnector', function ($rootScope, jsP, PubSub, GUID, loDash) {

        var connectorMap = [],
            connectorEndpointMap = [],
            connectorConnectionMap = [],
            defaultOpts = {
                scope: 'schema',
                container: 'schema',
                anchor: 'Continuous',
                endpoint: ['Dot', {
                    radius: 5,
                    cssClass: 'source-endpoint'
                }],
                connectorOverlays: [
                    ['Arrow', {
                        location: 1,
                        width: 10,
                        length: 12,
                        foldback: 0.75
                    }]
                ],
                connector: 'StateMachine',
                connectorStyle: {
                    strokeStyle: 'black',
                    lineWidth: 3
                },
                paintStyle: {
                    fillStyle: 'black',
                    lineWidth: 3
                }
            };

        function createConnection(selectors, options, type) {

            options = angular.extend({}, defaultOpts, options);

            var endpoints = createEndpoints(selectors, options, type);

            var connection = connect(endpoints[0], endpoints[1]);

            connectorConnectionMap.push({
                type: type,
                connection: connection
            });

            return connection;
        }

        function createEndpoints(selectors, options, type) {

            var endpoints = [];

            angular.forEach(selectors, function(selector) {

                var endpoint = createEndpoint(selector, options);

                connectorEndpointMap.push({
                    type: type,
                    endpoint: endpoint
                });

                endpoints.push(endpoint);
            });

            return endpoints;
        }

        function createEndpoint(selector, options) {

            return jsP.addEndpoint(selector, options);

        }

        function connect(sourceEndpoint, targetEndpoint) {

            var connection = jsP.connect(sourceEndpoint, targetEndpoint);

            return connection;
        }

        function onConnectorConnect(options) {

            var target = loDash.filter(connectorMap, { 'ident': { type: options.target.type, uuid: options.target.uuid} });
            var source = loDash.filter(connectorMap, { 'ident': { type: options.source.type, uuid: options.source.uuid} });

            if(target[0] && source[0]) {
                createConnection([source[0].scope.guid, target[0].scope.guid], target[0].options, options.type);
            }
        }

        function onConnectorDisonnect(options) {

            if(connectorConnectionMap.length === 0) {
                return;
            }

            if(typeof options.type === 'string') {
                options.type = [ options.type ];
            }

            angular.forEach(options.type, function(type) {

                var connections = loDash.filter(connectorConnectionMap, { type: type });

                angular.forEach(connections, function(connection) {
                    jsP.detachOriginal(connection.connection);
                });

                connectorConnectionMap = loDash.rest(connectorConnectionMap, { type: type });

                var endpoints = loDash.filter(connectorEndpointMap, { type: type });

                angular.forEach(endpoints, function(endpoint) {
                    jsP.deleteEndpoint(endpoint.endpoint);
                });

                connectorEndpointMap = loDash.rest(connectorEndpointMap, { type: type });

            });

        }

        function onProjectDraftDiscarded() {
            connectorMap = [];
            connectorEndpointMap = [];
            connectorConnectionMap = [];
        }

        $rootScope.$on('$locationChangeStart', function() {
            jsP.detachEveryConnection({});
        });

        PubSub.subscribe($rootScope, 'jsp-connector-connect', onConnectorConnect);
        PubSub.subscribe($rootScope, 'jsp-connector-disconnect', onConnectorDisonnect);
        PubSub.subscribe($rootScope, ['projectDraftDiscarded', 'restoreCurrentProject'], onProjectDraftDiscarded);

        return {
            scope: true,
            restrict: 'A',
            replace: true,
            compile: function(tElement, tAttrs) {
                var jsPlumbConnectorOptions = tAttrs['jsPlumbConnectorOptions'],
                    jsPlumbConnectorOptionsWatch = function(scope) {
                        return scope.$eval(jsPlumbConnectorOptions);
                    },
                    jsPlumbConnectorIdentItem = tAttrs['jsPlumbConnectorIdentItem'],
                    jsPlumbConnectorIdentItemWatch = function(scope) {
                        return scope.$eval(jsPlumbConnectorIdentItem);
                    };

                connectorMap = [];
                connectorEndpointMap = [];
                connectorConnectionMap = [];

                function pushConnectorMap(elem) {

                    var connectorMapIndex = loDash.findIndex(connectorMap, {ident : { type: elem.ident.type, uuid: elem.ident.uuid }});
                    if(connectorMapIndex < 0) {
                        connectorMap.push(elem);
                    } else {
                        connectorMap[connectorMapIndex] = elem;
                    }
                }

                return function(scope, iElement) {
                    var options = jsPlumbConnectorOptionsWatch(scope),
                        identItem = jsPlumbConnectorIdentItemWatch(scope);

                    options = angular.extend({}, defaultOpts, options);

                    scope.guid = GUID.uuid4();
                    iElement.attr('id', scope.guid);

                    var elem = {
                        scope: scope,
                        options: options,
                        ident: {
                            type: tAttrs['jsPlumbConnectorIdentType'],
                            uuid: identItem
                        }
                    };

                    pushConnectorMap(elem);

                };
            }
        };

    });
