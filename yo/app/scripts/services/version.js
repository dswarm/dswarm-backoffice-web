'use strict';

angular.module('dmpApp')
    .factory('buildInfo', ['$http', function($http) {
        var promise = $http.get('/data/version.json');
        promise.get = function(cb) {
            promise.success(function(resp) {
                cb(resp.web, resp.api);
            });
        };

        return promise;
    }])
    .directive('appVersion', ['buildInfo', function (version) {
        return function(scope, iElement) {
            version.get(function(infoWeb, infoApi) {
                var text = [
                    'Web:', infoWeb.revision,
                    '--',
                    'API:', infoApi.revision,
                    'at',
                    infoWeb.date
                ];
                iElement.text(text.join(' '));
            });

        };
    }]);
