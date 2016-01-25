/**
 * Copyright (C) 2013 – 2016  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
