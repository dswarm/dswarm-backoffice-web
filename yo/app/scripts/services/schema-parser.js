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
    factory('schemaParser', function(loDash) {

        /**
         * Maps from DMP domain schema to json Schema and then uses mapData
         * to get the internal tree model.
         * The domain schema consists of several attribute paths,
         * each containing one or more attributes.
         *
         *
         * @param domainSchema  {{id: Number, name: String, attribute_paths: Array}}
         * @param editableTitle {Boolean=}
         * @returns {{name: String, $show: boolean}}
         */
        function fromDomainSchema(domainSchema, editableTitle) {

            var data = {name: domainSchema.name, $show: true, editableTitle: editableTitle};

            var make = function(obj) {
                return angular.extend({$show: true, hasChildren: false, editableTitle: editableTitle}, obj);
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

                angular.forEach(attribs, function(val) {
                    if (angular.isUndefined(val)) {
                        return;
                    }

                    var path = loDash.map(val, 'id');
                    if (path.length > 1) {

                        var newVal = val.slice(1);
                        var name = path[0];
                        if (!cache.hasOwnProperty(name)) {
                            cache[name] = {id: name, uri: val[0].uri, name: val[0].name, children: []};
                        }

                        var parsed = loop([newVal]);

                        merge(cache[name], parsed.children);
//                    cache[name].children = cache[name].children.concat(parsed.children);
                    } else if (angular.isObject(val[0])) {
                        props.children.push(make(val[0]));
                    }
                });

                if (!loDash.isEmpty(cache)) {
                    merge(props, cache);
                }

                return props;
            };

            var paths = domainSchema['attribute_paths'];
            var attrs = loDash.map(paths, function(attribute_path) {

                if (attribute_path.id) {
                    angular.forEach(attribute_path.attributes, function(attribute) {

                        attribute._$path_id = attribute_path.id;

                    });
                }

                return attribute_path.attributes;
            });
            if (attrs.length) {
                angular.extend(data, loop(attrs));
            }

            data.hasChildren = data.children && data.children.length > 0;

            return data;
        }

        return {
            fromDomainSchema: fromDomainSchema
        };
    });
