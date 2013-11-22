'use strict';

angular.module('dmpApp')
    .directive('dmpEndpoint', ['$compile', '$window', '$rootScope', '$modal', 'jsP', 'PubSub', function ($compile, $window, $rootScope, $modal, jsP, PubSub) {
        var components = {
            active: null,
            pool: []
        };

        function setColor(connection, color) {
            connection.endpoints[0].setPaintStyle({fillStyle: color});
            connection.setPaintStyle({strokeStyle: color});
        }

        function deSelect(connection) {
            setColor(connection, 'black');

            angular.forEach(connection.additionalInput, function(additional_input_entry) {
                setColor(additional_input_entry.connection, 'black');
            });

            connection.getLabelOverlay().removeClass('mapping-active');
            connection.getConnector().removeClass('mapping-active');
        }
        function doSelect(connection) {
            setColor(connection, 'red');

            angular.forEach(connection.additionalInput, function(additional_input_entry) {
                setColor(additional_input_entry.connection, 'red');
            });

            connection.getLabelOverlay().addClass('mapping-active');
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
                return segments.join('.');
            }

            var lastSegment = segments[0]
                , currentSegment = scp.data && scp.data.name;

            if (!currentSegment || currentSegment === lastSegment) {
                return realPath(segments, scp.$parent);
            }

            return realPath([currentSegment].concat(segments), scp.$parent);
        }

        function getData(c) {
            var scp = angular.element(c).scope(),
                data = scp.data,
                parentName = scp.parentName;

            if(data) {
                data.path = realPath([], scp);
            } else {
                data = c;
            }

            if(parentName) {
                data.parentName = parentName;
            }

            data.resourceId = scp.resId;
            data.configurationId = scp.confId;
            return data;
        }

        function isConnectionAdditionalInput(connection) {

            var connectionIsAdditionalInput = false;

            angular.forEach(components.pool, function(pool_entry) {
                if(pool_entry.additionalInput) {
                    angular.forEach(pool_entry.additionalInput, function(additional_input_entry) {
                        if(connection === additional_input_entry.connection) {
                            connectionIsAdditionalInput = true;
                        }
                    });

                }
            });

            return connectionIsAdditionalInput;
        }

        function activate(connection, dontFire) {

            if(isConnectionAdditionalInput(connection)) {
                activate(getTargetConnectionFromPool(connection));
            } else {

                if (components.pool.indexOf(connection) === -1) {
                    components.pool.push(connection);
                }

                components.active = connection;
                deSelectAll();
                doSelect(connection);

                var label = connection.getLabel()
                    , id = connection.id;

                if (!dontFire) {
                    PubSub.broadcast('connectionSelected', {
                        id: id,
                        label: label,
                        sourceData: getData(connection.source),
                        targetData: getData(connection.target)
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

            newInputComponent.connection.setLabel("");
            var labelOverlay = newInputComponent.connection.getLabelOverlay();
            labelOverlay.addClass('mapping-label');

            if(!baseComponent.additionalInput) {
                baseComponent.additionalInput = [];
            }

            baseComponent.additionalInput.push(newInputComponent);

            // Overwrite currently used
            newInputComponent = baseComponent;


        }

        function isTargetInPool(component) {

            var targetIsInPool = false;

            angular.forEach(components.pool, function(pool_entry) {

                if(component.targetId === pool_entry.targetId) {
                    targetIsInPool = true;
                }

            });

            return targetIsInPool;

        }

        function getTargetConnectionFromPool(component) {

            var tempReturn = null;

            angular.forEach(components.pool, function(pool_entry) {

                if(component.targetId === pool_entry.targetId) {
                    tempReturn = pool_entry;
                }

            });

            return tempReturn;

        }

        function targetInPool(component) {

            angular.forEach(components.pool, function(pool_entry) {

                if(component.targetId === pool_entry.targetId) {
                    addInputToComponent(component, pool_entry);
                }

            });

        }


        jsP.on('beforeDrop', function(component) {

            if(isTargetInPool(component)) {

                targetInPool(component);

                var modalInstance = $modal.open({
                    templateUrl: 'dmp-endpoint-selector.html',
                    controller: ModalInstanceCtrl,
                    resolve: {

                    }
                });

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

        PubSub.subscribe($rootScope, 'schemaCanvasUpdated', function () {

            $rootScope.$digest();
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
    }])
    .controller('TargetSchemaSelectorCtrl', ['$scope','$modalInstance', function ($scope, $modalInstance) {

    }]);
