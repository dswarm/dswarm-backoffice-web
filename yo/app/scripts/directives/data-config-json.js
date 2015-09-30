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
    .controller('DataConfigJsonCtrl', function($scope, $location, $routeParams, DataModelResource, ResourceResource, ConfigurationResource, Util, ngProgress, GUID) {

        var resource = null;

        $scope.dataModel = {};

        $scope.resourceId = $routeParams.resourceId;
        $scope.configType = $routeParams.configType;

        $scope.selectedSet = [];

        $scope.config = {
            parameters: {
                'storage_type': $scope.configType,
                'record_tag': ''
            }
        };

        $scope.saving = false;

        function getConfig() {
            var config = angular.copy($scope.config);

            if(!config.uuid) {
                config.uuid = GUID.uuid4();
            }

            return config;
        }

        function applicableAsPlaceholder(config) {
            return config !== null && config.parameters['storage_type'] === $scope.configType;
        }

        if ($scope.mode === 'create' && $routeParams.resourceId) {

            ResourceResource.get({ id: $scope.resourceId }, Util.mapResources(function(result, config) {
                resource = result;
                if (applicableAsPlaceholder(config)) {
                    $scope.config.name = config.name;
                    $scope.config.description = config.description;
                    $scope.config.parameters = config.parameters;
                }
            }));

        } else if ($scope.mode === 'edit' && $routeParams.dataModelId) {

            DataModelResource.get({id: $routeParams.dataModelId }, function(result) {

                $scope.dataModel = result;
                resource = result.data_resource;
                $scope.resourceId = resource.uuid;

                $scope.config = result.configuration;

            });

        }

        $scope.onSaveClick = function() {
            if (!$scope.saving) {
                $scope.saving = true;
                ngProgress.start();

                if ($scope.mode === 'create' && resource !== null) {

                    var model = {
                        'data_resource': resource,
                        'name': $scope.dataModel.name,
                        'description': $scope.dataModel.description,
                        'configuration': getConfig(),
                        'uuid': GUID.uuid4()
                    };

                    DataModelResource.save({}, model, function() {
                        ngProgress.complete();
                        $scope.saving = false;
                        $location.path('/data/');
                    }, function(error) {
                        ngProgress.complete();
                        $scope.saving = false;

                        $scope.$parent.$parent.configError = error.data.error;

                    });

                } else if ($scope.mode === 'edit' && $scope.dataModel !== null) {

                    $scope.dataModel.configuration = getConfig();

                    DataModelResource.update({id: $scope.dataModel.uuid}, $scope.dataModel, $scope.returnToData, function() {
                        $scope.saving = false;
                        ngProgress.complete();
                    });

                }
            }
        };

        $scope.onCancelClick = function() {
            $location.path('/data/');
        };

    })
    .directive('dataconfigjson', function() {
        return {
            restrict: 'E',
            replace: false,
            scope: true,
            templateUrl: 'views/directives/data-config-json.html',
            controller: 'DataConfigJsonCtrl'
        };
    });
