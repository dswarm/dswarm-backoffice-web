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
        function fromDomainSchema(domainSchema, editableTitle) {

            var base = {name: domainSchema.name || ''},
                extra = {$show: true, editableTitle: !!editableTitle},
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

            var originalPaths = schema.attribute_paths;

            return loDash.map(originalPaths, function(attributePath) {

                return loDash.forEach(attributePath.attributes, function(attribute) {
                    attribute._$path_id = attributePath.id;
                });
            });
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
                        id: head.id,
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
                item.children = children;
            }

            return item;
        }

        return {
            fromDomainSchema: fromDomainSchema
        };
    });
