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
    .filter('filesize', function($window) {
        return function(text) {
            return $window.humanize.filesize(text);
        };
    })
    .controller('ImportCtrl', function($scope, $location, fileUpload, ApiEndpoint) {

        $scope.data = {};
        $scope.meta = {};

        $scope.submitForm = function() {
            var f = $scope.data.file;
            if (angular.isDefined(f) && $scope.data.name) {
                fileUpload({
                    file: f,
                    params: {
                        name: $scope.data.name,
                        description: $scope.data.description || ''
                    },
                    fileUrl: ApiEndpoint + 'resources'
                }).then(function() {
                    $location.path('/data/');
                }).catch(function(err) {
                    console.log('file upload error', err);
                });
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
    });
