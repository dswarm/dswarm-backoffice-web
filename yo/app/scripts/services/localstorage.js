'use strict';

angular.module('dmpApp')
/**
 * Factory for creating localStorage backed models,
 * that automatically save and restore its values
 */
    .factory('ModelFactory', ['$resource', '$rootScope', 'localStorageService', function($resource, $rootScope, ls) {

        var services = {};

        function create(name) {
            if (services.hasOwnProperty(name)) {
                return services[name];
            }

            var service = {
                model: {},
                persist: function() {
                    save();
                }
            };

            function save() {
                ls.set(name, service.model);
            }

            function restore() {
                var m = ls.get(name);
                if (angular.isDefined(m)) {
                    service.model = m;
                }
            }

            $rootScope.$on('savestate', save);
            $rootScope.$on('restorestate', restore);

            services[name] = service;

            return service;
        }

        return {
            create: create
        };
    }]);
