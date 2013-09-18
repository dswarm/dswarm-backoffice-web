'use strict';

angular.module('dmpApp')
  .factory('buildInfo', ['$http', function($http) {
    var promise = $http.get('/data/version.json');
    promise.get = function(cb) {
      promise.success(function(resp) {
        cb(resp.build_info);
      });
    };

    return promise;
  }])
  .directive('appVersion', ['buildInfo', function (version) {
    return function(scope, iElement) {
      version.get(function(buildInfo) {
        iElement.text('Build: ' + buildInfo.revision + ' at ' + buildInfo.date)
      })

    };
  }]);
