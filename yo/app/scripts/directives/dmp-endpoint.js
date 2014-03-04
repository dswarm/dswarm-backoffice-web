'use strict';

angular.module('dmpApp')
    .directive('dmpEndpoint', function ($compile, $window, $rootScope, $modal, $q, jsP, GUID, Util, loDash, PubSub) {
        var components = {
                active: null,
                pool: []
            },
            sourceScope = null,
            elements = {},
            sourceMap = {},
            targetMap = {},
            unknownMap = {};

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

                if(!connection.mappingId) {
                    connection.mappingId =  new Date().getTime()*-1;
                }

                if (!dontFire) {
                    PubSub.broadcast('connectionSelected', {
                        internal_id : source.id + ':' + target.id,
                        connection_id : connection.id,
                        mapping_id : connection.mappingId,
                        name: name,
                        inputAttributePath: source,
                        outputAttributePath: target,
                        additionalInput : getDatas(connection.additionalInput)
                    });
                }

            }

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

        function addSource(scope) {

            if (sourceScope && sourceScope.$id === scope.$id && sourceScope.isSelected) {
                // clicked again, deselect
                sourceScope.isSelected = false;
                sourceScope = null;
                return;
            }

            if (sourceScope) {
                sourceScope.isSelected = false;
            }

            sourceScope = scope;

            sourceScope.isSelected = true;
        }

        function addTarget(scope) {
            if (sourceScope === null) {
                return;
            }

            var component = {
                dropEndpoint: null,
                scope: 'schema',
                sourceId: sourceScope.guid,
                targetId: scope.guid
            };

            connectionParamPromise(component, scope).then(connectComponent, mergeComponent).then(function() {
                sourceScope.isSelected = false;
                sourceScope = null;
            });
        }

        function askForEndpoint(component) {

            var modalInstance = $modal.open({
                templateUrl: 'views/modals/dmp-endpoint-selector.html',
                controller: 'DmpEndpointSelectorCtrl',
                resolve: {
                    endpointSet: function () {
                        return getTargetPoolComponents(component);
                    }
                }
            });

            return modalInstance.result;
        }

        function connectionParamPromise(component, scope) {
            var defer = $q.defer();
            var baseParams = {
                component: component,
                sourceId: sourceScope.guid,
                targetId: scope.guid,
                sourceOptions: scope.jspSourceOptions,
                targetOptions: scope.jspTargetOptions
            };

            if (isTargetInPool(component)) {

                askForEndpoint(component).then(function (target) {

                    if (target !== null) {
                        defer.reject(angular.extend({mergeTo: target}, baseParams));
                    } else {
                        defer.resolve(angular.extend({active: true, label: true}, baseParams));
                    }
                });
            } else {
                defer.resolve(angular.extend({active: true, label: true}, baseParams));
            }

            return defer.promise;
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

            function continuation(label) {

                var sourceEndpoint,
                    targetEndpoint,
                    newConnection;

                //create endpoint
                sourceEndpoint = jsP.addEndpoint(elements[sourceId], sourceOptions);
                targetEndpoint = jsP.addEndpoint(elements[targetId], targetOptions);

                //link it
                newConnection = jsP.connect(sourceEndpoint, targetEndpoint);

                if(component.mappingId) {
                    newConnection.mappingId = component.mappingId;
                }

                if (label !== null) {

                    setLabel(newConnection, label);
                }

                if(active) {
                    activate(newConnection);
                }

                component.connection = newConnection;

                connectionDefer.resolve(newConnection);
            }

            if(label === true) {
                reLabel().then(continuation, loDash.bind(connectionDefer.reject, connectionDefer));
            } else if(typeof label === 'string') {
                continuation(label);
            } else {
                continuation(null);
            }

            return connectionDefer.promise;
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

        function deSelectAll() {
            var active = components.active;
            angular.forEach(components.pool, function(comp) {
                if (comp !== active) {
                    deSelect(comp);
                }
            });
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

        function findInPool(selector) {

            return loDash.find(components.pool, selector);
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

        function getDatas(c) {

            return loDash.map(c, function(data) {
                return getData(data.connection.source);
            });
        }

        function getPoolEntryById(id) {

            return findInPool({id: id});
        }

        function getTargetPoolComponents(component) {

            return Util.collect(components.pool, function(poolEntry) {
                if(component.targetId === poolEntry.targetId) {

                    var sourceScope = elements[component.sourceId].scope();
                    var targetScope = elements[component.targetId].scope();

                    return {
                        id : poolEntry.id,
                        label: poolEntry.getLabel(),
                        sourceName: sourceScope.data.name,
                        sourceData: sourceScope.data,
                        targetName : targetScope.data.name,
                        targetData : targetScope.data
                    };
                }
                return null;
            });

        }

        function getTargetConnectionFromPool(component) {

            return findInPool({targetId: component.targetId});
        }

        function isConnectionAdditionalInput(connection) {

            return !!findInPool(function(poolEntry) {
                return angular.isDefined(loDash.find(poolEntry.additionalInput || [], {connection: connection}));
            });
        }

        function isTargetInPool(component) {

            return !!getTargetConnectionFromPool(component);
        }

        function isLabelValid(label) {
            return angular.isString(label) && label.length >= 5;
        }

        function mergeComponent(parameters) {
            var connectParams = angular.extend({}, parameters, {
                active: false,
                label: false
            });

            connectComponent(connectParams).then(function(newConnection) {

                var targetConnection = getPoolEntryById(parameters.mergeTo[0].id);

                removeFromPool(newConnection);
                addInputToComponent(parameters.component, targetConnection);
                activate(newConnection);
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

        function reLabel(promptText, helpText) {
            var text = promptText || 'Name this connection',
                help = helpText || 'The name has to be at least 5 characters long';

            var labelDefer = $q.defer();

            var modalInstance = $modal.open({
                templateUrl: 'views/modals/re-label-connection.html',
                controller: ['$scope', function($scope) {
                    $scope.text = text;
                    $scope.help = help;

                    $scope.isValid = function(label) {
                        return isLabelValid(label);
                    };

                    $scope.close = function(label) {
                        if (isLabelValid(label)) {
                            $scope.$close(label);
                        }
                    };
                }]
            });

            modalInstance.result.then(function (label) {

                if (isLabelValid(label)) {
                    labelDefer.resolve(label);
                } else {
                    labelDefer.reject('invalid');
                }
            }, function (reason) {

                labelDefer.reject(reason);
            });



            return labelDefer.promise;
        }

        function removeFromPool(connection) {

            components.pool = loDash.filter(components.pool, function(poolEntry) {
                return connection !== poolEntry;
            });
        }

        function setColor(connection, color) {
            connection.endpoints[0].setPaintStyle({fillStyle: color});
            connection.setPaintStyle({strokeStyle: color});
        }

        function setLabel(connection, label) {
            connection.setLabel(label);

            var labelOverlay = connection.getLabelOverlay();
            labelOverlay.addClass('mapping-label');
        }


        // === Callbacks ===

        function onBeforeDrop(component) {

            // When is this executed? That is, when gets beforeDrop fired?

            if (isTargetInPool(component)) {

                var modalInstance = $modal.open({
                    templateUrl: 'views/modals/dmp-endpoint-selector.html',
                    controller: 'DmpEndpointSelectorCtrl'
                });

                modalInstance.result.then(function (target) {

                    var newConnection = null;

                    if (target === null) {

                        newConnection = jsP.connect($('#' + component.sourceId), $('#' + component.targetId));
                        newConnection.setLabel(' ');

                        component.connection = newConnection;

                        reLabel().then(function(label){
                            setLabel(component.connection, label);
                        });

                        activate(component.connection, true);


                    } else {

                        var targetConnection = getTargetConnectionFromPool(component);

                        newConnection = jsP.connect($('#' + component.sourceId), $('#' + component.targetId));
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
                    reLabel().then(function(label){
                        setLabel(component.connection, label);
                    });
                }

            }

            return true;

        }

        function onConnection(component) {

            if (component.scope === 'schema' || component.connection.scope === 'schema') {
                activate(component.connection);
            }
        }

        function onClick(component, event) {

            if (component.scope === 'schema') {
                switch (event.target.tagName) {

                    case 'DIV':
                    case 'path': // fall through
                        activate(component);
                        break;
                }
            }
        }

        function onProjectDiscarded() {
            angular.forEach(components.pool, function (component) {
                angular.forEach(component.endpoints, function (endpoint) {
                    jsP.deleteEndpoint(endpoint);
                });

                jsP.detachAll($(component.source));
            });

            components.pool = [];
        }

        function onPaintPlumbs(mappings) {

            components.pool = [];

            angular.forEach(mappings, function (mapping) {

                var inputScopes = sourceMap[mapping.input_attribute_paths[0].id] || [],
                    outputScopes = targetMap[mapping.output_attribute_path.id] || [];

                angular.forEach(inputScopes, function (inputScope) {
                    angular.forEach(outputScopes, function (outputScope) {
                        var component = {
                            dropEndpoint: null,
                            scope: 'schema',
                            sourceId: inputScope.scope.guid,
                            targetId: outputScope.scope.guid,
                            mappingId: mapping.id
                        };

                        connectComponent({component: component, sourceId: inputScope.scope.guid, targetId: outputScope.scope.guid, sourceOptions: inputScope.opts, targetOptions: outputScope.opts, active: true, label: mapping.name});
                    });
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
        }

        jsP.on('beforeDrop', onBeforeDrop);
        jsP.on('connection', onConnection);
        jsP.on('click', onClick);

        PubSub.subscribe($rootScope, ['projectDraftDiscarded', 'changeOutputModel'], onProjectDiscarded);
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

        return {
            scope: true,
            restrict: 'A',
            replace: true,
            compile: function (tElement, tAttrs) {
                var jspSourceOpts = tAttrs['jspSourceOptions'] || tAttrs['jsPlumbSourceOptions'],
                    jspSourceOptsWatch = function(scope) {
                        return scope.$eval(jspSourceOpts);
                    },
                    jspTargetOpts = tAttrs['jspTargetOptions'] || tAttrs['jsPlumbTargetOptions'],
                    jspTargetOptsWatch = function(scope) {
                        return scope.$eval(jspTargetOpts);
                    };

                return function(scope, iElement) {
                    var sourceOpts = jspSourceOptsWatch(scope),
                        targetOpts = jspTargetOptsWatch(scope),
                        isSource = !!sourceOpts,
                        isTarget = !!targetOpts;

                    scope.guid = GUID.uuid4();
                    iElement.attr('id', scope.guid);

                    elements[scope.guid] = iElement;

                    if(isSource) {

                        // jsP.makeSource(iElement, null, sourceOpts);
                        // jsP.unmakeTarget(iElement);

                        iElement.bind('click', function() {
                            addSource(scope);
                        });
                    }

                    if(isTarget) {

                        // jsP.unmakeSource(iElement);
                        // jsP.makeTarget(iElement, null, targetOpts);

                        iElement.bind('click', function() {
                            addTarget(scope);
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
