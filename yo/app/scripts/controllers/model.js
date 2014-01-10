'use strict';

angular.module('dmpApp')
    .controller('ModelCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
        $scope.projectId = $routeParams.projectId;
        $scope.schemaId = $routeParams.schemaId;
    }]);
