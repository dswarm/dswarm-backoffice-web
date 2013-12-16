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
factory('schemaParser', ['$window', function ($window) {
    var lod = $window['_'];

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
     * creates a leaf item
     * @param name {String}
     * @param children {Object}
     * @param title {String=} (optional)
     * @param extra {Object=} (optional)
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
        return angular.extend(extra || {}, item);
    }

    /**
     * creates leafs from object type
     * @param container {*}
     * @param name {String}
     * @param properties {Object}
     * @returns {*}
     */
    function parseObject(container, name, properties) {
        if (angular.isArray(container)) {
            return parseArray(container, name, {
                type: 'object',
                properties: properties
            });
        }
        var ary = [],
            hasText = false,
            hasMatch = false;

        angular.forEach(properties, function (val, key) {
            if (container[key]) {
                hasMatch = true;
                var it = parseAny(container[key], key, val);
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
            var itString = parseString(container['#text'], name);
            if (itString) {
                hasText = true;
                ary.push(itString);
            }

        }

        // no properties found? try to be forgiving
        if (!hasMatch && !hasText && lod.keys(properties).length === 1) {
            angular.forEach(properties, function(val, key) {
                var it = parseAny(container, key, val);
                if (it) {
                    ary.push(it);
                }
            });
        }

        if (ary.length === 1 && ary[0].name === name) {
            return ary[0];
        }

        return makeItem(name, ary);
    }

    /**
     * creates leafs from array type
     * @param container {*}
     * @param name {String}
     * @param properties {Object}
     * @returns {*}
     */
    function parseArray(container, name, properties) {
        var ary = [];
        angular.forEach(container, function (item) {
            // nested properties may be due to xsd parsing
            // if there is only one children equally named as the current container, traverse into it
            while (lod.isEqual(lod.keys(properties), [name])) {
                properties = properties[name];
            }

            var it = parseAny(item, name, properties);
            if (it) {
                ary.push(it);
            }
        });
        return makeItem(name, ary);
    }

    /**
     *  creates leafs from string type
     * @param container {*}
     * @param name {String}
     * @returns {*}
     */
    function parseString(container, name) {
        if (angular.isString(container)) {
            return makeItem(name, null, container.trim(), {leaf: true});
        }

        if (container['#text'] && container['#text'].trim()) {
            return makeItem(name, null, container['#text'].trim(), {leaf: true});
        }

        if (angular.isArray(container)) {
            var ary = [];
            angular.forEach(container, function (item) {
                var it = parseString(item, name);
                if (it) {
                    ary.push(it);
                }
            });
            return makeItem(name, ary);
        }
    }

    /**
     * creates leafs from enum type
     * @param container {*}
     * @param name {String}
     * @param enumeration {Enum}
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
     * @returns {*}
     */
    function parseAny(container, name, obj) {

        if (obj['type'] === 'object') {
            return parseObject(container, name, obj['properties']);
        }
        if (obj['type'] === 'array') {
            if (angular.isArray(container)) {
                return parseArray(container, name, obj['items']);
            } else {
                return parseObject(container, name, obj['items']);
            }
        }
        if (obj['type'] === 'string') {
            return parseString(container, name);
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
