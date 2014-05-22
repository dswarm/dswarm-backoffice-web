'use strict';

angular.module('dmpApp')
    .controller('DataConfigXmlCtrl', function($scope, $location, $routeParams, DataModelResource, ResourceResource, Util, ngProgress) {

        var resource = null;
        $scope.resourceId = $routeParams.resourceId;

        $scope.selectedSet = [];

        $scope.config = {
            name: 'xml',
            description: 'xml with id ' + $scope.resourceId,
            parameters: {
                'storage_type': 'xml'
            }
        };

        $scope.saving = false;

        function getConfig() {
            var config = angular.copy($scope.config);

            if ($scope.selectedSet[0]) {
                config.parameters['schema_file'] = {
                    id: $scope.selectedSet[0].id,
                    name: $scope.selectedSet[0].name,
                    description: $scope.selectedSet[0].description
                };
            }

            return config;
        }

        ResourceResource.get({ id: $scope.resourceId }, Util.mapResources(function(result, config) {

            resource = result;

            if (config) {

                $scope.config.id = config.id;

                $scope.config.name = config.name;
                $scope.config.description = config.description;
                $scope.config.parameters = config.parameters;

                $scope.selectedSet.push(config.parameters['schema_file']);
            }
        }));

        $scope.onSaveClick = function() {
            if (!$scope.saving) {
                $scope.saving = true;
                ngProgress.start();

                var model = {
                    'data_resource': resource,
                    'name': resource.name,
                    'description': resource.description,
                    'configuration': getConfig()
                };

                DataModelResource.save({}, model, function() {
                    ngProgress.complete();
                    $scope.saving = false;
                    $location.path('/data/');
                }, function() {
                    $scope.saving = false;
                    ngProgress.complete();
                });
            }
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
