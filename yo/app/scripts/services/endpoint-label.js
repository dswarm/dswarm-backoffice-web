'use strict';

angular.module('dmpApp')
    .factory('endpointLabel', function($modal, $q) {

        function valid(label) {
            return angular.isString(label) && label.length >= 5;
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

        function ask(promptText, helpText) {
            var text = promptText || 'Name this mapping',
                buttonText = text,
                help = helpText || 'The name has to be at least 5 characters long';

            var labelDefer = $q.defer();

            var modalInstance = $modal.open({
                templateUrl: 'views/modals/re-label-connection.html',
                controller: ['$scope', function($scope) {
                    $scope.text = text;
                    $scope.buttonText = buttonText;
                    $scope.help = help;

                    $scope.isValid = function(label) {
                        return valid(label);
                    };

                    $scope.close = function(label) {
                        if (valid(label)) {
                            $scope.$close(label);
                        }
                    };
                }]
            });

            modalInstance.result.then(function(label) {

                if (valid(label)) {
                    labelDefer.resolve(label);
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
            ask: ask
        };
    });
