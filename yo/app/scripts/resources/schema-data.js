'use strict';

angular.module('dmpApp')
    .factory('SchemaDataResource', ['$resource', 'Util', function($resource, Util) {

        var baseUrl =  Util.apiEndpoint,
            endpoint = 'resources/:id/configurations/:cid/:kind';

        return $resource(baseUrl + endpoint, {
            id: '@id',
            cid: '@cid'
        }, {
            schema: {
                method: 'GET',
                params: {
                    kind: 'schema',
                    id: '@id',
                    cid: '@cid'
                },
                cache: true
            },
            oldSchema: {
                method: 'GET',
                params: {
                    kind: 'schema',
                    id: '@id',
                    cid: '@cid'
                },
                transformResponse: function (data, headers) {
                    if (angular.lowercase(headers('content-type')) === 'application/json') {
                        return {data: JSON.parse(data)};
                    }
                    return data;
                },
                cache: true
            },
            data: {
                method: 'GET',
                isArray: true,
                params: {
                    kind: 'data',
                    id: '@id',
                    cid: '@cid',
                    atMost: '@atMost'
                },
                transformResponse: function (data, headers) {
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
        });
    }]);
