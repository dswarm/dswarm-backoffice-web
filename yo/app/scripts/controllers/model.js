'use strict';

angular.module('dmpApp')
    .controller('ModelCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
        $scope.resourceId = $routeParams.resourceId;
        $scope.configId = $routeParams.configId;
    }]);
