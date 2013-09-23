'use strict';

angular.module('dmpApp')
  .controller('DataListCtrl', ['$scope', '$routeParams', 'FileResource', function ($scope, $routeParams, FileResource) {

    $scope.files = FileResource.query();
  }]);
