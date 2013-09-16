'use strict';

angular.module('dmpApp')
  .controller('ComponentsCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.internalName = 'Function List Widget';

    /**
     * Model for a list of functions, that are available.
     *
     * @type {Object}
     */
    $scope.functions = {
      'name': 'Functions',
      'show': true,
      'children': []
    };

    $http.get('/data/functions.json')
      .success(function (result) {
        $scope.functions.children = result['functions'];
      });
  }])
  .directive('components', [ function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'views/directives/components.html',
        controller: 'ComponentsCtrl'
    };
  }]);
