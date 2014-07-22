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

        function ask(promptText, helpText, extraLabel) {
            var text = promptText || 'Name this mapping',
                buttonText = text,
                help = helpText || 'The name has to be at least 3 characters long';

            var labelDefer = $q.defer();

            var modalInstance = $modal.open({
                templateUrl: 'views/modals/re-label-connection.html',
                controller: ['$scope', function($scope) {
                    $scope.text = text;
                    $scope.buttonText = buttonText;
                    $scope.help = help;
                    $scope.extraLabel = extraLabel;

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
                buttonText = text,
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
