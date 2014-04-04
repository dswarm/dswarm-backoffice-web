'use strict';

angular.module('dmpApp')
    .controller('DataConfigCtrl', function($scope, $routeParams) {

        $scope.configType = $routeParams.configType;

    });
