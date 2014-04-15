'use strict';

angular.module('dmpApp')
    .factory('fileUpload', function($q, $window, ngProgress) {
        var XmlHttpReq = $window.XMLHttpRequest;
        var Form = $window.FormData;

        /**
         * @param {{file: File, params: Object.<string, string>, fileUrl: string}} parameters
         */
        function fileUpload(parameters) {
            var theFile = parameters.file;
            var params = parameters.params;
            var fileUrl = parameters.fileUrl;

            var defer = $q.defer();

            var data = new Form(),
                xhr = new XmlHttpReq();

            xhr.onloadstart = function() {
                ngProgress.start();
            };

            xhr.upload.addEventListener('progress', function(evt) {
                if (evt.loaded < evt.total) {
                    ngProgress.set(100 * (evt.loaded / evt.total));
                }
            }, false);

            xhr.onerror = function(err) {
                ngProgress.complete();
                defer.reject(err);
            };

            xhr.onreadystatechange = function() {
                if (xhr.readyState === XmlHttpReq.DONE) {
                    ngProgress.complete();
                    if (Math.floor(xhr.status / 100) === 2) {
                        var resp = JSON.parse(xhr.responseText);
                        defer.resolve(resp);
                    } else {
                        defer.reject({status: xhr.status, msg: xhr.responseText});
                    }
                }
            };

            data.append('file', theFile, theFile.name);
            angular.forEach(params, function(v, k) {
                data.append(k, v);
            });

            xhr.open('POST', fileUrl, true);
            xhr.send(data);

            return defer.promise;
        }

        return fileUpload;
    });
