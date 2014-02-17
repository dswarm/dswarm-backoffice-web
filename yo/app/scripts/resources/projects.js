'use strict';

angular.module('dmpApp')
    .factory('ProjectResource', function (ResourceFactory) {

        return ResourceFactory.create('projects', function() {
            return {
                'update': { method:'PUT' }
            };
        });
    });
