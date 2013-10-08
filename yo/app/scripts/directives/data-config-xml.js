'use strict';

angular.module('dmpApp')
    .controller('DataConfigXmlCtrl', ['$scope', '$location', '$routeParams', 'DataConfigResource', function ($scope, $location, $routeParams, DataConfigResource) {

        $scope.selectedSet = [];

        $scope.config = {
            name : 'xml',
            description : 'xml with id ' + $routeParams.resourceId,
            parameters : {
                'storage_type' : 'xml'
            }
        };

        // TEMP
        $scope.config.id = 1;

        DataConfigResource.query({ resourceId: $routeParams.resourceId }, function(result) {

            $scope.selectedSet.push(result[result.length-1].parameters['schema_file']);

        });

        $scope.onSaveClick = function() {

            $scope.config.parameters['schema_file'] = $scope.selectedSet[0];

            DataConfigResource.save({ resourceId: $routeParams.resourceId }, $scope.config, function() {
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
