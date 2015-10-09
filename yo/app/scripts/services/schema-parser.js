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

angular.module('dmpApp').
/**
 * A service that parses json-schema into an internal tree model [1]. It also
 *   provides functionality to transform an XML2JSON model [2] into the
 *   aforementioned tree model, using the same json-schema definition.
 *
 *   [1] The internal tree model is defined in directives/tree.js
 *   [2] Based on the unmodified results of https://github.com/hay/xml2json
 *
 *   Due to the nature of representing a tree structure, most of these
 *   methods are utilizing either plain recursion or trampoline recursion.
 *
 *   Normally only mapData and getData would be needed to be used.
 *
 * * mapData returns the parsed data from the schema
 * * getData returns all title data. most useful in combination
 *           with with the editableTitle flag
 */
    factory('schemaParser', function(loDash, Util) {

        /**
         * Maps from DMP domain schema to json Schema and then uses mapData
         * to get the internal tree model.
         * The domain schema consists of several attribute paths,
         * each containing one or more attributes.
         *
         *
         * @param domainSchema  {{id: Number, name: String, attribute_paths: Array}}
         * @param editableTitle {Boolean=}
         * @returns {*}
         */
        function fromDomainSchema(domainSchema, editableTitle, isInFilterTree, filterTypeObj) {

            var extra = {$show: false, editableTitle: !!editableTitle, '$wasRendered': false, isInFilterTree: !!isInFilterTree};

            if(filterTypeObj) {

                extra.filterTypes = filterTypeObj.filterTypes;
                extra.filterType = filterTypeObj.defaultFilterType;
            }

            var base = {name: domainSchema.name || ''},
                paths = prepare(domainSchema),
                cache = generateTreeCache(paths);

            return createSchemaItem(cache.children, cache.order, base, extra);
        }

         /**
         * return a list of all attribute path's attributes (a list of list of attributes, if you will)
         * @param schema
         * @returns {*}
         */
        function prepare(schema) {

            var originalPaths = schema.attribute_paths,
                preparedPaths = [];

            loDash.map(originalPaths, function(attributePath) {

                var basePaths = attributePath.attribute_path.attributes;

                loDash.forEach(basePaths, function(basePath) {
                    basePath._$path_id = attributePath.attribute_path.uuid;
                    basePath._$isSubSchema = false;
                });

                preparedPaths.push(angular.copy(basePaths));

                if(attributePath.sub_schema) {

                    loDash.forEach(attributePath.sub_schema.attribute_paths, function(subSchemaAttributePath) {

                        var subSchemaPaths = subSchemaAttributePath.attribute_path.attributes;

                        loDash.forEach(subSchemaPaths, function(subSchemaPath) {
                            subSchemaPath._$path_id = subSchemaAttributePath.attribute_path.uuid;
                            subSchemaPath._$isSubSchema = true;
                        });

                        preparedPaths.push(basePaths.concat(subSchemaPaths));
                    });

                }

            });

            return preparedPaths;
        }

        /**
         * generate a cache structure for the tree, providing parsing order of elements and
         * producing the relevant tree structure.
         *
         * @param attributePaths
         * @returns {{order: Array, children: {}}}
         */
        function generateTreeCache(attributePaths) {
            var cache = {},
                order = [];

            loDash.forEach(attributePaths, function(path) {
                addToCache(cache, order, path);
            });

            return {
                order: order,
                children: cache
            };
        }

        /**
         * adds a list of attributes to a cache.
         * the attributes are interpreted as being in a kind of hierarchical order, that is,
         *  each index represents a new level
         *
         * @param cache
         * @param order
         * @param attributes
         */
        function addToCache(cache, order, attributes) {
            if (attributes.length > 0) {

                var head = attributes[0],
                    tail = attributes.slice(1),
                    elem;

                if (!loDash.has(cache, head.uri)) {

                    cache[head.uri] = elem = {
                        uuid: head.uuid,
                        uri: head.uri,
                        name: head.name,
                        order: [],
                        children: {}
                    };
                    order.push(head.uri);
                } else {
                    elem = cache[head.uri];
                }
                if (tail.length === 0) {
                    elem._$path_id = head._$path_id;
                    elem._$isSubSchema = head._$isSubSchema;

                }

                addToCache(elem.children, elem.order, tail);
            }
        }

        /**
         * recursively cleans up the tree structure and creates proper schema tree items
         * @param cache
         * @param order
         * @param item
         * @param extra
         * @returns {*}
         */
        function createSchemaItem(cache, order, item, extra) {
            //noinspection FunctionWithInconsistentReturnsJS
            var children = Util.collect(order, function(uri) {
                var child = cache[uri];
                if (child) {
                    return createSchemaItem(child.children, child.order, child, extra);
                }
            });

            delete item.children;
            delete item.order;

            angular.extend(item, extra);

            if (loDash.isEmpty(children)) {
                item.hasChildren = false;
                return item;
            } else {
                item.hasChildren = true;
                item.children = loDash.sortBy(children, function(child) {
                    return +child.hasChildren;
                });
            }

            return item;
        }

        return {
            fromDomainSchema: fromDomainSchema
        };
    });
