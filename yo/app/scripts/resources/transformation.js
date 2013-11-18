'use strict';

angular.module('dmpApp')
    .factory('TransformationResource', ['$resource', 'Util', function($resource, Util) {

        var baseUrl = Util.apiEndpoint,
            singleEndpoint = 'transformations',
            multiEndpoint = 'jobs';

        return $resource(baseUrl + singleEndpoint, {}, {
            one: {
                method: 'POST',
                cache: false
            },
            all: {
                method: 'POST',
                url: baseUrl + multiEndpoint,
                cache: false
            }
        });
    }]);
