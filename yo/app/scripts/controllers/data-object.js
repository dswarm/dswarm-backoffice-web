'use strict';

angular.module('dmpApp')
    .controller('DataObjectCtrl', function ($scope, $routeParams, FileResource) {

        $scope.file = FileResource.get({id: $routeParams.id});
    });
