'use strict';

angular.module('dmpApp')
    .factory('ProjectResource', ['$resource', 'Util', function($resource, Util) {

        var baseUrl = Util.apiEndpoint,
            endpoint = 'projects/:id';

        return $resource(baseUrl + endpoint, {}, {
            'update': { method:'PUT' }
        });

        return ResourceFactory.create('projects');
    }]);
