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
    .directive('jsPlumbConnector', function ($rootScope, jsP, transformationArrows) {

        $rootScope.$on('$locationChangeStart', function() {
            jsP.detachEveryConnection({});
        });

        return {
            scope: true,
            restrict: 'A',
            replace: true,
            compile: function(tElement, tAttrs) {
                var jsPlumbConnectorIdentItem = tAttrs['jsPlumbConnectorIdentItem'],
                    jsPlumbConnectorIdentItemWatch = function(scope) {
                        return scope.$eval(jsPlumbConnectorIdentItem);
                    };

                transformationArrows.clear();

                return function(scope, iElement) {
                    var identItem = jsPlumbConnectorIdentItemWatch(scope),
                        identType = tAttrs['jsPlumbConnectorIdentType'];

                    scope.guid = transformationArrows.register(identItem, identType);
                    iElement.attr('id', scope.guid);
                };
            }
        };

    });
