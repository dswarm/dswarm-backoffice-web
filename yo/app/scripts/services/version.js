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
    .directive('appVersion', ['buildInfo', '$window', function (version, $window) {
        return function(scope, iElement) {
            version.get(function(infoWeb, infoApi) {
                var text = [
                    'Web:', infoWeb.revision,
                    '--',
                    'API:', infoApi.revision,
                    'at',
                    infoWeb.date
                ],
                    version = text.join(' ');

                var dmp = $window['dmp'] || {};
                dmp['version'] = version;
                $window['dmp'] = dmp;

                iElement.text(version);
                iElement.attr('id', 'footer-build-information');
            });

        };
    }]);
