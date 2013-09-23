'use strict';

angular.module('dmpApp')
  .controller('DataObjectCtrl', ['$scope', '$routeParams', 'FileResource', function ($scope, $routeParams, FileResource) {

    $scope.file = FileResource.get({id: $routeParams.id})
  }]);
