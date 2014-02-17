'use strict';

angular.module('dmpApp')
    .factory('ResourceResource', function(ResourceFactory) {

        return ResourceFactory.create('resources');
    });
