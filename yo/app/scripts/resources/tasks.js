'use strict';

angular.module('dmpApp')
    .factory('TaskResource', ['ResourceFactory',function(ResourceFactory) {

        return ResourceFactory.create('tasks');
    }]);
