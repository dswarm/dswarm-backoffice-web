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
    .controller('SelectedRecordsDataCtrl', function($scope, gdmParser, DataModelResource, PubSub, loDash) {

        $scope.internalName = 'Selected Records Data Widget';

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
            return $scope.showData ? 'selectedrecorddata' : '';
        };

        function getSchema(record, dataModel) {
            return gdmParser.parse(record, dataModel.schema);
        }

        function processRecordsData(message) {

            var dataResult = message.records;
            var dataModel = message.dataModel;

            $scope.originalRecords = dataResult;
            $scope.selectedRecords = loDash.map(dataResult, function (record) {
                return {
                    id: record.id,
                    data: getSchema(record.data, dataModel)
                };
            });
            $scope.showData = true;
            $scope.selectedTab = 0;
        }

        $scope.loadData = function(dataModel) {

            if (loDash.isEmpty(dataModel) || loDash.isEmpty(dataModel.schema)) {
                return;
            }

            $scope.schema = dataModel.schema;
            $scope.resourceName = dataModel.name;

            DataModelResource.data({

                id: dataModel.uuid,
                atMost: 3

            }, function(dataResult) {

                var message = {
                    records: dataResult,
                    dataModel: dataModel
                };

                processRecordsData(message);
            });
        };

        function init() {

            $scope.loadData($scope.inputDataModel);
        }

        init();
        PubSub.subscribe($scope, ['selectedRecordsDataSelected', 'projectDraftDiscarded', 'projectModelChanged', 'restoreCurrentProject'], init);

        PubSub.subscribe($scope, 'getLoadData', function() {

            PubSub.broadcast('returnFullLoadData', {
                records: $scope.originalRecords,
                schema: $scope.schema
            });

        });

        PubSub.subscribe($scope, 'updateRecordsData', processRecordsData);

    })
    .directive('selectedRecordsData', function() {
        return {
            scope: true,
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/selected-records-data.html',
            controller: 'SelectedRecordsDataCtrl'
        };
    });
