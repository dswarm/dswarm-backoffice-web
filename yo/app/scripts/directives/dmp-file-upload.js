'use strict';

angular.module('dmpApp')
    .directive('dmpFileUpload', function () {
        return function(scope, iElement) {
            iElement.on('change', function(event) {
                var file = event.target.files[0];
                scope.$apply(function() {
                    scope.data.file = file;
                });
            });
        };
    });
