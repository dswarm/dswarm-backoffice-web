'use strict';

angular.module('dmpApp')
    .factory('SchemaAttributepathsResource', function(ResourceFactory) {

        return ResourceFactory.create('schemas', function(url) {
            return {
                add_attribute: {
                    method: 'POST',
                    url: url + '/attributepaths/:attributepathid',
                    params: {
                        id: '@id',
                        attributepathid: '@attributepathid'
                    },
                    cache: false
                }
            };
        });
    });
