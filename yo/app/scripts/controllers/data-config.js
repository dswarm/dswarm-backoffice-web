'use strict';

angular.module('dmpApp')
    .controller('DataConfigCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {

        $scope.configType = $routeParams.configType;

    }]);
