'use strict';

angular.module('dmpApp')
    .factory('FileResource', ['$resource', 'Util', function($resource, Util) {

        var baseUrl = Util.apiEndpoint,
            endpoint = 'resources/:id';

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
