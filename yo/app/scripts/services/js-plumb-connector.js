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

            var target = loDash.filter(connectorMap, { 'ident': { type: options.target.type, id: options.target.id} });
            var source = loDash.filter(connectorMap, { 'ident': { type: options.source.type, id: options.source.id} });

            createConnection([source[0].scope.guid, target[0].scope.guid], target[0].options, options.type);
        }

        function onConnectorDisonnect(options) {

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

        PubSub.subscribe($rootScope, 'jsp-connector-connect', onConnectorConnect);
        PubSub.subscribe($rootScope, 'jsp-connector-disconnect', onConnectorDisonnect);

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

                function pushConnectorMap(elem) {
                    var connectorMapIndex = loDash.findIndex(connectorMap, {ident : { type: elem.ident.type, id: elem.ident.id }});

                    if(connectorMapIndex < 0) {
                        connectorMap.push(elem);
                    } else {
                        connectorMap[connectorMapIndex] = elem;
                    }
                };

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
                            id: identItem
                        }
                    };

                    pushConnectorMap(elem);

                };
            }
        };

    });
