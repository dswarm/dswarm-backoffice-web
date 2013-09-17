angular.module('dmpApp')
  .controller('DataListCtrl', ['$scope', 'FileResource', function ($scope, FileResource) {

    $scope.files = FileResource.query();
  }]);
