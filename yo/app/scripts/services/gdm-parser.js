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

    factory('gdmParser', function(loDash, schemaParser, Util) {

        /**
         * get an internal schema representation
         * @param schema  the original (domain) schema or already an internal one
         * @param skipParsing   true, if the provided schema is already an internal one
         */
        function getSchema(schema, skipParsing) {
            return skipParsing ? schema : schemaParser.fromDomainSchema(schema);
        }

        /**
         * build a Json Schema out of an internal schema
         * @param items a list
         * @param shortNames a map of long->short names that gets filled during the process
         */
        function buildJsonSchema(items, shortNames) {

            function loop(children) {

                var properties = {};
                loDash.forEach(children, function(child) {
                    var key = child.uri || child.name;
                    if (child.hasChildren) {
                        properties[key] = {type: 'object'};
                        properties[key].properties = loop(child.children);
                    } else {
                        properties[key] = {type: 'string'};
                    }
                    shortNames[key] = child.name;
                });

                return properties;
            }

            return loop(items);
        }

        /**
         * parse a record into a given schema.
         *
         * The parsing follows the schema and builds a data tree bottom-up.
         * That is
         * - only values defined in the schema get included, not everything
         *     presented in the data record.
         * - parsing recurses down the tree before building up nodes, effectively
         *      limiting the tree depth to some thousand levels
         *      (at which point, we likely have different issues)
         *
         * @param record        the complete data record
         * @param schemaResult  either a domain schema or an internal schema
         * @param skipParsing   true, if the schema is already an internal one
         */
        function parseFromDomainSchema(record, schemaResult, skipParsing) {
            var schema = getSchema(schemaResult, skipParsing),
                shortNames = {},
                data = {
                    title: schema.name,
                    type: 'object',
                    properties: buildJsonSchema(schema.children, shortNames)
                };

            return parseAny(record, schema.name, data, function(item) {
                var base = {};
                if (shortNames[item.name]) {
                    base['name'] = shortNames[item.name];
                }
                return base;
            });
        }

        /**
         * create a tree node
         * @param name      the name for the node
         * @param children  if a non-empty array, this will be a branch node with these children;
         *                  otherwise, this will be a leaf node
         * @param title     the title for the node (a particular data-value instance)
         * @param extra     extra attributes for the leaf node
         */
        function makeNode(name, children, title, extra) {
            var item = {'name': name, '$show': false, '$wasRendered': false};

            if (children && children.length) {
                item['children'] = children;
            }
            if (title) {
                item['title'] = title;
            }

            if (loDash.isFunction(extra)) {

                return loDash.assign(item, extra(item));
            } else {

                return loDash.assign(extra || {}, item);
            }
        }

        /**
         * parse an object into a tree node.
         *
         * According to the GDM model, a object is denoted as an array of single-keyed objects
         *  instead of an actual object in order to maintain the order of elements
         * regular object, where the order of the elements is undefined/not guaranteed:
         * {
         *   key1: value1,
         *   key2: value1
         * }
         * GMD object, with defined order:
         * [
         *   { key1: value1 },
         *   { key2: value2 }
         * ]
         *
         * the object can also be an array of objects
         * typical object array:
         * [
         *   { key1: value1 },
         *   { key2: value2 }
         * ]
         *
         * GDM object array:
         * [
         *   [
         *     { key1: value1 }
         *   ],
         *   [
         *     { key2: value2 }
         *   ]
         * ]
         *
         * @param record  the current data record
         * @param name    the associated name
         * @param schema  the schema definition for this data record
         * @param extra   extra attributes for the leaf node
         */
        function parseObject(record, name, schema, extra) {
            if (!loDash.isArray(record)) {
                return null;
            }

            if (loDash.isArray(record[0])) {
                return parseArray(record, name, {
                    type: 'object',
                    properties: schema
                }, extra);
            }

            var items = Util.collect(record, function(element) {
                var key = loDash.keys(element)[0];
                if (loDash.has(schema, key)) {
                    return parseAny(element[key], key, schema[key], extra);
                }
                return null;
            });

            if (items.length === 1 && items[0].name === name) {
                return items[0];
            }

            return makeNode(name, items, null, extra);
        }

        /**
         * parse an array of homogeneous items
         * @param records a list of data records
         * @param name    the associated name
         * @param schema  the schema definition for each data record
         * @param extra   extra attributes for the leaf node
         */
        function parseArray(records, name, schema, extra) {
            var items = Util.collect(records, function(record) {
                return parseAny(record, name, schema, extra);
            });
            return makeNode(name, items, null, extra);
        }

        /**
         * parse a string value into a tree item
         *
         * requires to record to be a string or an array of strings.
         *
         * @param record  the current data record
         * @param name    the associated name
         * @param extra   extra attributes for the leaf node
         */
        function parseString(record, name, extra) {
            if (loDash.isString(record)) {
                var xtra = loDash.isFunction(extra) ?
                    function(i) { return loDash.extend(extra(i), {leaf: true}); } :
                    loDash.extend(extra || {}, {leaf: true});

                return makeNode(name, null, record.trim(), xtra);
            }

            if (loDash.isArray(record)) {
                var items = Util.collect(record, function(item) {
                    return parseString(item, name, extra);
                });
                return makeNode(name, items, null, extra);
            }
        }

        /**
         * parse either an object or a string
         * @param record  the current data record
         * @param name    the associated name
         * @param schema  the schema definition for this data record
         * @param extra   extra attributes for the leaf node
         */
        function parseAny(record, name, schema, extra) {

            if (schema['type'] === 'object') {
                return parseObject(record, name, schema['properties'], extra);
            }
            if (schema['type'] === 'string') {
                return parseString(record, name, extra);
            }
        }

        return {
            parse: parseFromDomainSchema,
            parseAny: parseAny,
            parseString: parseString,
            parseObject: parseObject,
            parseArray: parseArray
        };
    });
