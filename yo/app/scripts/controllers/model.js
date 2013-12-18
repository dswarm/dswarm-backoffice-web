'use strict';

angular.module('dmpApp')
    .controller('ModelCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
        $scope.dataModelId = $routeParams.dataModelId;
        $scope.schemaId = $routeParams.schemaId;
    }]);
