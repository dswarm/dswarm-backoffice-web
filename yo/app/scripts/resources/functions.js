'use strict';

angular.module('dmpApp')
    .factory('FunctionResource', ['ResourceFactory',function(ResourceFactory) {
        
        return ResourceFactory.create('functions');
    }]);
