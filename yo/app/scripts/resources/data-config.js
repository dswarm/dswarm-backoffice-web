angular.module('dmpApp')
    .factory('DataConfigResource', ['$resource', '$window', '$location', function($resource, $window, $location) {

        var baseUrl = ($window && $window['dmp']) ? $window['dmp']['jsRoutes']['api'] : ''
            , endpoint = 'resources/:resourceId/configurations';

        put = function(dataConfigParameters) {

            var data = new FormData(),
                xhr = new XMLHttpRequest();

            xhr.onerror = function (err) {
                console.log('error', err);
            };

            xhr.onreadystatechange = function() {

                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 201 || xhr.status === 200) {

                        $location.path('/data/');

                    }
                }
            };

            xhr.open('POST', baseUrl + endpoint.replace(/:resourceId/g, dataConfigParameters.resourceId), true);

            angular.forEach(dataConfigParameters.configuration, function(value, key) {
                data.append(key, value);
            });

            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(dataConfigParameters.configuration));

        },

        get = function(dataConfigParameters) {
            return $resource(baseUrl + endpoint.replace(/:resourceId/g, dataConfigParameters.resourceId));
        }

        return {
            get : get,
            put : put
        };
    }]);