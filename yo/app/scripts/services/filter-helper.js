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
    factory('filterHelper', function(loDash) {

        /**
         * constructs a list of filtered schemas from a list of
         * path -> value filter-expressions
         *
         * @param schema an already parsed schema (use fromDomainSchema)
         * @param expression a filter expression as per backend storage ({ path : value })
         * @returns a list of {filter, inputFilter, name} objects that power the filter functionality
         */
        function applyFilter(schema, expression) {

            function next(children, path, isLeaf) {
                return loDash.select(children, function(child) {
                    return (isLeaf || child.hasChildren) && child.uri === path;
                });
            }

            function loop(children, paths, update) {
                var isLast = paths.length === 1,
                    nextChildren = next(children, loDash.first(paths), isLast);

                if (isLast) {
                    loDash.forEach(nextChildren, update);
                } else {
                    loop(loDash.flatten(loDash.map(nextChildren, 'children'), true), loDash.rest(paths), update);
                }
            }

            function apply(value, key) {
                var pathUris = key.split('\u001E');

                loop(schema.children || [], pathUris, function(child) {
                    child.title = value;
                });
            }

            loDash.forEach(expression, apply);

            return schema;
        }

        /**
         * contructs a list of filter input structs to be used for filter input masks
         */
        function buildFilterInputs(filters) {
            function createFilterName(inputFilters) {
                var name = loDash.map(inputFilters, 'title').join(', ');
                return name || 'new filter';
            }

            function mapFilter(filter) {

                filter.inputFilters = getData(filter.filter, '');
                filter.name = createFilterName(filter.inputFilters);

                return filter.inputFilters;
            }

            return loDash.reduce(filters, function(acc, filter) {
                return acc.concat(mapFilter(filter));
            }, []);
        }

        /**
         * takes input data object and returns title data as array
         * @param data {*}
         * @param path {*}
         * @param returnData {*}
         * @returns {*}
         */
        function getData(data, path, returnData) {

            if (data.children) {

                if (!returnData) {
                    returnData = [];
                }

                angular.forEach(data.children, function(child) {

                    var tempData,
                        subpath = path;

                    if (child.children) {

                        if (subpath.length > 0) {
                            subpath = subpath + '.';
                        }

                        subpath = subpath + data.name;

                    }

                    tempData = getData(child, subpath, returnData);

                    if (tempData && tempData.title) {
                        tempData.path += '.' + data.name + '.' + tempData.name;

                        returnData.push(tempData);
                    }
                });

                if (returnData.length > 0) {
                    return returnData;
                }
            } else {

                if (data.title) {
                    return { 'title': data.title, 'name': data.name, 'path': path, apId: data._$path_id };
                }
                else {
                    return '';
                }
            }
        }

        function annotateMatches(source, filters, matcher) {
            if (filters && filters.length && filters[0]) {
                source.isFiltered = true;
                source.filterNoMatch = false;
                filterData(source, filters, matcher);
            } else {
                source.isFiltered = false;
                source.filterNoMatch = true;
                walkDataDFS(source, function(child) {
                    child.leafmatchedFilter = false;
                });
            }
        }

        /**
         * runs over a data tree in depth-first manner
         */
        function walkDataDFS(data, eachChild) {
            function walk(d) {
                eachChild(d);
                if (d.hasChildren || (d.children && d.children.length)) {
                    loDash.forEach(d.children, walk);
                }
            }
            walk(data);
        }

        /**
         *
         * @param data
         * @param filters
         * @param matchFn
         * @returns {*}
         */
        function filterData(data, filters, matchFn) {

            loDash.forEach(filters, function(filter) {
                matchFilter(data, filter, matchFn);
            });
        }

        /**
         *
         * @param data
         * @param filter
         * @param matchFn
         */
        function matchFilter(data, filter, matchFn) {
            matchPath(data, filter.path, filter.title, matchFn);
        }

        /**
         *
         * @param data
         * @param path
         * @param matchdata
         * @param matchFn
         */
        function matchPath(data, path, matchdata, matchFn) {

            var pathArray = path.split('.');

            if (data.name === null || typeof data.name === 'undefined') {
                data.name = '';
            }

            var matches = false;
            if (data.name.toString() === pathArray[0].toString() || data.name.toString() === (pathArray[0] + '...')) {
                if (data.name.toString() !== (pathArray[0] + '...')) {
                    pathArray.shift();
                }

                if (data.children) {
                    var allMatches = loDash.map(data.children, function(child) {
                        return matchPath(child, pathArray.join('.'), matchdata, matchFn);
                    });
                    matches = loDash.any(allMatches);
                } else {
                    matches = matchFn(data.title, matchdata);
                }
            }

            data.leafmatchedFilter = matches;
            return matches;
        }

        return {
            annotateMatches: annotateMatches,
            applyFilter: applyFilter,
            buildFilterInputs: buildFilterInputs
        };
    });
