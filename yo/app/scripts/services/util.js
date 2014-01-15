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


        /**
         * Helper function that maps over `resources` that may have a configuration
         * @param func
         * @returns {Function}
         */
        function mapResources(func) {
            return function(resource) {
                if (resource.configurations) {
                    var latestConfig = latestBy(resource.configurations);
                    if (angular.isObject(latestConfig)) {
                        return func(resource, latestConfig);
                    }
                }
                return func(resource, null);
            };
        }

        /**
         * collect works like map, except that it filters out any `undefined` values.
         * It is like map and filter combined.
         *
         * so instead of
         * <code>
         *     var evens = _.filter([1,2,3,4,5], function(x){ return x % 2 === 0});
         *     var squaredEvens = _.map(evens, function(x){ return x * x });
         *     // -> [4, 16]
         * </code>
         *
         * one can use collect like this
         * <code>
         *     var squaredEvens = collect([1,2,3,4,5], function(x){ if (x % 2 === 0) return x * x })
         * </code>
         *
         * @param seq      sequence to map over. sequence might be an array or an object.
         * @param func     mapping function, that might return nothing (undefined or null)
         * @param thisObj  `this` for the function
         * @returns {Array}
         */
        function collect(seq, func, thisObj) {
            return loDash(seq).map(func, thisObj).filter(function(el) {return el !== undefined && el !== null;}).valueOf();
        }

        return {
            latestBy: latestBy,
            mapResources: mapResources,
            collect: collect,
            apiEndpoint: api
        };
    }])
/**
 * Factory for creating basic resources, that follow a typial pattern.
 * TODO: what cas restangular do here for us?
 */
    .factory('ResourceFactory', ['$resource', 'Util', function($resource, Util) {

        var baseUrl =  Util.apiEndpoint;

        function create(resource, actionsFactory) {
            var endpoint = resource + '/:id',
                finalUrl = baseUrl + endpoint;

            if (angular.isFunction(actionsFactory)) {
                return $resource(finalUrl, undefined, actionsFactory(finalUrl));
            }

            return $resource(finalUrl);
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
