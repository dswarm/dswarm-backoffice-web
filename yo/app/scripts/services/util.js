'use strict';

angular.module('dmpApp')
    .factory('Util', ['$window', function ($window) {

        function latestBy(list, property) {
            var prop = property || 'id';
            return $window['_'].max(list, prop);
        }

        return {
            latestBy: latestBy
        };
    }]);
