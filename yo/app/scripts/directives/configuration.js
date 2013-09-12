'use strict';

angular.module('dmpApp')
  .controller('ConfigurationCtrl', ['$scope', 'PubSub', function ($scope, PubSub) {

    $scope.internalName = 'Configuration Widget';

    $scope.component = null;

    $scope.getPattern = function (pattern) {
      return pattern? new RegExp('^' + pattern + '$') : /.*/;
    };

    $scope.formClasses = function (input, isOptional) {
      return {
        'has-error': input.$invalid,
        'has-success': !isOptional && input.$valid
      };
    };

    PubSub.subscribe($scope, 'handleEditConfig', function(args) {
      $scope.component = args['payload'];
    });

    $scope.onSaveClick = function() {
      $scope.component = null;
    };

  }])
  .directive('configuration', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'views/directives/configuration.html',
        controller: 'ConfigurationCtrl',
        compile: function (tElement, tAttrs) {
            var contents = tElement.contents().remove()
                , compiledContents
                , isInternal = angular.isDefined(tAttrs.internal);

            return function (scope, iElement) {
                if (!compiledContents) {
                    compiledContents = $compile(contents);
                }

                compiledContents(scope, function (clone) {
                    iElement.append(clone);
                });
            };
        }
    };
  }]);
