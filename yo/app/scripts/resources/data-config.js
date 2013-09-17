angular.module('dmpApp')
    .factory('DataConfigResource', ['$resource', '$window', function($resource, $window) {
        var baseUrl = $window['dmp']['jsRoutes']['api']
            , endpoint = 'configurations/:id';

        return $resource(baseUrl + endpoint);
    }]);