'use strict';

angular.module('dmpApp')
    .factory('SchemaDataResource', ['$resource', '$window', function($resource, $window) {
        var baseUrl = $window['dmp']['jsRoutes']['api']
            , endpoint = 'resources/:id/configurations/:cid/:kind';

        return $resource(baseUrl + endpoint);
    }]);
