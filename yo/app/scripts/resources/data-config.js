'use strict';

angular.module('dmpApp')
    .factory('DataConfigResource', function(ResourceFactory) {

        return ResourceFactory.create('resources', function(url) {
            return {
                save: {
                    method: 'POST',
                    url: url + '/configurations'
                }
            };
        });
    });
