/**
 * Copyright (C) 2013, 2014  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
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
    .controller('ExportCtrl', function($scope, DataModelResource, fileDownload, loDash, Neo4jEndpoint, ApiEndpoint) {

        $scope.models = [];
        $scope.selectedModel = [];
        $scope.exportUri = '';

        $scope.onExportAllClick = function(format) {
            var fileUrl = Neo4jEndpoint + 'rdf/getall?format=' + encodeURIComponent(format);

            fileDownload(fileUrl);
        };

        $scope.onExportModelClick = function(format) {

            var fileUrl = ApiEndpoint + 'datamodels/' + $scope.selectedModel[0].id + '/export?format=' + encodeURIComponent(format);

            fileDownload(fileUrl);

        };

        $scope.updateGridData = function() {

            DataModelResource.query(function(results) {

                $scope.models = results;

                $scope.models = loDash.map($scope.models, function(result) {

                    result['storage_type'] = result.configuration && result.configuration.parameters['storage_type'];

                    return result;
                });
            }, function() {
                $scope.models = '';
            });

        };

        $scope.modelListOptions = {
            data: 'models',
            columnDefs: [
                {field: 'name', displayName: 'Name'},
                {field: 'description', displayName: 'Description '},
                {field: 'storage_type', displayName: 'Configured Data Storage Type'}
            ],
            enableColumnResize: false,
            selectedItems: $scope.selectedModel,
            multiSelect: false
        };

        $scope.updateGridData();

    });
