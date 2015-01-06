/**
 * Copyright (C) 2013 – 2015  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
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
    .factory('endpointLabel', function($modal, $q) {

        function valid(label) {
            return angular.isString(label) && label.length >= 3;
        }

        function get(connection) {
            return connection.getLabel();
        }

        function set(connection, label) {
            connection.setLabel(label);
            activate(connection);
        }

        function activate(connection) {
            var labelOverlay = connection.getLabelOverlay();
            if (labelOverlay) {
                labelOverlay.addClass('mapping-label');
                labelOverlay.addClass('mapping-active');
            }
        }

        function deactivate(connection) {
            var labelOverlay = connection.getLabelOverlay();
            if (labelOverlay) {
                labelOverlay.removeClass('mapping-active');
            }

        }

        function ask(promptText, helpText, buttonText, extraLabel, prefill, error) {
            var text = promptText || 'Name this mapping',
                help = helpText || 'The name has to be at least 3 characters long';

            buttonText = buttonText || 'Ok';

            var labelDefer = $q.defer();

            var modalInstance = $modal.open({
                templateUrl: 'views/modals/re-label-connection.html',
                controller: ['$scope', function($scope) {
                    $scope.text = text;
                    $scope.buttonText = buttonText;
                    $scope.help = help;
                    $scope.extraLabel = extraLabel;
                    $scope.error = error;

                    if(prefill && prefill.label) {
                        $scope.label = prefill.label;
                    }

                    if(prefill && prefill.extra) {
                        $scope.extra = prefill.extra;
                    }

                    $scope.isValid = function(label) {
                        return valid(label);
                    };

                    $scope.close = function(data) {
                        if (valid(data.label)) {
                            $scope.$close(data);
                        }
                    };

                    $scope.showExtra = function() {
                        $('#relabel-extra').slideToggle();
                    };

                    $scope.hasExtra = function() {
                        return extraLabel;
                    };
                }]
            });

            modalInstance.result.then(function(data) {

                if (valid(data.label)) {
                    labelDefer.resolve(data);
                } else {
                    labelDefer.reject('invalid');
                }
            }, function(reason) {

                labelDefer.reject(reason);
            });


            return labelDefer.promise;
        }


        function askWithKeys(keys) {
            var text = 'Name this mapping',
                help = 'The name has to be at least 3 characters long',
                buttonText = 'Ok',
                keyDef = (keys && keys.length) ? keys : [],
                hasKeyDef = !!keyDef.length;

            var labelDefer = $q.defer();

            var modalInstance = $modal.open({
                templateUrl: 'views/modals/label-with-keys.html',
                controller: ['$scope', function($scope) {
                    $scope.text = text;
                    $scope.buttonText = buttonText;
                    $scope.help = help;
                    $scope.keyDefs = [];
                    $scope.hasKeyDef = hasKeyDef;

                    $scope.isValid = function(label) {
                        return valid(label);
                    };

                    $scope.addKeyDef = function() {
                        $scope.keyDefs.push(angular.copy(keyDef));
                    };

                    $scope.close = function(label, keyDefs) {
                        if ($scope.isValid(label)) {
                            $scope.$close({
                                label: label,
                                keyDefs: keyDefs
                            });
                        }
                    };
                }]
            });

            modalInstance.result.then(function(data) {

                if (valid(data.label)) {
                    labelDefer.resolve(data);
                } else {
                    labelDefer.reject('invalid');
                }
            }, function(reason) {
                labelDefer.reject(reason);
            });

            return labelDefer.promise;
        }

        return {
            get: get,
            set: set,
            activate: activate,
            deactivate: deactivate,
            ask: ask,
            askWithKeys: askWithKeys
        };
    });
