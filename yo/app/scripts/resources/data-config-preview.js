'use strict';

angular.module('dmpApp')
    .factory('DataConfigPreviewResource', function(ResourceFactory) {

        return ResourceFactory.create('resources', function(url) {
            return {
                preview: {
                    method: 'POST',
                    url: url + '/configurationpreview'
                }
            };
        });
    });
