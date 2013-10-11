'use strict';

angular.module('dmpApp')
    .factory('FileResource', ['$resource', '$window', function($resource, $window) {
        var baseUrl = $window['dmp']['jsRoutes']['api']
            , endpoint = 'resources/:id';

        return $resource(baseUrl + endpoint, {
            id: '@id'
        }, {
            lines: {
                method: 'GET',
                url: baseUrl + 'resources/:id/lines',
                params: {
                    id: '@id'
                },
                cache: false
            }
        });
    }]);
