'use strict';

angular.module('dmpApp')
    .factory('ProjectResource', ['ResourceFactory', function(ResourceFactory) {

        return ResourceFactory.create('projects');
    }]);
