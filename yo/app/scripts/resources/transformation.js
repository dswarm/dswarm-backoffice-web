'use strict';

angular.module('dmpApp')
    .factory('TransformationResource', function(ResourceFactory) {

        return ResourceFactory.create('transformations', function(_, baseUrl) {
            return {
                one: {
                    method: 'POST',
                    cache: false
                },
                all: {
                    method: 'POST',
                    url: baseUrl + 'jobs',
                    cache: false
                }
            };
        });
    });
