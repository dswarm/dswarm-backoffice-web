'use strict';

angular.module('dmpApp')
    .factory('normalizeKey', function() {
        var invalidIdentifierRegex = '`~!@#$%^&*()_|+\\-=?;:\'",.<>\\n\\t\\r\\{\\}\\[\\]\\\\/ \\u0080-\\uFFFF';
        var keyRegex = new RegExp('[' + invalidIdentifierRegex + ']', 'gi');

        return function normalizeKey(key) {
            return (key + '').replace(keyRegex, '');
        };
    });
