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
    .controller('DataConfigXmlCtrl', function($scope, $location, $routeParams, dataConfigText) {

        var resource = null;
        $scope.dataModel = {};
        $scope.resourceId = $routeParams.resourceId;

        $scope.config = {
            parameters: {
                'storage_type': $routeParams.configType
            }
        };

        $scope.selectedSet = [];

        switch($routeParams.configType) {

            case 'mabxml':
                $scope.config.parameters.record_tag = 'datensatz';
                break;

            case 'marc21':
                $scope.config.parameters.record_tag = 'record';
                break;

            case 'pnx':
                $scope.config.parameters.record_tag = 'record';
                break;

            case 'oai-pmh+dce':
                $scope.config.parameters.record_tag = 'record';
                break;

            case 'oai-pmh+dct':
                $scope.config.parameters.record_tag = 'record';
                break;

            case 'oai-pmh+marcxml':
                $scope.config.parameters.record_tag = 'record';
                break;

            case 'oai-pmh+dce+edm':
                $scope.config.parameters.record_tag = 'record';
                break;

        }

        function getConfig() {
            var config = angular.copy($scope.config);

            if ($scope.selectedSet[0]) {
                config.parameters['schema_file'] = {
                    uuid: $scope.selectedSet[0].uuid,
                    name: $scope.selectedSet[0].name,
                    description: $scope.selectedSet[0].description
                };
            }

            return config;
        }

        var configPromise = dataConfigText.newTextConfig($scope.mode, $routeParams.resourceId, $routeParams.dataModelId, $routeParams.configType);
        configPromise.then(function(data) {
            resource = data.resource;
            $scope.config = angular.extend($scope.config, data.config);
            $scope.dataModel = data.dataModel || {};
            if (data.resourceId && data.resourceId !== $scope.resourceId) {
                $scope.resourceId = data.resourceId;
            }
            if (data.config && data.config.parameters && data.config.parameters['schema_file']) {
                $scope.selectedSet.push(data.config.parameters['schema_file']);
            }
        });

        $scope.onSaveClick = function() {
            var enhanceDataResource = true;
            var savePromise = dataConfigText.save($scope.mode, resource, $scope.dataModel, getConfig(), enhanceDataResource);
            savePromise.then(function() {
                $location.path('/data/');
            } , function(error) {
                $scope.$parent.$parent.configError = error.data.error;
            });
        };

        $scope.onCancelClick = function() {
            $location.path('/data/');
        };

    })
    .directive('dataconfigxml', function() {
        return {
            restrict: 'E',
            replace: false,
            scope: true,
            templateUrl: 'views/directives/data-config-xml.html',
            controller: 'DataConfigXmlCtrl'
        };
    });
