'use strict';

angular.module('dmpApp')
    .factory('TaskResource', ['ResourceFactory',function(ResourceFactory) {

        return ResourceFactory.create('tasks', function() {
            return {
                'execute': {
                    method: 'POST',
                    isArray: true
                }
            };
        });
    }]);
