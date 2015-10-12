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
    factory('filterHelper', function(loDash, Util) {

        var pathDelimiter = '\u001E';

        function makeForAll(singleFn) {
            return function(xs, arg) {
                var matcher = loDash.partial(singleFn, arg);
                return loDash.any(xs, matcher);
            };
        }

        /**
         * constructs a list of filtered schemas from a list of
         * path -> value filter-expressions
         *
         * @param schema an already parsed schema (use fromDomainSchema)
         * @param expression a filter expression as per backend storage ({ path : value })
         * @returns a list of {filter, inputFilter, name} objects that power the filter functionality
         */
        function applyFilter(schema, expressions) {

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
                var pathUris = key.split(pathDelimiter);

                loop(schema.children || [], pathUris, function(child) {
                    child.title = value.expression || '';

                    child.filterTypes = [
                        {id: 'NUMERIC', name: 'numeric filter'},
                        {id: 'REGEXP', name: 'regular expression'},
                        {id: 'EQUALS', name: 'equals'},
                        {id: 'NOTEQUALS', name: 'not-equals'}
                    ];

                    child.filterType = value.type ? loDash.select(child.filterTypes, function(filterType) {
                            return filterType.id === value.type;
                        }) : child.filterTypes[1];
                });
            }

            if(!loDash.isArray(expressions)) {
                expressions = [expressions];
            }

            loDash.forEach(expressions, function(expression) {
                loDash.forEach(expression, apply);
            });

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

                filter.inputFilters = getData(filter.filter);
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
        function getData(data) {

            function loop(d, p) {
                if (d.hasChildren || (d.children && d.children.length)) {
                    var paths = loDash.flatten(Util.collect(d.children, function(c) {
                        return loop(c, p.concat([d.name]));
                    }), true);
                    if (!loDash.isEmpty(paths)) {
                        return paths;
                    }
                } else if (d.title) {

                    var filterType = 'REGEXP';

                    if (d.filterType && d.filterType.id) {
                        filterType = d.filterType.id;
                    }

                    return {
                        title: d.title,
                        name: d.name,
                        filterType: filterType,
                        path: p.concat([d.name]).join(pathDelimiter),
                        apId: d._$path_id
                    };
                }
            }

            return loop(data, []);
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

        function filterData(data, filters, matchFn) {
            var titles = loDash.map(filters, 'title'),
                paths = loDash.zip(loDash.map(filters, function(filter) {
                    return filter.path.split(pathDelimiter);
                })),

                matchesTitle = loDash.partial(makeForAll(matchFn), titles),

                matchesPath = makeForAll(function(name, path) {
                    return (name === path || name === (path + '...'));
                }),

                shouldAdvance = makeForAll(function(name, path) {
                    return name !== (path + '...');
                });

            matchPath(data, paths, matchesTitle, matchesPath, shouldAdvance);
        }

        /**
         *
         * @param data
         * @param path
         * @param shouldAdvance
         * @param matchesTitle
         * @param matchesPath
         */
        function matchPath(data, path, matchesTitle, matchesPath, shouldAdvance) {

            var name = (data.name === null || typeof data.name === 'undefined') ? '' : data.name.toString();
            var matches = false;

            if (matchesPath(path[0], name)) {

                if (data.children) {
                    var subPath = path;
                    if (shouldAdvance(path[0], name)) {
                        subPath = path.slice(1);
                    }

                    var allMatches = loDash.map(data.children, function(child) {
                        return matchPath(child, subPath, matchesTitle, matchesPath, shouldAdvance);
                    });
                    matches = loDash.any(allMatches);
                } else {
                    matches = matchesTitle(data.title);
                }
            }

            data.leafmatchedFilter = matches;
            return matches;
        }

        function prepareFilters(filters, project) {

            return loDash.flatten(loDash.map(filters, function (filter) {
                //noinspection FunctionWithInconsistentReturnsJS
                return Util.collect(filter.inputFilters, function (f) {

                    var path = loDash.find(project.input_data_model.schema.attribute_paths, function (ap) {
                        return ap.attribute_path.uuid === f.apId;
                    });
                    if (path) {
                        path = Util.buildUriReference(path.attribute_path.attributes);
                        // path = loDash.pluck(path.attributes, 'uri').join('&amp;#30;');
                        return [path, f.title, f.filterType];
                    }
                });
            }), true);
        }

        function buildFilterExpression(filters) {

            return loDash.map(filters, function (filter) {

                var filterExpression = {};
                var filterExpressionBody = {
                    type: filter[2] || 'REGEXP',
                    expression: filter[1]
                };

                var filterAttributePath = filter[0];

                filterExpression[filterAttributePath] = filterExpressionBody;

                return filterExpression;
            });
        }

        return {
            annotateMatches: annotateMatches,
            applyFilter: applyFilter,
            buildFilterInputs: buildFilterInputs,
            prepareFilters: prepareFilters,
            buildFilterExpression: buildFilterExpression
        };
    });
