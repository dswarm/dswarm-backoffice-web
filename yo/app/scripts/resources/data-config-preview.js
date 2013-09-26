'use strict';

angular.module('dmpApp')
    .factory('DataConfigPreviewResource', ['$http', '$window', function($http, $window){

        var baseUrl = ($window && $window['dmp']) ? $window['dmp']['jsRoutes']['api'] : ''
            , endpoint = 'resources/:resourceId/configurationpreview'
            , getPreview;

        getPreview = function (urlParams, postParams, callback, callbackError) {

            var url = baseUrl + endpoint.replace(/:resourceId/g,urlParams['resourceId']);

            $http({
                url: url,
                data : postParams,
                method : 'POST',
                headers : {'Content-Type':'application/json'}
            }).success(function(response){
                    callback($.csv.toObjects(response.data, { separator:';' }));
                })
                .error(function(data, status, headers, config) {
                    callbackError(data.error);
                });

        };

        return {
            getPreview : getPreview
        };


    }]);
