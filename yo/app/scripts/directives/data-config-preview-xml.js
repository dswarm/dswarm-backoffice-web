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
