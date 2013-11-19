'use strict';

angular.module('dmpApp')
    .factory('Util', ['$window', function ($window) {

        var api = ($window && $window['dmp']) ? $window['dmp']['jsRoutes']['api'] : '';

        function latestBy(list, property) {
            var prop = property || 'id';
            return $window['_'].max(list, prop);
        }

        return {
            latestBy: latestBy,
            apiEndpoint: api
        };
    }]);
