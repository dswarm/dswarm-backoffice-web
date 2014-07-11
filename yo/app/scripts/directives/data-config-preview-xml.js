'use strict';

angular.module('dmpApp')
    .controller('DataConfigPreviewXmlCtrl', function($scope, $routeParams, $timeout, loDash, PubSub, FileResource) {

        $scope.previewResult = '';
        $scope.previewOptions = {
            at_most_rows : 50
        };

        var loadLines = function() {

            if(angular.isUndefined($scope.resourceId)) {
                return;
            }

            FileResource.lines({
                id: $scope.resourceId,
                atMost: $scope.previewOptions.at_most_rows || 50,
                encoding: 'UTF-8'
            }, function(result) {
                $scope.previewResult = result.lines.join('\n');
            });

        };

        $scope.$watch('resourceId', loadLines);
        $scope.$watch('previewOptions', loadLines, true);

    })
    .directive('dataconfigpreviewxml', function() {
        return {
            restrict: 'E',
            replace: true,
            scope : false,
            templateUrl: 'views/directives/data-config-preview-xml.html',
            controller: 'DataConfigPreviewXmlCtrl'
        };
    });
