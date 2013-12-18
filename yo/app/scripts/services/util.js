'use strict';

angular.module('dmpApp')
/**
 * Provide an injectable lo-dash.
 * see http://lodash.com/docs for documentation on lodash
 */
    .factory('Lo-Dash', ['$window', function($window) {
        return $window['_'];
    }])
/**
 * Provide utility functions for miscellaneous operations
 */
    .factory('Util', ['$window', 'Lo-Dash', function ($window, loDash) {

        var api = ($window && $window['dmp']) ? $window['dmp']['jsRoutes']['api'] : '';

        function latestBy(list, property) {
            var prop = property || 'id';
            return loDash.max(list, prop);
        }

        return {
            latestBy: latestBy,
            apiEndpoint: api
        };
    }])
/**
 * Factory for creating basic resources, that follow a typial pattern.
 * TODO: what cas restangular do here for us?
 */
    .factory('ResourceFactory', ['$resource', 'Util', function($resource, Util) {

        var baseUrl =  Util.apiEndpoint;

        function create(resource, paramDefaults, actions) {
            var endpoint = resource + '/:id';

            return $resource(baseUrl + endpoint, paramDefaults, actions);
        }

        return {
            create: create
        };
    }])
/**
 * Provide utility functions to generate UUID-4-ish pseudo-random identifiers.
 * For more concrete implementations, refer to
 * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 */
    .factory('GUID', [function(){
        /**
         * Random parts for GUID
         * @returns {string} guid part
         */
        function s4(){
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        /**
         * Create a GUID
         * @returns {string} the guid
         */
        function guid() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        return {
            'uuid4': guid
        };
    }]);
