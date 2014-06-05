'use strict';

angular.module('dmpApp')
    .controller('DataConfigCtrl', function($scope, ngProgress, $routeParams, $location) {

        $scope.configType = $routeParams.configType;

        $scope.mode = $routeParams.dataModelId ? 'edit' : 'create';

        $scope.returnToData = function() {
            $scope.saving = false;
            ngProgress.complete();
            $location.path('/data/');
        }

    });
