'use strict';

angular.module('dmpApp')
    .directive('dmpEndpoint', ['$compile', '$window', '$rootScope', '$modal', 'jsP', 'GUID', 'Lo-Dash', 'PubSub', function ($compile, $window, $rootScope, $modal, jsP, GUID, loDash, PubSub) {
        var components = {
                active: null,
                pool: []
            },
            sourceEndpoint = null;


        function addTarget(scope) {

            var targetDone = false;

            PubSub.subscribe($rootScope, 'returnDmpSource', function(payload) {

                if(!targetDone) {

                    var component = {
                            dropEndpoint : null,
                            scope : 'schema',
                            sourceId : payload.source,
                            targetId : scope.guid
                        };

                    if(isTargetInPool(component)) {

                        var modalInstance = $modal.open({
                            templateUrl: 'views/directives/dmp-endpoint-selector.html',
                            controller: 'DmpEndpointSelectorCtrl',

                            resolve: {
                                endpointSet: function () {
                                    return getTargetPoolComponents(component);
                                }
                            }
                        });


                        modalInstance.result.then(function (target) {

                            if(target === null) {

                                connectComponent(component, payload.source, scope.guid, scope.jspSourceOptions, scope.jspTargetOptions, false, false);

                            } else {

                                var newConnection = connectComponent(component, payload.source, scope.guid, scope.jspSourceOptions, scope.jspTargetOptions, true, true);

                                var targetConnection = getPoolEntrybyId(target[0].id);

                                removeFromPool(newConnection);
                                addInputToComponent(component, targetConnection);

                                activate(newConnection);

                            }

                        });

                    } else {
                        connectComponent(component, payload.source, scope.guid, scope.jspSourceOptions, scope.jspTargetOptions, false, false);
                    }



                    targetDone = true;
                    sourceEndpoint = null;

                }

            });

            PubSub.broadcast('getDmpSource');

        }

        function connectComponent(component, sourceId, targetId, sourceOptions, targetOptions, noActivate, noReLabel) {

            var targetEndpoint,
                newConnection;

            //create endpoint
            sourceEndpoint = jsP.addEndpoint($('#'+ sourceId), sourceOptions);
            targetEndpoint = jsP.addEndpoint($('#'+ targetId), targetOptions);

            //link it
            newConnection = jsP.connect(sourceEndpoint, targetEndpoint );

            newConnection.setLabel(' ');
            component.connection = newConnection;

            if(noReLabel === false) {
                reLabel(component.connection);
            }

            if(typeof noReLabel === "string") {
                newConnection.setLabel(noReLabel);

                var labelOverlay = newConnection.getLabelOverlay();
                labelOverlay.addClass('mapping-label');
            }

            if(!noActivate) {
                activate(component.connection);
            }

            return newConnection;

        }

        function addSource(scope) {
            sourceEndpoint = scope.guid;
        }

        PubSub.subscribe($rootScope, 'getDmpSource', function() {

            PubSub.broadcast('returnDmpSource', {
                source : sourceEndpoint
            });

        });


        function setColor(connection, color) {
            connection.endpoints[0].setPaintStyle({fillStyle: color});
            connection.setPaintStyle({strokeStyle: color});
        }

        function deSelect(connection) {
            setColor(connection, 'black');

            angular.forEach(connection.additionalInput, function(additionalInputEntry) {
                setColor(additionalInputEntry.connection, 'black');
            });

            if(connection.getLabelOverlay()) {
                connection.getLabelOverlay().removeClass('mapping-active');
            }
            connection.getConnector().removeClass('mapping-active');
        }

        function doSelect(connection) {
            setColor(connection, 'red');

            angular.forEach(connection.additionalInput, function(additionalInputEntry) {
                setColor(additionalInputEntry.connection, 'red');
            });

            if(connection.getLabelOverlay()) {
                connection.getLabelOverlay().addClass('mapping-active');
            }
            connection.getConnector().addClass('mapping-active');

        }

        function deSelectAll() {
            var active = components.active;
            angular.forEach(components.pool, function(comp) {
                if (comp !== active) {
                    deSelect(comp);
                }
            });
        }

        function realPath(segments, scp) {
            if (angular.isUndefined(scp.data) || scp.data.name === 'record') {
                return segments;
            }

            var lastSegment = segments[0],
                currentSegment = scp.data && scp.data.id;

            if (!currentSegment || currentSegment === lastSegment) {
                return realPath(segments, scp.$parent);
            }

            return realPath([currentSegment].concat(segments), scp.$parent);
        }

        function getDatas(c) {

            return loDash.map(c, function(data) {
                return getData(data.connection.source);
            });
        }

        function getData(c) {
            var scp = angular.element(c).scope(),
                parentName = scp.parentName,
                data;

            if (scp.data) {
                data = {
                    id: scp.data.id,
                    name: scp.data.name,
                    path: realPath([], scp)
                };
            } else {
                data = c;
            }

            if(parentName) {
                data.parentName = parentName;
            }

            return data;
        }

        function isConnectionAdditionalInput(connection) {

            var connectionIsAdditionalInput = false;

            angular.forEach(components.pool, function(poolEntry) {
                if(poolEntry.additionalInput) {
                    angular.forEach(poolEntry.additionalInput, function(additionalInputEntry) {
                        if(connection === additionalInputEntry.connection) {
                            connectionIsAdditionalInput = true;
                        }
                    });
                }
            });

            return connectionIsAdditionalInput;
        }

        //noinspection FunctionWithInconsistentReturnsJS
        function activate(connection, dontFire) {

            if(connection.getLabel() === null) {
                return true;
            }

            if(isConnectionAdditionalInput(connection)) {
                activate(getTargetConnectionFromPool(connection));
            } else {

                if (components.pool.indexOf(connection) === -1) {
                    components.pool.push(connection);
                }

                components.active = connection;
                deSelectAll();
                doSelect(connection);

                var name = connection.getLabel(),
                    source = getData(connection.source),
                    target = getData(connection.target);

                if (!dontFire) {
                    PubSub.broadcast('connectionSelected', {
                        internal_id : source.id + ':' + target.id,
                        connection_id : connection.id,
                        name: name,
                        inputAttributePath: source,
                        outputAttributePath: target,
                        additionalInput : getDatas(connection.additionalInput)
                    });
                }

            }

        }

        function reLabel(connection, callback, promptText) {
            var text = promptText || 'Name this connection'
                , label = $window.prompt(text)
                , valid = label && label.length && label.length >= 5;

            if (valid) {
                connection.setLabel(label);
                var labelOverlay = connection.getLabelOverlay();
                labelOverlay.addClass('mapping-label');

                if (callback) {
                    callback(connection, label);
                }
            }

            return valid;
        }

        function addInputToComponent(newInputComponent, baseComponent) {

            newInputComponent.connection.setLabel(' ');
            var labelOverlay = newInputComponent.connection.getLabelOverlay();
            labelOverlay.addClass('mapping-label');

            if(!baseComponent.additionalInput) {
                baseComponent.additionalInput = [];
            }

            baseComponent.additionalInput.push(newInputComponent);

        }

        function isTargetInPool(component) {

            var targetIsInPool = false;

            angular.forEach(components.pool, function(poolEntry) {

                if(component.targetId === poolEntry.targetId) {
                    targetIsInPool = true;
                }

            });

            return targetIsInPool;

        }

        function getPoolEntrybyId(id) {

            var returnPoolEntry = null;

            angular.forEach(components.pool, function(poolEntry) {

                if(id === poolEntry.id) {
                    returnPoolEntry = poolEntry;
                }

            });

            return returnPoolEntry;

        }

        function getTargetPoolComponents(component) {

            var poolComponents = [];

            angular.forEach(components.pool, function(poolEntry) {

                if(component.targetId === poolEntry.targetId) {

                    var targetScope = angular.element(poolEntry.target).scope();

                    poolComponents.push({
                        id : poolEntry.id,
                        targetName : targetScope.data.name,
                        targetData : targetScope.data
                    });
                }

            });

            return poolComponents;

        }

        function getTargetConnectionFromPool(component) {

            var tempReturn = null;

            angular.forEach(components.pool, function(poolEntry) {

                if(component.targetId === poolEntry.targetId) {
                    tempReturn = poolEntry;
                }

            });

            return tempReturn;

        }

        function removeFromPool(connection) {

            var workPool = [];

            angular.forEach(components.pool, function(poolEntry) {

                if(connection !== poolEntry) {
                    workPool.push(poolEntry);
                }

            });

            components.pool = workPool;

        }


        jsP.on('beforeDrop', function(component) {

            if(isTargetInPool(component)) {

                var modalInstance = $modal.open({
                    templateUrl: 'views/directives/dmp-endpoint-selector.html',
                    controller: 'DmpEndpointSelectorCtrl'
                });

                modalInstance.result.then(function (target) {

                    var newConnection = null;

                    if(target === null) {

                        newConnection = jsP.connect($('#'+component.sourceId), $('#'+component.targetId));
                        newConnection.setLabel(' ');

                        component.connection = newConnection;

                        reLabel(component.connection);

                        activate(component.connection, true);


                    } else {

                        var targetConnection = getTargetConnectionFromPool(component);

                        newConnection = jsP.connect($('#'+component.sourceId), $('#'+component.targetId));
                        newConnection.setLabel(' ');

                        removeFromPool(newConnection);

                        component.connection = newConnection;

                        addInputToComponent(component, targetConnection);

                        activate(targetConnection);

                    }

                }, function () {

                    return false;

                });

                return false;

            } else {

                if (component.scope === 'schema') {
                    return reLabel(component.connection);
                }

            }

            return true;

        });
        jsP.on('connection', function(component) {

            if (component.scope === 'schema' || component.connection.scope === 'schema') {
                activate(component.connection);
            }


        });
        jsP.on('click', function(component, event) {

            if (component.scope === 'schema') {
                switch (event.target.tagName) {

                case 'DIV':
                    //        var text = ['Rename this', ' component from "', component.getLabel(), '"'];
                    //        if (components.active === component) {
                    //          text.splice(1, 0, ', currently active,');
                    //        }
                    //        reLabel(component, function(connection, label) {
                    //          PubSub.broadcast('connectionRenamed', {
                    //            id: connection.id,
                    //            label: label
                    //          });
                    //        }, text.join(''));
                    activate(component);
                    break;

                case 'path':
                    activate(component);
                    break;

                }
            }
        });

        PubSub.subscribe($rootScope, 'projectDraftDiscarded', function () {
            angular.forEach(components.pool, function(component) {
                angular.forEach(component.endpoints, function(endpoint) {
                   jsP.deleteEndpoint(endpoint);
                });

                jsP.detachAll($(component.source));
            });
        });

        PubSub.subscribe($rootScope, 'paintPlumbs', function (mappings) {

            angular.forEach(mappings, function(mapping) {

                var inputComponent,
                    outputComponent;

                angular.forEach($('.jsPanchorSource .jsPanchor.ng-isolate-scope'), function(elem) {

                    var scp = angular.element(elem).scope();

                    if(scp.child && scp.child.id && scp.child.id === mapping.input_attribute_paths[0].attributes[0].id) {
                        inputComponent = angular.element($(elem).find('i.jsPanchorIcon').first()).scope();
                    }

                });

                angular.forEach($('.jsPanchorTarget .jsPanchor.ng-isolate-scope'), function(elem) {

                    var scp = angular.element(elem).scope();

                    if(scp.child && scp.child.id && scp.child.id === mapping.output_attribute_path.attributes[0].id) {
                        outputComponent = angular.element($(elem).find('i.jsPanchorIcon').first()).scope();
                    }

                });

                var component = {
                    dropEndpoint : null,
                    scope : 'schema',
                    sourceId : inputComponent.guid,
                    targetId : outputComponent.guid
                };


                connectComponent(component, inputComponent.guid, outputComponent.guid, inputComponent.jspSourceOptions, outputComponent.jspTargetOptions, false, mapping.name);

            });


        });

        PubSub.subscribe($rootScope, 'schemaCanvasUpdated', function () {

            //$rootScope.$digest();
            jsP.repaintEverything();

            // Second run needed because jsPlumb
            // sometimes not recognizing elements
            // to rerender *sigh*
            jsP.repaintEverything();

        });


        PubSub.subscribe($rootScope, 'connectionSwitched', function (data) {
            var pool = components.pool
                , i = 0
                , id = data.id
                , connection
                , found;

            for (; !found && (connection = pool[i++]);) {
                if (connection.id === id) {
                    found = connection;
                }
            }

            if (found) {
                activate(found, true);
            }
        });

        return {
            scope: true,
            restrict: 'A',
            replace: true,
            compile: function (tElement, tAttrs) {
                var asSource = tAttrs['source']
                    , asSourceWatch = function(scope) {
                        return scope.$eval(asSource);
                    }
                    , asTarget = tAttrs['target']
                    , asTargetWatch = function(scope) {
                        return scope.$eval(asTarget);
                    }
                    , jspSourceOpts = tAttrs['jspSourceOptions'] || tAttrs['jsPlumbSourceOptions']
                    , jspSourceOptsWatch = function(scope) {
                        return scope.$eval(jspSourceOpts);
                    }
                    , jspTargetOpts = tAttrs['jspTargetOptions'] || tAttrs['jsPlumbTargetOptions']
                    , jspTargetOptsWatch = function(scope) {
                        return scope.$eval(jspTargetOpts);
                    };

                return function(scope, iElement, iAttrs) {
                    var sourceOpts = jspSourceOptsWatch(scope) || {}
                        , targetOpts = jspTargetOptsWatch(scope) || {};

                    scope.guid = GUID.uuid4();
                    $(iElement).attr('id', scope.guid);

                    if(jspSourceOptsWatch(scope)) {

                        iElement.bind('click', function() {
                            addSource(angular.element(iElement).scope());
                        });

                    }

                    if(jspTargetOptsWatch(scope)) {

                        iElement.bind('click', function() {
                            addTarget(angular.element(iElement).scope());
                        });

                    }

                    scope.$watch(asSourceWatch, function (isSource) {
                        if (isSource) {
                            jsP.makeSource(iElement, iAttrs, sourceOpts);
                        } else {
                            jsP.unmakeSource(iElement);
                        }
                    });
                    scope.$watch(asTargetWatch, function (isTarget) {
                        if (isTarget) {
                            jsP.makeTarget(iElement, iAttrs, targetOpts);
                        } else {
                            jsP.unmakeTarget(iElement);
                        }
                    });
                };
            }
        };
    }]);
