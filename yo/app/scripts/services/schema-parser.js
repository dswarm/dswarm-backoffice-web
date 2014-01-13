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
factory('schemaParser', ['Lo-Dash', function (loDash) {

    /**
     * Maps from json-schema to the internal tree model.  Since json-schema
     *   already is very tree-ish, there is nothing much to do but renaming
     *   some properties and apply recursion all the way down.
     *
     * @param name {String}  The name of the current property, that is
     *   enumerated on.
     * @param container {Object}  The definition of the current property.
     *   A json-schema is usually like "Property": { ... (definition) }
     *   and `name' and `container' are just that.
     * @param editableTitle {Boolean}
     * @returns {{name: String, show: boolean}}
     */
    function mapData(name, container, editableTitle) {

        var data = {'name': name, 'show': true, 'editableTitle': editableTitle},
            itemsSetName = 'properties';

        if(!container['properties'] && container['items']) {
            itemsSetName = 'items';
        }

        if (container[itemsSetName]) {
            var children = [];

            angular.forEach(container[itemsSetName], function (val, key) {
                children.push(mapData(key, val, editableTitle));
            });

            data['children'] = children;
        }

        data.hasChildren = (data['children'] && data['children'].length > 0);

        return data;
    }


    /**
     * Maps from DMP domain schema to json Schema and then uses mapData
     * to get the internal tree model.
     * The domain schema consists of several attribute paths,
     * each containing one or more attributes.
     *
     *
     * @param domainSchema  {{id: Number, name: String, attribute_paths: Array}}
     * @param editableTitle {Boolean=}
     * @returns {{name: String, show: boolean}}
     */
    function fromDomainSchema(domainSchema, editableTitle) {

        var data = {name: domainSchema.name, show: true, editableTitle: editableTitle};

        var make = function(obj) {
            return angular.extend({show: true, hasChildren: false, editableTitle: editableTitle}, obj);
        };

        var merge = function(container, newChildren) {
            var index = loDash.zipObject(loDash.map(container.children, function(c, idx) {
                return [c.id, idx];
            }));

            loDash.forEach(newChildren, function(item) {
                if (index.hasOwnProperty(item.id)) {
                    var child = container.children[index[item.id]];
                    child.children = (child.children || []).concat(item.children || []);
                    child.hasChildren = child.children.length > 0;
                } else {
                    item.hasChildren = item.children && item.children.length > 0;
                    container.children.push(item);
                }
            });

            container.hasChildren = container.children.length > 0;
        };

        var loop = function(attribs, obj) {
            var props = angular.extend({children: []}, obj);

            var cache = {};

            angular.forEach(attribs, function (val) {
                var path = loDash.map(val, 'id');
                if (path.length > 1) {

                    var newVal = val.slice(1);
                    var name = path[0];
                    if (!cache.hasOwnProperty(name)) {
                        cache[name] = {id: name, name: val[0].name, children: []};
                    }

                    var parsed = loop([newVal]);

                    merge(cache[name], parsed.children);
//                    cache[name].children = cache[name].children.concat(parsed.children);
                } else {
                    props.children.push(make(val[0]));
                }
            });

            if (!loDash.isEmpty(cache)) {
                merge(props, cache);
            }

            return props;
        };

        var paths = domainSchema['attribute_paths'];
        var attrs = loDash.map(paths, 'attributes');

        if (attrs.length) {
            angular.extend(data, loop(attrs));
        }

        console.log(data);
        data.hasChildren = data.children && data.children.length > 0;

        return data;
    }

    /**
     * Parse in input record based on a schema, that is a domain schema.
     * This will call `fromDomainSchmema` to gen an internal representation
     * of the schema and will then transform it into something json-schema-esque.
     *
     * @param record        {Object}
     * @param schemaResult  {Object}
     * @param dontParseSchema {boolean=}
     * @returns {*}
     */
    function parseFromDomainSchema(record, schemaResult, dontParseSchema) {
        var schema = dontParseSchema ? schemaResult : fromDomainSchema(schemaResult);

        var data = {title: schema.name, type: 'object'};

        var shortNames = {};

        var loop = function(children) {

            var properties = {};
            angular.forEach(children, function(child) {
                var key = child.id || child.name;
                if (child.hasChildren) {
                    properties[key] = {type: 'object'};
                    properties[key].properties = loop(child.children);
                } else {
                    properties[key] = {type: 'string'};
                }
                shortNames[key] = child.name;
            });

            return properties;
        };

        data.properties = loop(schema.children);

        return parseAny(record, schema.name, data, function(item) {
            var base = {};
            if (shortNames[item.name]) {
                base['name'] = shortNames[item.name];
            }
            return base;
        });
    }

    /**
     * creates a leaf item
     * @param name {String}
     * @param children {Object}
     * @param title {String=} (optional)
     * @param extra {Object|Function=} (optional)
     * @returns {*}
     */
    function makeItem(name, children, title, extra) {
        var item = {'name': name, 'show': true};
        if (children && children.length) {
            item['children'] = children;
        }
        if (title) {
            item['title'] = title;
        }

        if (angular.isFunction(extra)) {

            return angular.extend(item, extra(item));
        } else {

            return angular.extend(extra || {}, item);
        }
    }

    /**
     * creates leafs from object type
     * @param container {*}
     * @param name {String}
     * @param properties {Object}
     * @param extra {*}
     * @returns {*}
     */
    function parseObject(container, name, properties, extra) {
        if (angular.isArray(container)) {
            return parseArray(container, name, {
                type: 'object',
                properties: properties
            }, extra);
        }
        var ary = [],
            hasText = false,
            hasMatch = false;

        angular.forEach(properties, function (val, key) {
            if (container[key]) {
                hasMatch = true;
                var it = parseAny(container[key], key, val, extra);
                if (it) {
                    ary.push(it);
                    if (key === '#text') {
                        hasText = true;
                    }
                }
            }
        });

        // make #text optional
        if (!hasText && container['#text']) {
            var itString = parseString(container['#text'], name, extra);
            if (itString) {
                hasText = true;
                ary.push(itString);
            }

        }

        // no properties found? try to be forgiving
        if (!hasMatch && !hasText && loDash.keys(properties).length === 1) {
            angular.forEach(properties, function(val, key) {
                var it = parseAny(container, key, val, extra);
                if (it) {
                    ary.push(it);
                }
            });
        }

        if (ary.length === 1 && ary[0].name === name) {
            return ary[0];
        }

        return makeItem(name, ary, null, extra);
    }

    /**
     * creates leafs from array type
     * @param container {*}
     * @param name {String}
     * @param properties {Object}
     * @param extra {*}
     * @returns {*}
     */
    function parseArray(container, name, properties, extra) {
        var ary = [];
        angular.forEach(container, function (item) {
            // nested properties may be due to xsd parsing
            // if there is only one children equally named as the current container, traverse into it
            while (loDash.isEqual(loDash.keys(properties), [name])) {
                properties = properties[name];
            }

            var it = parseAny(item, name, properties, extra);
            if (it) {
                ary.push(it);
            }
        });
        return makeItem(name, ary, null, extra);
    }

    /**
     *  creates leafs from string type
     * @param container {*}
     * @param name {String}
     * @param extra {*}
     * @returns {*}
     */
    function parseString(container, name, extra) {
        var xtra = angular.isFunction(extra) ? function(i) {
            return angular.extend(extra(i), {leaf: true});
        } : angular.extend(extra || {}, {leaf: true});

        if (angular.isString(container)) {
            return makeItem(name, null, container.trim(), xtra);
        }

        if (container['#text'] && container['#text'].trim()) {
            return makeItem(name, null, container['#text'].trim(), xtra);
        }

        if (angular.isArray(container)) {
            var ary = [];
            angular.forEach(container, function (item) {
                var it = parseString(item, name, extra);
                if (it) {
                    ary.push(it);
                }
            });
            return makeItem(name, ary, null, extra);
        }
    }

    /**
     * creates leafs from enum type
     * @param container {*}
     * @param name {String}
     * @param enumeration {String}
     * @returns {*}
     */
    function parseEnum(container, name, enumeration) {
        if (enumeration.indexOf(container) !== -1) {
            return makeItem(name, null, container);
        }
    }

    /**
     * dispatches current leaf to correct parser
     * @param container {*}
     * @param name {String}
     * @param obj {*}
     * @param extra {*}
     * @returns {*}
     */
    function parseAny(container, name, obj, extra) {

        if (obj['type'] === 'object') {
            return parseObject(container, name, obj['properties'], extra);
        }
        if (obj['type'] === 'array') {
            if (angular.isArray(container)) {
                return parseArray(container, name, obj['items'], extra);
            } else {
                return parseObject(container, name, obj['items'], extra);
            }
        }
        if (obj['type'] === 'string') {
            return parseString(container, name, extra);
        }
        if (obj['enum']) {
            return parseEnum(container, name, obj['enum']);
        }
    }

    /**
     * takes input data object and returns title data as array
     * @param data {*}
     * @param path {*}
     * @param returnData {*}
     * @returns {*}
     */
    function getData(data, path, returnData) {

        if(data.children) {

            if(!returnData) {
                returnData = [];
            }

            angular.forEach(data.children,function(child) {

                var tempData,
                    subpath = path;

                if(child.children) {

                    if(subpath.length > 0) {
                        subpath = subpath + '.';
                    }

                    subpath = subpath + data.name;

                }

                tempData = getData(child,subpath,returnData);

                if(tempData && tempData.title) {
                    tempData.path +=  '.' + data.name + '.' + tempData.name;

                    returnData.push(tempData);
                }
            });

            if(returnData.length > 0) {
                return returnData;
            }
        } else {

            if(data.title) {
                return { 'title' : data.title, 'name' : data.name, 'path' : path };
            }
            else {
                return '';
            }
        }
    }

    /**
     *
     * @param data
     * @param filters
     * @returns {*}
     */
    function filterData(data, filters) {

        var matchCount = 0;

        angular.forEach(filters, function(filter) {
            matchCount += matchFilter(data, filter);
        });

        data.filterNoMatch = (matchCount !== filters.length);

        return data;

    }

    /**
     *
     * @param data
     * @param filter
     * @returns {number}
     */
    function matchFilter(data, filter) {
        return matchPath(data,filter.path, filter.title);
    }

    /**
     *
     * @param data
     * @param path
     * @param matchdata
     * @returns {number}
     */
    function matchPath(data, path, matchdata) {

        var pathArray = path.split('.');

        if(data.name === null || typeof data.name === 'undefined') {
            data.name = '';
        }

        if(data.name.toString === pathArray[0].toString) {
            pathArray.shift();

            if(data.children) {

                var childData = 0;

                angular.forEach(data.children, function(child) {

                    childData += matchPath(child, pathArray.join('.'), matchdata);

                });

                return childData;


            } else {
                if(data.title === matchdata) {

                    data.leafmatchedFilter = true;
                    return 1;

                } else {
                    data.leafmatchedFilter = false;
                    return 0;
                }

            }

        } else {
            return 0;
        }


    }

    return {
        mapData: mapData
      , fromDomainSchema: fromDomainSchema
      , parseFromDomainSchema: parseFromDomainSchema
      , makeItem: makeItem
      , parseObject: parseObject
      , parseArray: parseArray
      , parseString: parseString
      , parseEnum: parseEnum
      , parseAny: parseAny
      , getData: getData
      , filterData : filterData
    };
}]);
