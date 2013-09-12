'use strict';

angular.module('dmpApp')
  .controller('TargetDataCtrl', ['$scope', '$http', '$q', 'schemaParser', 'PubSub', function ($scope, $http, $q, schemaParser, PubSub) {
    $scope.internalName = 'Target Data Widget';

    $scope.data = {};

    var schemaPromise = $http.get('/data/targetschema.json');

    PubSub.subscribe($scope, 'transformationFinished', function(data) {
      var deferred = $q.defer()
        , all = $q.all([schemaPromise, deferred.promise]);

      all.then(function(results) {
        var schema = results[0].data
          , transformation = results[1];

        if (transformation && transformation[schema['title']]) {
          $scope.data = schemaParser.parseAny(transformation[schema['title']], schema['title'], schema);
        }
      });

      deferred.resolve(data);
    });

  }])
  .directive('targetdata', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'views/directives/target-data.html',
        controller: 'TargetDataCtrl',
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

