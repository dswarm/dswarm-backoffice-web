'use strict';

angular.module('dmpApp')
    .factory('ConfigurationResource', function(ResourceFactory) {

        return ResourceFactory.create('configurations', function() {
            return {
                update: {
                    method: 'PUT'
                }
            };
        });
    });
