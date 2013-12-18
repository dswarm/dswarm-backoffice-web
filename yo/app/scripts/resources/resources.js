'use strict';

angular.module('dmpApp')
    .factory('ResourceResource', ['ResourceFactory', function(ResourceFactory) {

        return ResourceFactory.create('resources');
    }]);
