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
    .directive('dmpEndpoint', function($rootScope, $log, $modal, $q, $timeout, $window, endpointLabel, endpointSelector, GUID, jsP, loDash, PubSub) {
        var sourceScope = null,
            elements = {},
            sourceMap = {},
            targetMap = {},
            unknownMap = {};

        // ordering of methods is roughly equivalent to the order of execution during a typical workflow

        function selectSource(scope) {

            if (sourceScope && sourceScope.$id === scope.$id && sourceScope.isSelected) {
                // clicked again, deselect
                sourceScope.isSelected = false;
                sourceScope.$digest();

                sourceScope = null;
                return;
            }

            if (sourceScope) {
                sourceScope.isSelected = false;
                sourceScope.$digest();
            }

            sourceScope = scope;

            sourceScope.isSelected = true;
            sourceScope.$digest();

        }

        function selectTarget(scope) {
            if (sourceScope === null) {
                return;
            }

            var component = {
                dropEndpoint: null,
                scope: 'schema',
                sourceId: sourceScope.guid,
                targetId: scope.guid
            };

            if (scope.projectIsMabXml()) {
                var iap = getData(elements[sourceScope.guid], sourceScope).path;

                component.sourceIsMabValue =
                    loDash(scope.project.input_data_model.schema.attribute_paths)
                        .filter(function(ap) {
                            return angular.equals(iap, loDash.map(ap.attribute_path.attributes, 'uuid'));
                        })
                        .filter(function(iap) {
                            return loDash.last(iap.attribute_path.attributes).uri === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value';
                        })
                        .first();
            }

            connectionParamPromise(component, scope).then(connectComponent, mergeComponent).then(function() {
                sourceScope.isSelected = false;
                sourceScope = null;
            });
        }

        function connectionParamPromise(component, scope) {
            return endpointSelector.connectionParamPromise(component, sourceScope, scope, elements);
        }

        function connectComponent(parameters) {
            var component = parameters.component;
            var sourceId = parameters.sourceId;
            var targetId = parameters.targetId;
            var sourceOptions = parameters.sourceOptions;
            var targetOptions = parameters.targetOptions;
            var active = parameters.active;
            var label = parameters.label;

            var connectionDefer = $q.defer();

            function handleAdditionalKeyDefs(data) {

                if(data.keyDefs.length === 0) {
                    return;
                }

                var sourceScope = loDash.find(sourceMap, function(map) {
                    return map[0].scope.guid === data.component.sourceId;
                });

                var targetScope = loDash.find(targetMap, function(map) {
                    return map[0].scope.guid === data.component.targetId;
                });

                var connectParams = {component: data.component, sourceId: data.component.sourceId, targetId: data.component.targetId, sourceOptions: sourceScope[0].opts, targetOptions: targetScope[0].opts, active: false, label: false};

                loDash.forEach(data.keyDefs, function(keyDef) {

                    connectComponent(connectParams).then(function(newConnection) {

                        delete(connectParams.component.iapId);

                        connectParams.component.keyDefs = mapKeyDefs([keyDef]);

                        endpointSelector.removeFromPool(newConnection);
                        var targetConnection = endpointSelector.getTargetFromPool(connectParams.targetId);

                        connectParams.component.connection = newConnection;

                        addInputToComponent(connectParams.component, targetConnection);

                        activate(targetConnection);
                    });

                });

            }

            function mapKeyDefs(keyDefs) {

                return loDash.map(keyDefs, function(keyDef) {

                    var kd = {};
                    loDash.forEach(keyDef, function(key) {

                        if(key.value) {
                            kd[key.attribute] = key.value;
                        }

                    });

                    return kd;
                });
            }

            function continuation(data) {

                var sourceEndpoint,
                    targetEndpoint,
                    newConnection,
                    newLabel = null,
                    newKeyDefs = null,
                    additionalKeyDefs = { keyDefs : [], component : {} };

                if (angular.isString(data)) {
                    newLabel = data;
                } else if (angular.isObject(data)) {
                    if (data.label) {
                        newLabel = data.label;
                    }
                    if (data.keyDefs) {
                        newKeyDefs = data.keyDefs;
                    }
                }

                //create endpoint
                sourceEndpoint = jsP.addEndpoint(elements[sourceId], sourceOptions);
                targetEndpoint = jsP.addEndpoint(elements[targetId], targetOptions);

                //link it
                newConnection = jsP.connect(sourceEndpoint, targetEndpoint);

                jsP.on('click', onClick);
                jsP.on('dblclick', onDoubleClick);

                if (component.mappingId) {
                    newConnection.mappingId = component.mappingId;
                }

                if (newLabel !== null) {
                    endpointLabel.set(newConnection, newLabel);
                }

                if (newKeyDefs !== null) {
                    newConnection.keyDefs = mapKeyDefs(newKeyDefs.splice(0,1));


                    if(newKeyDefs.length > 0) {
                        additionalKeyDefs = {
                            keyDefs : newKeyDefs,
                            component :component
                        };
                    }

                }

                if (active) {
                    activate(newConnection);
                }

                component.connection = newConnection;

                connectionDefer.resolve(newConnection);

                return additionalKeyDefs;
            }

            if (label === true) {
                var labelPromise;
                if (component.sourceIsMabValue) {
                    labelPromise = endpointLabel.askWithKeys([{
                        attribute: 'http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld\u001ehttp://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr',
                        display: 'nr',
                        value: ''
                    }, {
                        attribute: 'http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld\u001ehttp://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind',
                        display: 'ind',
                        value: ''
                    }]);
                } else {
                    labelPromise = endpointLabel.ask();
                }
                labelPromise.then(continuation, connectionDefer.reject).then(handleAdditionalKeyDefs);
            } else if (typeof label === 'string') {
                continuation(label);
            } else {
                continuation(null);
            }

            return connectionDefer.promise;
        }

        function mergeComponent(parameters) {
            var connectParams = angular.extend({}, parameters, {
                active: false,
                label: false
            });

            connectComponent(connectParams).then(function(newConnection) {

                endpointSelector.removeFromPool(newConnection);
                var targetConnection = endpointSelector.getFromPool(parameters.mergeTo[0].id);

                addInputToComponent(parameters.component, targetConnection);
                activate(newConnection);
            });
        }

        function addInputToComponent(newInputComponent, baseComponent) {

            if(loDash.isUndefined(newInputComponent.iapId)) {
                newInputComponent.iapId = GUID.uuid4();
            }

            newInputComponent.connection.setLabel(' ');
            var labelOverlay = newInputComponent.connection.getLabelOverlay();
            labelOverlay.addClass('mapping-label');

            if (!baseComponent.additionalInput) {
                baseComponent.additionalInput = [];
            }

            baseComponent.additionalInput.push(newInputComponent);

        }

        function activate(connection, dontFire, click) {
            var conn = endpointSelector.activate(connection);
            if (conn && !dontFire) {

                var name = conn.getLabel(),
                    source = getData(conn.source),
                    target = getData(conn.target);

                PubSub.broadcast('connectionSelected', {
                    internal_id: source.id + ':' + target.id,
                    connection_id: conn.id,
                    mapping_id: conn.mappingId,
                    name: name,
                    inputAttributePath: source,
                    outputAttributePath: target,
                    keyDefs: conn.keyDefs || [],
                    additionalInput: getDatas(conn.additionalInput),
                    click: click
                });
            }
        }

        function getData(c, cScope) {
            var scp = cScope || angular.element(c).scope(),
                parentName = scp.parentName,
                data;

            if (scp.data) {
                data = {
                    uuid: scp.data.uuid,
                    name: scp.data.name,
                    path: realPath([], scp)
                };
            } else {
                data = c;
            }

            if (parentName) {
                data.parentName = parentName;
            }

            return data;
        }

        function getDatas(c) {

            return loDash.map(c, function(data) {

                return angular.extend(getData(data.connection.source), {
                    iapId : data.iapId,
                    keyDefs: data.keyDefs
                });
            });
        }

        function realPath(segments, scp) {
            if (angular.isUndefined(scp.data)) {
                return segments;
            }

            var lastSegment = segments[0],
                currentSegment = scp.data && scp.data.uuid;

            if (!currentSegment || currentSegment === lastSegment) {
                return realPath(segments, scp.$parent);
            }

            return realPath([currentSegment].concat(segments), scp.$parent);
        }


        // === Callbacks ===

        var waitForDoubleClick = true;
        var doubleClickSpeed = 300;
        var delayedClick;

        function cancelDelayedClick(event) {
            $timeout.cancel(delayedClick);
            waitForDoubleClick = true;
            delayedClick = null;
            event.target.style.cursor = 'pointer';
        }

        function onClick(component, event) {
            if (component.scope === 'schema') {
                if (waitForDoubleClick) {
                    waitForDoubleClick = false;
                    event.target.style.cursor = 'progress';
                    delayedClick = $timeout(function() {
                        if (!waitForDoubleClick) {
                            cancelDelayedClick(event);
                            executeOnClick(component, event);
                        }
                    }, doubleClickSpeed);
                }
            }
        }

        function executeOnClick(component, event) {
            switch (event.target.tagName) {
                case 'DIV':
                case 'path': // fall through
                    activate(component, false, true);
                    break;
            }
        }

        function onDoubleClick(component, event) {
            if (component.scope === 'schema' && event.target.tagName === 'DIV') {
                cancelDelayedClick(event);
                var labelPromise = endpointLabel.ask('Rename this mapping', undefined, undefined, undefined, {label: endpointLabel.get(component)});
                labelPromise.then(function(label) {
                    $log.info('new label', label);
                    if (label.label) {
                        endpointLabel.set(component, label.label);
                        activate(component, false, true);
                    }
                });
            }
        }

        function onProjectDiscarded() {
            endpointSelector.foreach(function(component) {

                removePlumbs(component);

                angular.forEach(component.additionalInput, function(additionalInput) {
                    removePlumbs(additionalInput.connection);
                });
            });
            endpointSelector.reset();

            init();
        }

        function removePlumbs(connection) {

            angular.forEach(connection.endpoints, function(endpoint) {
                jsP.deleteEndpoint(endpoint);
            });

            jsP.detachAll($(connection.source));
        }

        function onPaintPlumbs(mappings) {

            endpointSelector.reset();

            angular.forEach(mappings, function(mapping) {

                var additionalInputPath = false;

                angular.forEach(mapping.input_attribute_paths, function(input_attribute_path) {

                    var inputScopes = sourceMap[input_attribute_path.attribute_path.uuid] || [],
                        outputScopes = targetMap[mapping.output_attribute_path.attribute_path.uuid] || [];

                    angular.forEach(inputScopes, function(inputScope) {
                        angular.forEach(outputScopes, function(outputScope) {
                            var component = {
                                dropEndpoint: null,
                                scope: 'schema',
                                sourceId: inputScope.scope.guid,
                                targetId: outputScope.scope.guid,
                                mappingId: mapping.uuid,
                                iapId: input_attribute_path.uuid
                            };

                            if (!additionalInputPath) {
                                connectComponent({component: component, sourceId: component.sourceId, targetId: component.targetId, sourceOptions: inputScope.opts, targetOptions: outputScope.opts, active: true, label: mapping.name});
                            } else {

                                var connectParams = {component: component, sourceId: component.sourceId, targetId: component.targetId, sourceOptions: inputScope.opts, targetOptions: outputScope.opts, active: false, label: false};

                                connectComponent(connectParams).then(function(newConnection) {

                                    endpointSelector.removeFromPool(newConnection);
                                    var targetConnection = endpointSelector.getTargetFromPool(connectParams.targetId);

                                    connectParams.component.connection = newConnection;

                                    addInputToComponent(connectParams.component, targetConnection);
                                    activate(targetConnection);
                                });


                            }
                        });
                    });

                    additionalInputPath = true;

                });

            });


        }

        function onSchemaCanvasUpdated() {

            //$rootScope.$digest();
            jsP.repaintEverything();

            // Second run needed because jsPlumb
            // sometimes not recognizing elements
            // to rerender *sigh*
            jsP.repaintEverything();

        }

        function onConnectionSwitched(data) {

            var connection = endpointSelector.getFromPool(data.id);
            if (connection) {
                activate(connection, true);
            }
        }

        PubSub.subscribe($rootScope, ['projectDraftDiscarded', 'changeOutputModel', 'restoreCurrentProject'], onProjectDiscarded);
        PubSub.subscribe($rootScope, 'paintPlumbs', onPaintPlumbs);
        PubSub.subscribe($rootScope, 'schemaCanvasUpdated', onSchemaCanvasUpdated);
        PubSub.subscribe($rootScope, 'connectionSwitched', onConnectionSwitched);

        function findParent(scope, decider) {
            if (decider(scope)) {
                return scope;
            }
            if (scope.$parent) {
                return findParent(scope.$parent, decider);
            }
            return null;
        }

        // init
        function init() {
            sourceMap = {};
            targetMap = {};

            jsP.reset();
        }

        $rootScope.$on('$locationChangeStart', init);

        init();

        return {
            scope: true,
            restrict: 'A',
            replace: true,
            compile: function(tElement, tAttrs) {
                var jspSourceOpts = tAttrs['jspSourceOptions'] || tAttrs['jsPlumbSourceOptions'],
                    jspSourceOptsWatch = function(scope) {
                        return scope.$eval(jspSourceOpts);
                    },
                    jspTargetOpts = tAttrs['jspTargetOptions'] || tAttrs['jsPlumbTargetOptions'],
                    jspTargetOptsWatch = function(scope) {
                        return scope.$eval(jspTargetOpts);
                    },
                    isDisabledOpt = tAttrs['dmpEndpointDisabled'],
                    isEnabledWatch = function(scope) {
                        return !scope.$eval(isDisabledOpt);
                    };

                return function(scope, iElement) {
                    var isEnabled = isEnabledWatch(scope),
                        sourceOpts = jspSourceOptsWatch(scope),
                        targetOpts = jspTargetOptsWatch(scope),
                        isSource = isEnabled && !!sourceOpts,
                        isTarget = isEnabled && !!targetOpts;

                    if (!isEnabled) {
                        return;
                    }

                    scope.guid = GUID.uuid4();
                    iElement.attr('id', scope.guid);

                    elements[scope.guid] = iElement;

                    if (isSource) {

                        // jsP.makeSource(iElement, null, sourceOpts);
                        // jsP.unmakeTarget(iElement);

                        iElement.bind('click', function() {
                            selectSource(scope);
                        });
                    }

                    if (isTarget) {

                        // jsP.unmakeSource(iElement);
                        // jsP.makeTarget(iElement, null, targetOpts);

                        iElement.bind('click', function() {
                            selectTarget(scope);
                        });
                    }

                    var parentScope = findParent(scope, function(scp) {
                        return scp.data && angular.isDefined(scope.data._$path_id);
                    });

                    if (parentScope) {
                        var elem = {
                            scope: scope,
                            opts: isSource ? sourceOpts : targetOpts
                        };
                        var push = function(map) {
                            var scopes = map[parentScope.data._$path_id] || [];
                            scopes.push(elem);
                            map[parentScope.data._$path_id] = scopes;
                        };

                        if (isSource === true) {
                            push(sourceMap);
                        } else if (isTarget === true) {
                            push(targetMap);
                        } else {
                            push(unknownMap);
                        }
                    }
                };
            }
        };
    });
