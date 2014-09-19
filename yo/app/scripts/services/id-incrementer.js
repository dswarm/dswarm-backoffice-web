'use strict';

/**
 * @ngdoc service
 * @name dmpApp.idIncrementer
 * @description
 * # IdIncrementer
 * A factory function that returns an incrementer.
 * ## Incrementer
 * An incrementer is a function, that can be called and return an ever-increasing numeric string.
 *
 *     incrementer() // '1'
 *     incrementer() // '1'
 *
 * ## Caching
 * An Incrementer can take an optional parameter. This is an identifier and the incrementer will
 * return the same value for the every string representation of such an identifier.
 *
 *     incrementer('a') // '1'
 *     incrementer('a') // still '1'
 *
 * ## Prefixing
 * The factory can be called with a string parameter. If done so, this string will be prefixed to every id
 *
 *     var incrementer = idIncrementer('pre_')
 *     incrementer() // 'pre_1'
 *
 * ## Mapping
 * The incrementer can be extended with an id provider, so you can use it with objects diretly.
 *
 *     var incrementer = idIncrementer().map(function(item) { return item.id })
 *     incrementer({id: 'a'}) // '1'
 *     incrementer({id: 'b'}) // '2'
 *     incrementer({id: 'a'}) // '1'
 *
 * Pluck style syntax is also possible
 *
 *     var incrementer = idIncrementer().map('id')
 *     incrementer({id: 'a'}) // '1'
 *     incrementer({id: 'b'}) // '2'
 *     incrementer({id: 'a'}) // '1'
 *
 */
angular.module('dmpApp')
  .factory('idIncrementer', function(loDash) {
        function newIncrementer(prefix) {
            var pre = (prefix || '') + '',
                counter = 0,
                pool = {};

            function get(id) {
                if (loDash.isUndefined(id)) {
                    return pre + (++counter);
                }
                if (!loDash.has(pool, id)) {
                    pool[id] = pre + (++counter);
                }
                return pool[id];
            }

            get.map = function map(f) {
                if (angular.isString(f)) {
                    return map(function(item) {
                        return item[f];
                    });
                }
                return function(item) {
                    if (loDash.isUndefined(item)) {
                        return get();
                    }
                    return get(f(item));
                };
            };

            return get;
        }

        return newIncrementer;
    });
