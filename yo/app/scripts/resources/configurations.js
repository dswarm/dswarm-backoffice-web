'use strict';

angular.module('dmpApp')
    .factory('ConfigurationResource', ['ResourceFactory', function(ResourceFactory) {

        return ResourceFactory.create('configurations');
    }]);
