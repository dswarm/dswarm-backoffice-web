/**
 * Copyright (C) 2013 – 2016  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
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
    .controller('SchemaListCtrl', function($scope, DataModelResource, Util) {

        $scope.files = [];

        DataModelResource.query(function(results) {

            //noinspection FunctionWithInconsistentReturnsJS
            $scope.files = Util.collect(results, function(dataModel) {
                var schema = dataModel.schema;
                if (schema) {

                    dataModel._$name = schema['name'] + ' (' + dataModel['name'] + ')';
                    dataModel._$description = schema['attribute_paths'].length + ' attribute paths, record class: ' + (schema['record_class'] || {}).name;

                    return dataModel;
                }
            });
        });

        $scope.schemaListOptions = {
            data: 'files',
            columnDefs: [
                {field: '_$name', displayName: 'Name'},
                {field: '_$description', displayName: 'Description '}
            ],
            enableColumnResize: false,
            selectedItems: $scope.items,
            multiSelect: false
        };


    })
    .directive('schemalist', function() {
        return {
            replace: false,
            restrict: 'E',
            scope: {
                items: '='
            },
            templateUrl: 'views/directives/schema-list.html',
            controller: 'SchemaListCtrl'
        };
    });
