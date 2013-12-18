'use strict';

angular.module('dmpApp')
    .filter('filesize', ['$window', function($window) {
        return function(text) {
            return $window.humanize.filesize(text);
        };
    }])
    .controller('ImportCtrl', ['$scope', '$location', 'Util', 'ngProgress', function ($scope, $location, Util, ngProgress) {

        $scope.data = {};
        $scope.meta = {};

        $scope.submitForm = function () {
            var f = $scope.data.file;
            if (angular.isDefined(f) && $scope.data.name) {
                (function(theFile, name, description) {
                    var data = new FormData()
                        , xhr = new XMLHttpRequest();

                    xhr.onloadstart = function () {
                        ngProgress.start();
                    };

                    xhr.upload.addEventListener('progress', function (evt) {
                        if (evt.loaded < evt.total) {
                            ngProgress.set(100 * (evt.loaded / evt.total));
                        }
                    }, false);

                    xhr.onerror = function (err) {
                        ngProgress.complete();
                        console.log('error', err);
                    };

                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            ngProgress.complete();
                            if (Math.floor(xhr.status / 100) === 2) {
                                var resp = JSON.parse(xhr.responseText),
                                    respId = resp['id'];

                                $location.path('/data/' + respId);
                            }
                        }
                    };

                    data.append('file', theFile, theFile.name);
                    data.append('name', name);
                    data.append('description', description);

                    xhr.open('POST', Util.apiEndpoint + 'resources', true);
                    xhr.send(data);
                })(f, $scope.data.name, $scope.data.description);
            }
        };

        $scope.$watch('data.file', function(file, oldVal) {
            if (file !== oldVal) {
                if (!$scope.data.name) {
                    $scope.data.name = file.name;
                }
                $scope.meta.type = file.type;
                $scope.meta.size = file.size;
            }
        });
    }]);
