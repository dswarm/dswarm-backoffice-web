/**
 * Copyright (C) 2013, 2014  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 * http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
