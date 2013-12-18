'use strict';

angular.module('dmpApp')
    .factory('SchemaResource', ['ResourceFactory', function(ResourceFactory) {

        return ResourceFactory.create('schemas');
    }]);
