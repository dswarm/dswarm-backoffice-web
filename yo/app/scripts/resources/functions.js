'use strict';

angular.module('dmpApp')
    .factory('FunctionResource', function(ResourceFactory) {

        return ResourceFactory.create('functions');
    });
