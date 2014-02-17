'use strict';

angular.module('dmpApp')
    .factory('FileResource', function (ResourceFactory) {

        return ResourceFactory.create('resources', function (url) {
            return {
                lines: {
                    method: 'GET',
                    url: url + '/lines',
                    params: {
                        id: '@id'
                    },
                    cache: false
                }
            };
        });
    });
