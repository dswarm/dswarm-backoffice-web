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
    .controller('SourceDataCtrl', function($scope, gdmParser, DataModelResource, PubSub, loDash) {

        $scope.internalName = 'Source Data Widget';

        $scope.data = {};
        $scope.records = [];
        $scope.schema = {};

        $scope.showData = false;

        $scope.resourceName = '';

        $scope.selectedTab = 0;

        $scope.selectTab = function(tab) {
            $scope.selectedTab = tab;
        };

        $scope.dataInclude = function() {
            return $scope.showData ? 'sourcedata' : '';
        };

        $scope.loadData = function(dataModel) {

            if (loDash.isEmpty(dataModel) || loDash.isEmpty(dataModel.schema)) {
                return;
            }

            function getSchema(record) {
                return gdmParser.parse(record, dataModel.schema);
            }

            $scope.schema = dataModel.schema;
            $scope.resourceName = dataModel.name;

            DataModelResource.data({

                id: dataModel.uuid,
                atMost: 3

            }, function(dataResult) {

                $scope.originalRecords = dataResult;
                $scope.records = loDash.map(dataResult, function(record) {
                    return {
                        id: record.uuid,
                        data: getSchema(record.data)
                    };
                });

                $scope.showData = true;
            });
        };

        function init() {
            $scope.loadData($scope.project.input_data_model);
        }

        init();
        PubSub.subscribe($scope, ['inputDataSelected', 'projectDraftDiscarded', 'projectModelChanged', 'changeOutputModel', 'restoreCurrentProject'], init);

        PubSub.subscribe($scope, 'getLoadData', function() {

            PubSub.broadcast('returnLoadData', {
                record: $scope.originalRecords[0],
                schema: $scope.schema
            });

        });
    })
    .directive('sourceData', function() {
        return {
            scope: true,
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/source-data.html',
            controller: 'SourceDataCtrl'
        };
    });
