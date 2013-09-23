'use strict';

angular.module('dmpApp')
    .factory('DataConfigResource', ['$resource', '$window', function($resource, $window) {

        var baseUrl = ($window && $window['dmp']) ? $window['dmp']['jsRoutes']['api'] : ''
            , endpoint = 'resources/:resourceId/configurations';

        return $resource(baseUrl + endpoint);

    }]);