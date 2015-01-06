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
    .factory('endpointSelector', function($modal, $q, endpointLabel, loDash, Util) {

        var activeComponent = null;
        var pool = [];

        function findInPool(selector) {

            return loDash.find(pool, selector);
        }

        function isConnectionAdditionalInput(connection) {

            return !!findInPool(function(poolEntry) {
                return angular.isDefined(loDash.find(poolEntry.additionalInput || [], {connection: connection}));
            });
        }

        function setColor(connection, color) {
            connection.endpoints[0].setPaintStyle({fillStyle: color});
            connection.setPaintStyle({strokeStyle: color});
        }

        function deSelect(connection) {
            setColor(connection, 'black');

            angular.forEach(connection.additionalInput, function(additionalInputEntry) {
                setColor(additionalInputEntry.connection, 'black');
            });

            endpointLabel.deactivate(connection);
            connection.getConnector().removeClass('mapping-active');
        }

        function deSelectAll() {
            angular.forEach(pool, function(comp) {
                if (comp !== activeComponent) {
                    deSelect(comp);
                }
            });
        }

        function select(connection) {
            setColor(connection, 'red');

            angular.forEach(connection.additionalInput, function(additionalInputEntry) {
                setColor(additionalInputEntry.connection, 'red');
            });

            endpointLabel.activate(connection);
            connection.getConnector().addClass('mapping-active');
        }

        function isTargetInPool(component) {

            return !!getTargetFromPool(component.targetId);
        }

        function getTargetPoolComponents(component, scopes) {

            return Util.collect(pool, function(poolEntry) {
                if (component.targetId === poolEntry.targetId) {

                    var sourceScope = scopes[component.sourceId].scope();
                    var targetScope = scopes[component.targetId].scope();

                    return {
                        id: poolEntry.id,
                        label: endpointLabel.get(poolEntry),
                        sourceName: sourceScope.data.name,
                        sourceData: sourceScope.data,
                        targetName: targetScope.data.name,
                        targetData: targetScope.data
                    };
                }
                return null;
            });
        }

        function activate(connection) {

            if (endpointLabel.get(connection) === null) {
                return null;
            }

            if (isConnectionAdditionalInput(connection)) {

                return activate(getTargetFromPool(connection.targetId));
            } else {

                if (pool.indexOf(connection) === -1) {
                    pool.push(connection);
                }

                if (!connection.mappingId) {
                    connection.mappingId = new Date().getTime() * -1;
                }

                activeComponent = connection;
                deSelectAll();
                select(connection);

                return connection;
            }
        }

        function connectionParamPromise(component, sourceScope, targetScope, scopes) {
            var defer = $q.defer();
            var baseParams = {
                component: component,
                sourceId: sourceScope.guid,
                targetId: targetScope.guid,
                sourceOptions: sourceScope.jspSourceOptions,
                targetOptions: targetScope.jspTargetOptions
            };

            if (isTargetInPool(component)) {

                askForEndpoint(component, scopes).then(function(target) {

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

        function askForEndpoint(component, scopes) {

            var modalInstance = $modal.open({
                templateUrl: 'views/modals/dmp-endpoint-selector.html',
                controller: 'DmpEndpointSelectorCtrl',
                resolve: {
                    endpointSet: function() {
                        return getTargetPoolComponents(component, scopes);
                    }
                }
            });

            return modalInstance.result;
        }

        function inPool(component) {

            return !!getTargetFromPool(component.targetId);
        }

        function toPool(connection) {

            pool.push(connection);
        }

        function getFromPool(id) {

            return findInPool({id: id});
        }

        function getTargetFromPool(targetId) {

            return findInPool({targetId: targetId});
        }

        function removeFromPool(connection) {

            pool = loDash.filter(pool, function(poolEntry) {
                return connection !== poolEntry;
            });
        }

        function foreach(fn, thisArg) {
            loDash.forEach(pool, fn, thisArg);
        }

        function reset() {
            pool = [];
        }


        return {
            activate: activate,
            connectionParamPromise: connectionParamPromise,
            inPool: inPool,
            getFromPool: getFromPool,
            getTargetFromPool: getTargetFromPool,
            removeFromPool: removeFromPool,
            foreach: foreach,
            reset: reset,
            toPool: toPool
        };
    });
