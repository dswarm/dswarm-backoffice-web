'use strict';

angular.module('dmpApp')
    .factory('FunctionResource', ['$resource', 'Util', function($resource, Util) {

        var baseUrl =  Util.apiEndpoint,
            endpoint = 'functions/:id';

        return $resource(baseUrl + endpoint);

    }]);
