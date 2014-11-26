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

angular.module('dmpApp', [
    // DMP modules
    'dmpApp.config',

    // Angular Modules
    'ngRoute', 'ngResource',

    // AngularUI Modules
    'ui.utils', 'ui.bootstrap', 'ui.bootstrap.tabs', 'ui.bootstrap.modal', 'ui.sortable', 'ui.tree',

    // 3rd Party
    'ngProgress', 'ngGrid', 'LocalStorageModule', 'gridster', 'perfect_scrollbar'
]);

// jQuery Compatibility with dragdrop
// http://jasonturim.wordpress.com/2013/09/01/angularjs-drag-and-drop/
jQuery.event.props.push('dataTransfer');
