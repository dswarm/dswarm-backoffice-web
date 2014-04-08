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
                        description: $scope.data.description
                    },
                    fileUrl: ApiEndpoint + 'resources'
                }).then(function(resp) {
                    var respId = resp['id'];
                    $location.path('/data/' + respId);
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
