'use strict';

angular.module('dmpApp')
    .factory('DataModelResource', function(ResourceFactory) {

        return ResourceFactory.create('datamodels', function(baseUrl) {
            return {
                data: {
                    method: 'GET',
                    url: baseUrl + '/data',
                    isArray: true,
                    params: {
                        atMost: '@atMost'
                    },
                    transformResponse: function(data, headers) {
                        if (angular.lowercase(headers('content-type')) === 'application/json') {
                            var parsedData = JSON.parse(data),
                                transformed = [];
                            angular.forEach(parsedData, function(blob, rid) {
                                blob.recordId = rid;
                                transformed.push(blob);
                            });
                            data = transformed;
                        }
                        return data;
                    },
                    cache: true
                }
            };
        });
    });
