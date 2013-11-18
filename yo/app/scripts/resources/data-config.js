'use strict';

angular.module('dmpApp')
    .factory('DataConfigResource', ['$resource', 'Util', function($resource, Util) {

        var baseUrl =  Util.apiEndpoint,
            endpoint = 'resources/:resourceId/configurations';

        return $resource(baseUrl + endpoint);

    }]);
