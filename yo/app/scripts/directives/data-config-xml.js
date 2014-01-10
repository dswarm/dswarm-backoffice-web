'use strict';

angular.module('dmpApp')
    .controller('DataConfigXmlCtrl', ['$scope', '$location', '$routeParams', 'DataModelResource', 'ResourceResource', 'Util',
    function ($scope, $location, $routeParams, DataModelResource, ResourceResource, Util) {

        var resource = null;
        $scope.resourceId = $routeParams.resourceId;

        $scope.selectedSet = [];

        $scope.config = {
            name : 'xml',
            description : 'xml with id ' + $scope.resourceId,
            parameters : {
                'storage_type' : 'xml'
            }
        };

        function getConfig() {
            return angular.copy($scope.config);
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

            $scope.config.parameters['schema_file'] = {
                id: $scope.selectedSet[0].id,
                name: $scope.selectedSet[0].name,
                description: $scope.selectedSet[0].description
            };

            var model = {
                'data_resource': resource,
                'name'         : resource.name,
                'description'  : resource.description,
                'configuration': getConfig()
            };

            DataModelResource.save({}, model, function() {
                $location.path('/data/');
            });
        };

        $scope.onCancelClick = function() {
            $location.path( '#/data/' );
        };

    }])
    .directive('dataconfigxml', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/data-config-xml.html',
            controller: 'DataConfigXmlCtrl'
        };
    }]);
