'use strict';

angular.module('dmpApp')
    .factory('buildInfo', function($http) {
        var promise = $http.get('/data/version.json');
        promise.get = function(cb) {
            promise.success(function(resp) {
                cb(resp.web, resp.api);
            });
        };

        return promise;
    })
    .directive('appVersion', function ($window, buildInfo) {
        return function(scope, iElement) {
            buildInfo.get(function(infoWeb, infoApi) {
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
    });
