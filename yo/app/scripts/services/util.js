/**
 * Copyright (C) 2013, 2014  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
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
 * Provide an injectable lo-dash.
 * see http://lodash.com/docs for documentation on lodash
 */
    .factory('loDash', function($window) {
        return $window['_'];
    })
/**
 * Provide an injectable reference to the API endpoint
 */
    .factory('ApiEndpoint', function(ServiceUrls) {
        return ServiceUrls.backend || '';
    })
/**
 * Provide an injectable reference to the NEO4j endpoint
 */
    .factory('Neo4jEndpoint', function(ServiceUrls) {
        return ServiceUrls.neo || '';
    })
/**
 * Provide utility functions for miscellaneous operations
 */
    .factory('Util', function(loDash, $q, $timeout) {

        function latestBy(list, property) {
            var prop = property || 'id';
            return loDash.max(list, prop);
        }


        /**
         * Helper function that maps over `resources` that may have a configuration
         * @param func
         * @returns {Function}
         */
        function mapResources(func) {
            return function(resource) {
                if (resource.configurations) {
                    var latestConfig = latestBy(resource.configurations);
                    if (angular.isObject(latestConfig)) {
                        return func(resource, latestConfig);
                    }
                }
                return func(resource, null);
            };
        }

        /**
         * collect works like map, except that it filters out any `undefined` values.
         * It is like map and filter combined.
         *
         * so instead of
         * <code>
         *     var evens = _.filter([1,2,3,4,5], function(x){ return x % 2 === 0});
         *     var squaredEvens = _.map(evens, function(x){ return x * x });
         *     // -> [4, 16]
         * </code>
         *
         * one can use collect like this
         * <code>
         *     var squaredEvens = collect([1,2,3,4,5], function(x){ if (x % 2 === 0) return x * x })
         * </code>
         *
         * @param seq      sequence to map over. sequence might be an array or an object.
         * @param func     mapping function, that might return nothing (undefined or null)
         * @param thisObj  `this` for the function
         * @returns {Array}
         */
        function collect(seq, func, thisObj) {
            return loDash(seq).map(func, thisObj).filter(function(el) {
                return el !== undefined && el !== null;
            }).valueOf();
        }

        /**
         * Promise, that will be resolved or rejected by the original Promise,
         *  but that times out after the given timeout.
         *
         * @param promise {{then:function(), catch: function(), finally: function()}} The original promise
         * @param timeout {Number}  The timeout in milliseconds
         * @returns {{then:function(), catch: function(), finally: function()}}
         */
        function timedoutPromise(promise, timeout) {
            var defer = $q.defer();

            promise.then(defer.resolve, defer.reject);

            $timeout(function() {
                defer.reject('timeout');
            }, timeout);

            return defer.promise;
        }

        //====================================
        // Custom JSON serializing
        //====================================

        /**
         * Eliminates keys, that start with '$' (angular internal stuff)
         * and '_$' (dmp internal stuff)
         *
         * @param key
         * @param value
         * @returns {*}
         */
        function toJsonReplacer(key, value) {
            var val = value;

            if (typeof key === 'string' && (key.charAt(0) === '$' || (key.charAt(0) === '_' && key.charAt(1) === '$'))) {
                val = undefined;
            } else if (key === 'parameter_mappings') {
                val = loDash.mapValues(value, function(v) {
                    return v !== null ? typeof v !== 'undefined' ? v.toString() : null : v;
                });
            } else if (value) {
                if (value.document && value.location && value.alert && value.setInterval) {
                    val = '$WINDOW';
                } else if (document === value) {
                    val = '$DOCUMENT';
                } else if (value.$evalAsync && value.$watch) {
                    val = '$SCOPE';
                } else if (angular.isArray(value) && value.length === 0) {
                    // the backend doesn't like empty arrays
                    val = undefined;
                }
            }
            return val;
        }

        /**
         * Serializes input into a JSON-formatted string.
         * Properties with leading $ or _$ will be stripped.
         *
         * Do not use this for drafts/saving into local storage but for
         * serializing an object before sending it over the wire.
         *
         * @param {Object|Array|Date|string|number} obj Input to be serialized into JSON.
         * @param {boolean=} pretty If set to true, the JSON output will contain newlines and whitespace.
         * @returns {string|undefined} JSON-ified string representing `obj`.
         */
        function toJson(obj, pretty) {
            if (typeof obj === 'undefined') {
                return undefined;
            }
            return JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);
        }

        /**
         * Build a attribute name
         * @param {Array} attributes The list of attributes
         * @param {string} property The property to look at
         * @param {string} delimiter Part delimiter
         * @returns {string} The combined attribute name
         */
        function buildAttributeName(attributes, property, delimiter) {
            return loDash.pluck(attributes, property).join(delimiter);
        }

        /**
         * Build a Uri reference using attribute name builder
         * @param {Array} attributes The list of attributes
         * @returns {string} The combined URI string
         */
        function buildUriReference(attributes) {
            return buildAttributeName(attributes, 'uri', '\u001E');
        }

        /**
         * Build a var name using attribute name builder
         * @param {Array} attributes The list of attributes
         * @returns {string} The combined varname string
         */
        function buildVariableName(attributes) {
            return buildAttributeName(attributes, 'name', '_');
        }

        /**
         * Ensures each mapping only has unique parameter_mapping identifiers
         * @param {Array} mappings Array of mappings
         */
        function ensureUniqueParameterMappingVars(mappings) {

            loDash.map(mappings, function(mapping, idx) {

                loDash.forEach(mapping.transformation.parameter_mappings, function(parameter_mapping, key) {

                    if(key.indexOf('TRANSFORMATION_OUTPUT_VARIABLE') === -1) {

                        var newKey = key + '__' + idx + '__';

                        mapping.transformation.parameter_mappings[newKey] = newKey;
                        delete mapping.transformation.parameter_mappings[key];

                        loDash.forEach(mapping.transformation.function.components, function(component) {

                            var inputString = (!loDash.isUndefined(component.parameter_mappings.inputString)) ? component.parameter_mappings.inputString.split(',') : [];
                            var inputStringIndex = inputString.indexOf(key);

                            inputString[inputStringIndex] = newKey;

                            component.parameter_mappings.inputString = inputString.join(',');

                        });

                        var iapInstance = loDash.find(mapping.input_attribute_paths, { name : key });
                        iapInstance.name = newKey;

                    }

                });

            });

        }

        /**
         * Generates a new data model
         * @param {string} name name of that model, used for Data model and schema object
         * @returns {{name: string, description: string, schema: {name: *, id: number, attribute_paths: Array, record_class: {}}, id: number}}
         */
        function buildNewDataModel(name) {

            var randId = (new Date().getTime() + Math.floor(Math.random() * 1001)) * -1;

            return {
                'name': name + ' Data Model',
                'description': name + ' Data Model',
                'schema': {
                    'name': name,
                    'id': randId,
                    'attribute_paths': [],
                    'record_class': {}
                },
                'id': randId+1
            };

        }

        return {
            latestBy: latestBy,
            mapResources: mapResources,
            collect: collect,
            timedoutPromise: timedoutPromise,
            toJson: toJson,
            buildAttributeName: buildAttributeName,
            buildUriReference: buildUriReference,
            buildVariableName: buildVariableName,
            ensureUniqueParameterMappingVars: ensureUniqueParameterMappingVars,
            buildNewDataModel: buildNewDataModel
        };
    })
/**
 * Factory for creating basic resources, that follow a typial pattern.
 * TODO: what cas restangular do here for us?
 */
    .factory('ResourceFactory', function($resource, ApiEndpoint) {

        function create(resource, actionsFactory) {
            var endpoint = resource + '/:id',
                finalUrl = ApiEndpoint + endpoint;

            if (angular.isFunction(actionsFactory)) {
                return $resource(finalUrl, undefined, actionsFactory(finalUrl, ApiEndpoint));
            }

            return $resource(finalUrl);
        }

        return {
            create: create
        };
    })
/**
 * Provide utility functions to generate UUID-4-ish pseudo-random identifiers.
 * For more concrete implementations, refer to
 * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 */
    .factory('GUID', function() {
        /**
         * Random parts for GUID
         * @returns {string} guid part
         */
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        /**
         * Create a GUID
         * @returns {string} the guid
         */
        function guid() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        return {
            'uuid4': guid
        };
    });
