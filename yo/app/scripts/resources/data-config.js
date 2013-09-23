angular.module('dmpApp')
    .factory('DataConfigResource', ['$resource', '$window', '$location', function($resource, $window, $location) {

        var baseUrl = ($window && $window['dmp']) ? $window['dmp']['jsRoutes']['api'] : ''
            , endpoint = 'resources/:resourceId/configurations';

        return $resource(baseUrl + endpoint);

    }]);