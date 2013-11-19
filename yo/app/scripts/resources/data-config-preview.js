'use strict';

angular.module('dmpApp')
    .factory('DataConfigPreviewResource', ['$resource', 'Util', function($resource, Util) {

        var baseUrl =  Util.apiEndpoint,
            endpoint = 'resources/:resourceId/configurationpreview';

        return $resource(baseUrl + endpoint);

    }]);
