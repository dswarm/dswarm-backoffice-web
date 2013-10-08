'use strict';

angular.module('dmpApp')
    .controller('DataConfigSchemaCtrl', ['$scope', '$location', '$routeParams', 'DataConfigResource', function ($scope, $location, $routeParams, DataConfigResource) {

        $scope.config = {
            name : 'schema',
            description : 'schema with id ' + $routeParams.resourceId,
            parameters : {
                'storage_type' : 'schema'
            }
        };

        // TEMP
        $scope.config.id = 1;

        $scope.onFlagClick = function() {

            DataConfigResource.save({ resourceId: $routeParams.resourceId }, $scope.config, function() {
                $location.path('/data/');
            });

        };

        $scope.onCancelClick = function() {
            $location.path( '#/data/' );
        };

    }])
    .directive('dataconfigschema', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'views/directives/data-config-schema.html',
            controller: 'DataConfigSchemaCtrl'
        };
    }]);
