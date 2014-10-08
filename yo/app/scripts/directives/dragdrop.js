/**
 * Copyright (C) 2013, 2014  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
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

    .directive('draggable', function($rootScope, GUID) {
        return {
            restrict: 'A',
            link: function(scope, el) {
                angular.element(el).attr('draggable', 'true');

                var id = angular.element(el).attr('id');
                if (!id) {
                    id = GUID.uuid4();
                    angular.element(el).attr('id', id);
                }

                el.bind('dragstart', function(e) {
                    e.dataTransfer.setData('text', id);

                    $rootScope.$emit('DRAG-START');
                });

                el.bind('dragend', function() {
                    $rootScope.$emit('DRAG-END');
                });
            }
        };
    });

angular.module('dmpApp')

    .directive('dropTarget', function($rootScope, GUID) {
        return {
            restrict: 'A',
            scope: {
                onDrop: '&'
            },
            link: function(scope, el) {
                var id = angular.element(el).attr('id');
                if (!id) {
                    id = GUID.uuid4();
                    angular.element(el).attr('id', id);
                }

                el.bind('dragover', function(e) {
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }

                    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                    return false;
                });

                el.bind('dragenter', function(e) {
                    // this / e.target is the current hover target.
                    angular.element(e.target).addClass('lvl-over');
                });

                el.bind('dragleave', function(e) {
                    angular.element(e.target).removeClass('lvl-over');  // this / e.target is previous target element.
                });

                el.bind('drop', function(e) {
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }

                    if (e.stopPropagation) {
                        e.stopPropagation(); // Necessary. Allows us to drop.
                    }
                    var data = e.dataTransfer.getData('text');
                    var dest = document.getElementById(id);
                    var src = document.getElementById(data);

                    scope.onDrop({dragEl: src, dropEl: dest});
                });

                $rootScope.$on('DRAG-START', function() {
                    var el = document.getElementById(id);
                    angular.element(el).addClass('lvl-target');
                });

                $rootScope.$on('DRAG-END', function() {
                    var el = document.getElementById(id);
                    angular.element(el).removeClass('lvl-target');
                    angular.element(el).removeClass('lvl-over');
                });
            }
        };
    });


