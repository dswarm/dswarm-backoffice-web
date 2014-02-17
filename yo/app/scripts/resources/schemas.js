'use strict';

angular.module('dmpApp')
    .factory('SchemaResource', function(ResourceFactory) {

        return ResourceFactory.create('schemas');
    });
