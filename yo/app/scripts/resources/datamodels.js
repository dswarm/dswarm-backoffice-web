'use strict';

angular.module('dmpApp')
    .factory('DataModelResource', function(ResourceFactory, loDash) {

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
                            var parsedData = JSON.parse(data);
                            data = loDash.map(parsedData, function(blob, recordId) {
                                return {
                                    id: recordId,
                                    data: blob
                                };
                            });
                        }
                        return data;
                    },
                    cache: true
                }
            };
        });
    });
