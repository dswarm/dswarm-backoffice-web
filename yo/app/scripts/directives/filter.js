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
    .controller('FilterCtrl', function($scope, $http, $q, $modalInstance, loDash, gdmParser, schemaParser, filterHelper, PubSub, mapping, attributePathId, filters) {

        $scope.internalName = 'Filter Widget';

        $scope.activeMapping = mapping;
        $scope.filters = filters;

        $scope.dataSource = {};
        $scope.dataSchema = {};
        $scope.dataLoaded = false;

        var originalSource = {};

        // deactivated until further notice
        /* jshint ignore:start */
        function restrictSchema(schema, pathId) {
            var exactPath = loDash.find(schema.attribute_paths, { uuid: pathId });

            if (angular.isDefined(exactPath)) {
                var exactAttributes = exactPath.attributes;

                schema.attribute_paths = loDash.filter(schema.attribute_paths, function(ap) {

                    return loDash.every(exactAttributes, function(a, i) {

                        return ap.attributes[i] && ap.attributes[i].uuid === a.uuid;
                    });
                });
            }
        }
        /* jshint ignore:end */

        $scope.expandCollapse = function(that, data) {

            data.$wasRendered = true;
            data.$show = !data.$show;

        };

        $scope.wasRendered = function(data) {
            return data.$wasRendered;
        };

        $scope.isCollapsed = function(data) {
            return !data.$show;
        };

        $scope.update = function() {

            var inputFilterCollection = filterHelper.buildFilterInputs(filters);

            filterHelper.annotateMatches($scope.dataSource, inputFilterCollection, function(a, b) {
                return a === b;
            });

            return true;
        };

        $scope.addFilter = function() {

            filters.push({
                filter: schemaParser.fromDomainSchema($scope.dataSchema, true),
                inputFilters: [],
                name: 'new filter'
            });

        };

        $scope.close = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.save = function() {
            $modalInstance.close();
        };

        PubSub.ask($scope, 'getLoadData', {}, 'returnLoadData', function(args) {

            if (args.record) {
                var schema = angular.copy(args.schema);
                // deactivated until further notice
//                if (attributePathId) {
//                    restrictSchema(schema, attributePathId);
//                }

                schema.name = schema.name || '';

                originalSource = gdmParser.parse(args.record.data, schema);

                $scope.dataSource = originalSource;
                $scope.dataSchema = schema;

                $scope.update();

                $scope.dataLoaded = true;
            }
        });

    });
