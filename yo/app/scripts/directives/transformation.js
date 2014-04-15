'use strict';

angular.module('dmpApp')
    .controller('TransformationCtrl', function($scope, $window, $modal, $q, $rootScope, $timeout, PubSub, loDash, TaskResource, Util) {
        $scope.internalName = 'Transformation Logic Widget';

        var activeComponentId = null,
            availableIds = [],
        // TODO: Find better solution instead of hard limiting to 6 items per row
            gridMaxItemsPerRow = 6,
            isDraggingToGrid = null;

        /** Gridster config goes here */
        $scope.gridsterOpts = {
            margins: [20, 20],
            draggable: {
                enabled: true
            },
            resizable: {
                enabled: false
            },
            mobileBreakPoint: 100,
            minRows: 0,
            maxRows: 0,
            maxGridRows: 0,
            maxColumns: gridMaxItemsPerRow,
            noFloatingUp: true,
            containment: '.gridster'
        };

        $scope.jsPlumbOpts = {
            scope: 'schema',
            container: 'transformation',
            anchor: 'Continuous',
            endpoint: ['Dot', {
                radius: 5,
                cssClass: 'source-endpoint'
            }],
            connectorOverlays: [
                ['Arrow', {
                    location: 1,
                    width: 10,
                    length: 12,
                    foldback: 0.75
                }]
            ],
            connector: 'Straight',
            connectorStyle: {
                strokeStyle: 'black',
                lineWidth: 3
            },
            paintStyle: {
                fillStyle: 'black',
                lineWidth: 3
            }
        };

        /** Gridster item access map */
        $scope.customItemMap = {
            sizeX: 1,
            sizeY: 1,
            row: 'item.positionX',
            col: 'item.positionY'
        };

        /** Holds current grid items */
        $scope.gridItems = [];
        $scope.transformationStateError = '';

        $scope.activeMapping = {};
        $scope.output_attribute_paths = [];
        $scope.$watch('activeMapping', function() {

            if(typeof $scope.activeMapping.output_attribute_path !== 'undefined') {

                $scope.output_attribute_paths = [$scope.activeMapping.output_attribute_path];

            }
        }, true);

        function getId(optId) {
            return angular.isDefined(optId) ? optId
                : (new Date().getTime() + Math.floor(Math.random() * 1001)) * -1;
        }

        //** Start of directive init
        /**
         * Initializes vars etc.
         */
        function init() {
            activeComponentId = '';
            availableIds = [];
            $scope.activeMapping = { };
            $scope.tabs = [];

            $scope.gridItems = [];

            $scope.gridsterOpts = angular.extend({}, $scope.gridsterOpts, {
                minRows: 0,
                maxRows: 0,
                maxGridRows: 0
            });

            // restore mappings if a previous project was loaded from a draft
            loDash.forEach($scope.project.mappings, function(mapping) {

                $scope.tabs.push({ title: mapping.name, active: false, id: mapping.id });
                availableIds.push(mapping.id);
            });

            var last = loDash.last($scope.project.mappings);

            if (last) {
                activate(last.id, true);
            }

        }

        init();
        PubSub.subscribe($scope, ['projectDraftDiscarded', 'projectModelChanged', 'changeOutputModel'], init);

        // show draft banner
        if ($scope.projectIsDraft) {
            $scope.alerts.push({
                type: 'info',
                discard: true,
                save: true,
                msg: 'I opened an unsaved draft for you to continue working where you left off.'
            });
        }

        //** Init directive end

        //** Start functions to create plumbs

        function hideTransformationPlumbs() {
            $scope.transformationStateError = '';

            PubSub.broadcast('jsp-connector-disconnect', { type: [ 'transformation', 'component' ]  });
        }

        function showTransformationPlumbs() {

            var j = 0,
                connectOptions = { type : 'transformation' };

            $scope.transformationStateError = '';

            angular.forEach($scope.activeMapping.input_attribute_paths, function(iap) {

                connectOptions.source = {
                    type : 'transformation-input',
                    id : iap.attribute_path.id
                };

                for (var i = 0; i < gridMaxItemsPerRow; i++) {

                    var currentGridItemIndex = loDash.findIndex($scope.gridItems, { positionY: i, positionX: j  });

                    if (currentGridItemIndex >= 0) {

                        connectOptions.target = {
                            type : 'component',
                            id : $scope.gridItems[currentGridItemIndex].id
                        };

                        var newConnectOptions = angular.copy(connectOptions);

                        PubSub.broadcast('jsp-connector-connect', newConnectOptions);

                        connectOptions.source = {
                            type : 'component',
                            id : $scope.gridItems[currentGridItemIndex].id
                        };

                    }

                }

                j++;

            });

            if($scope.activeMapping.input_attribute_paths.length > 1) {
                $scope.transformationStateError = 'Mehr als ein möglicher Output-Weg. Bitte mit concat verringern';

            } else {

                if($scope.gridItems.length === 0) {

                    connectOptions.source =  {
                        type : 'transformation-input',
                        id : $scope.activeMapping.input_attribute_paths[0].attribute_path.id
                    };

                } else {

                    var firstRow = loDash.filter($scope.gridItems, { positionX: 0 });
                    firstRow = loDash.sortBy(firstRow, 'positionY');

                    var firstRowLastItem = loDash.last(firstRow);

                    connectOptions.source =  {
                        type : 'component',
                        id : firstRowLastItem.id
                    };

                }

                connectOptions.target = {
                    type : 'transformation-output',
                    id : $scope.activeMapping.output_attribute_path.attribute_path.id
                };

                PubSub.broadcast('jsp-connector-connect', connectOptions);

            }

        }

        PubSub.subscribe($scope, 'paintPlumbs', showTransformationPlumbs);
        //** End functions to create plumbs

        //** Start to handle function drag/drops

        /**
         * Generates placeholders inside the grid to show possible drop positions.
         */
        function createDropPlaceholder() {

            for (var j = 0; j < $scope.gridsterOpts.maxRows; j++) {

                for (var i = 0; i < gridMaxItemsPerRow; i++) {

                    if (loDash.findIndex($scope.gridItems, { positionY: i, positionX: j  }) < 0) {
                        $scope.gridItems.push({
                            positionX: j,
                            positionY: i,
                            placeholder: true
                        });

                    }
                }

            }
            $scope.$digest();
        }

        /**
         * Removes placeholders from grid
         */
        function removeDropPlaceholder() {
            $scope.gridItems = loDash.remove($scope.gridItems,
                function(item) {
                    return !item.placeholder;
                }
            );
            $scope.$digest();
        }

        /**
         * Adds a function to the project data object
         */
        function buildFunctionToProject() {

            $scope.project.functions = [];

            angular.forEach($scope.project.mappings, function(mapping) {

                angular.forEach(mapping.transformation.function.components, function(component) {

                    if (loDash.indexOf($scope.project.functions, component.function) === -1) {
                        $scope.project.functions.push(component.function);
                    }

                });
            });

        }

        /**
         * Handles a dropped element to a grid position
         * @param positionX
         * @param positionY
         * @param itemData
         */
        function dropToGrid(positionX, positionY, itemData) {

            addToGrid(positionX, positionY, itemData, getId());

            removeDropPlaceholder();
            isDraggingToGrid = false;
            createInternalComponentsFromGridItems();

            buildFunctionToProject();
        }

        /**
         * Adds an element to a specific position inside the grid
         * @param positionX - X position
         * @param positionY - Y position
         * @param itemData - The original data of the dropped fucntion
         * @param id - Original id used to identify
         */
        function addToGrid(positionX, positionY, itemData, id) {

            $scope.gridItems.push({
                positionX: positionX,
                positionY: positionY,
                function: itemData,
                id: id
            });

        }

        /**
         * Receives a drop of a dragged function from the list to the grid.
         * @param dragEl - DOM element that has been dragged
         * @param dropEl - DOM element that has been dropped
         */
        $scope.dropped = function(dragEl, dropEl) {
            dropToGrid(angular.element(dropEl).scope().item.positionX, angular.element(dropEl).scope().item.positionY, angular.element(dragEl).scope().child);
        };

        $scope.$watch('gridItems', function() {
            if (isDraggingToGrid === false) {
                createInternalComponentsFromGridItems();
            }
            isDraggingToGrid = null;
        }, true);

        PubSub.subscribe($rootScope, ['DRAG-START'], function() {
            isDraggingToGrid = true;
            createDropPlaceholder();

            hideTransformationPlumbs();
        });

        PubSub.subscribe($rootScope, ['GRIDSTER-DRAG-START'], hideTransformationPlumbs);

        PubSub.subscribe($rootScope, ['DRAG-END', 'GRIDSTER-DRAG-END'], function() {
            removeDropPlaceholder();
            isDraggingToGrid = false;

            $timeout(function() {
                showTransformationPlumbs();
            }, 100);

        });

        //** End of function drag/drops handling

        //** Start of grid creation

        /**
         * Sets the height of the grid with all needed parameters for gridster
         * @param height
         */
        function setGridHeight(height) {
            $scope.gridsterOpts.maxRows =
                $scope.gridsterOpts.minRows =
                    $scope.gridsterOpts.maxGridRows =
                        $scope.gridsterOpts.gridHeight = height;
        }

        /**
         * Builds visual grid from internal data structure
         */
        function createGridFromInternalComponents() {

            hideTransformationPlumbs();

            setGridHeight($scope.activeMapping.input_attribute_paths.length);

            $scope.gridItems = [];

            function ensureComponentProperties(component) {
                if (!component.parameter_mappings) {
                    component.parameter_mappings = {};
                }
                if (!component.input_components) {
                    component.input_components = [];
                }
                if (!component.output_components) {
                    component.output_components = [];
                }
            }

            function getInputString(component, idx) {
                return component.parameter_mappings['inputString'] || ('input' + idx);
            }

            function walkChainedComponents(result, components, pool) {
                var nextLevel = loDash(components).pluck('output_components').flatten().pluck('id').value();

                if (loDash.isEmpty(nextLevel)) {
                    return result;
                }

                var nextComponents = loDash.map(nextLevel, function(id) {
                    return pool[id];
                });

                result.push.apply(result, nextComponents);

                return walkChainedComponents(result, nextComponents, pool);
            }

            if (typeof $scope.activeMapping.transformation !== 'undefined' &&
                typeof $scope.activeMapping.transformation.function !== 'undefined' &&
                typeof $scope.activeMapping.transformation.function.components !== 'undefined') {

                var transformation = $scope.activeMapping.transformation;

                loDash.forEach(transformation.function.components, ensureComponentProperties);

                var componentPool = loDash.zipObject(loDash.map(transformation.function.components, function(component) {
                    return [component.id, component];
                }));

                var componentRows = loDash(transformation.function.components)
                    .filter({input_components: []})
                    .map(function(component, idx) {
                        return [
                            getInputString(component, idx),
                            walkChainedComponents([component], [component], componentPool)
                        ];
                    })
                    .zipObject()
                    .value();

                var rowComponents = loDash($scope.activeMapping.input_attribute_paths)
                    .map(function(ap) {
                        var varName = buildVariableName(ap.attribute_path.attributes);

                        if (componentRows.hasOwnProperty(varName)) {
                            var components = componentRows[varName];
                            delete componentRows[varName];
                            return [components];
                        } else {
                            return [];
                        }
                    })
                    .flatten(true)
                    .value();

                // randomly assign components rows that had no inputString setting
                loDash.forEach(componentRows, function(components) {
                    rowComponents.push(components);
                });

                loDash.forEach(rowComponents, function(components, posX) {
                    loDash.forEach(components, function(component, posY) {
                        if (component !== null) {
                            addToGrid(posX, posY, component.function, component.id);
                        }
                    });
                });
            }

            $timeout(function() {
                hideTransformationPlumbs();
                showTransformationPlumbs();
            }, 100);

        }

        /**
         * Lookup a component in the projects pool, optionally creating a new one
         * @param component
         * @returns {*}
         */
        function resolveComponent(component) {

            var newComponent = getComponent(component.id);

            if (newComponent) {
                return newComponent;
            }

            return createNewComponent(component.function, component.id);
        }

        /**
         * Chain a string of components together by setting their (in|out)put_components
         * This is a aggregation function that is meant to be used by loDash.reduce or the like
         * @param result
         * @param component
         * @returns {*}
         */
        function chainRowComponents(result, component) {

            if (result.length > 0) {
                var last = loDash.last(result);

                component.input_components = [
                    {
                        id: last.id
                    }
                ];

                last.output_components = [
                    {
                        id: component.id
                    }
                ];
            }

            result.push(component);

            return result;
        }

        function buildAttributeName(attributes, property, delimiter) {
            return loDash.pluck(attributes, property).join(delimiter);
        }

        function buildUriReference(attributes) {
            return buildAttributeName(attributes, 'uri', '\u001E');
        }

        function buildVariableName(attributes) {
            return buildAttributeName(attributes, 'name', '_');
        }

        /**
         * Builds the components inside the project data structure from the
         * visual grid representation.
         */
        function createInternalComponentsFromGridItems() {

            if (!$scope.activeMapping.id) {
                return;
            }

            var transformation = $scope.activeMapping.transformation;

            if (angular.isUndefined(transformation)) {
                transformation = createNewTransformation();
                $scope.activeMapping.transformation = transformation;
            }

            var deleteInputStringParameterMapping = function(component) {
                delete component.parameter_mappings['inputString'];
            };

            if (angular.isUndefined(transformation.parameter_mappings)) {
                transformation.parameter_mappings = {};
            }

            // TODO: Expand to combine multiple input paths
            var rowComponents = loDash.times($scope.gridsterOpts.maxRows, function(i) {

                // get all in this row to array
                var rowComponents = loDash.filter($scope.gridItems, {positionX: i});

                // order by column
                rowComponents = loDash.sortBy(rowComponents, 'positionY');

                // replace array entry with original internal component oder generate a new one
                rowComponents = loDash.map(rowComponents, resolveComponent);

                // delete eventual existing 'inputString' mappings
                loDash.forEach(rowComponents, deleteInputStringParameterMapping);

                var inputAttributes = $scope.activeMapping.input_attribute_paths[i].attribute_path.attributes;

                // create a simple name for this input_attribute_path
                var varName = buildAttributeName(inputAttributes, 'name', '_');

                // create the fq-uri for this input_attribute_path
                transformation.parameter_mappings[varName] = buildUriReference(inputAttributes);

                if(typeof transformation.function.parameters === 'undefined') {
                    transformation.function.parameters = [];
                }

                transformation.function.parameters.push(varName);

                if (rowComponents.length > 0) {
                    rowComponents[0].parameter_mappings['inputString'] = varName;
                }

                // chain the row together
                return loDash.reduce(rowComponents, chainRowComponents, []);
            });

            transformation.function.components = loDash.flatten(rowComponents);

            var outputAttributes = $scope.activeMapping.output_attribute_path.attribute_path.attributes;

            transformation.parameter_mappings['transformationOutputVariable'] = buildUriReference(outputAttributes);
        }

        /**
         * Extracts a component by id
         * @param id - Component id to return
         * @returns {*}
         */
        function getComponent(id) {
            return loDash.find($scope.activeMapping.transformation.function.components, { id: id});
        }

        /**
         * Creates default component data structure around a given function
         * @param func - Function object
         * @param id {number} - the ID to use
         * @returns {{id: number, name: (*|string|string|name|parser.name|exports.callee.object.name), description: (*|string|parser.description|.about.description|.info.description|exports.expected.description), function: *, parameter_mappings: {}, output_components: Array, input_components: Array}}
         */
        function createNewComponent(func, id) {

            return {
                id: id,
                name: func.name,
                description: func.description,
                function: func,
                parameter_mappings: {},
                output_components: [],
                input_components: []
            };

        }

        /**
         * Creates a default data structure for a tranformation
         * @param name - Optional given name
         * @param description - Optional given description
         * @returns {{name: , description: , function: {name: , description: , parameters: string[], type: string, components: Array}, parameter_mappings: {}}}
         */
        function createNewTransformation(name, description) {

            name = typeof name !== 'undefined' ? name : 'transformation';
            description = typeof description !== 'undefined' ? description : 'transformation';

            return {
                name: name,
                description: description,
                function: {
                    name: name,
                    description: description,
                    //TODO: make flex, this only handles one input to transformation
                    parameters: [],
                    type: 'Transformation',
                    components: []
                },
                parameter_mappings: { }
            };
        }

        //** Start of mapping activation and selection

        /**
         * Activates a mapping for editing
         * @param id - Id to activate
         * @param skipBroadcast - Should an activation event be send?
         */
        function activate(id, skipBroadcast) {
            if (activeComponentId !== id) {
                $scope.$broadcast('tabSwitch', id);

                $scope.activeMapping = $scope.project.mappings[availableIds.indexOf(id)];
                activateTab(id);

                if (!$scope.activeMapping) {
                    $scope.activeMapping = {};
                }

                activeComponentId = id;

                if (!skipBroadcast) {
                    PubSub.broadcast('connectionSwitched', { id: $scope.activeMapping._$connection_id });
                }

                createGridFromInternalComponents();

            }
        }

        function activateTab(tabId) {

            var tabIndex = loDash.findIndex($scope.tabs, { 'id': tabId });

            loDash.map($scope.tabs, function(tab) {
                tab.active = false;
                return tab;
            });

            if (tabIndex >= 0) {
                $scope.tabs[tabIndex].active = true;
            }
        }

        /**
         * Switches the UI Tab which mapping should be edited
         * @param tab - Tab data from internal register
         */
        $scope.switchTab = function(tab) {
            activate(tab.id);
        };

        /**
         * Formats an attribute path for output
         * @param ap - Attribute path  data structure
         * @returns {string}
         */
        $scope.formatAttributePath = function(ap) {
            if (angular.isObject(ap) && angular.isDefined(ap.attributes)) {
                return loDash.map(ap.attributes, 'name').join(' › ');
            }
            return '';
        };

        //** End of mapping activation and selection

        PubSub.subscribe($scope, 'connectionSelected', function(data) {

            if (activeComponentId !== data.mapping_id) {
                if (loDash.any($scope.project.mappings, { 'id': data.mapping_id })) {

                    var idx = availableIds.indexOf(data.mapping_id);
                    activateTab(idx);

                    var midx = loDash.findIndex($scope.project.mappings, {id: data.mapping_id});

                    $scope.project.mappings[midx]._$connection_id = data.connection_id;

                    activate(data.mapping_id, true);

                } else {
                    var inputPath = data.inputAttributePath.path,
                        inputAttributePaths = loDash.filter($scope.project.input_data_model.schema.attribute_paths, function(ap) {
                            return angular.equals(inputPath, loDash.map(ap.attributes, 'id'));
                        }),
                        outputPath = data.outputAttributePath.path,
                        outputAttributePaths = loDash.filter($scope.project.output_data_model.schema.attribute_paths, function(ap) {
                            return angular.equals(outputPath, loDash.map(ap.attributes, 'id'));
                        }),

                        mapping = {
                            id: data.mapping_id,
                            _$connection_id: data.connection_id,
                            name: data.name,
                            transformation: createNewTransformation(),
                            input_attribute_paths: [
                                {
                                    type: 'MappingAttributePathInstance',
                                    name: 'input mapping attribute path instance',
                                    id: (new Date().getTime() + 1) * -1,
                                    attribute_path: inputAttributePaths[0]
                                }
                            ],
                            output_attribute_path: {
                                type: 'MappingAttributePathInstance',
                                name: 'output mapping attribute path instance',
                                id: (new Date().getTime() + 2) * -1,
                                attribute_path: outputAttributePaths[0]
                            }
                        };

                    $scope.project.mappings.push(mapping);

                    $scope.tabs.push({ title: data.name, active: true, id: data.mapping_id, mappingId: data.mapping_id });
                    availableIds.push(data.mapping_id);

                    activate(data.mapping_id, true);
                }
            } else {
                $scope.activeMapping._$connection_id = data.connection_id;
            }

            setGridHeight(data.additionalInput.length + 1);

            if ($scope.activeMapping.input_attribute_paths.length !== data.additionalInput.length + 1) {

                angular.forEach(data.additionalInput, function(input) {
                    angular.forEach($scope.project.input_data_model.schema.attribute_paths, function(path) {
                        if (loDash.findIndex(path.attributes, { 'id': input.path[0] }) >= 0) {

                            $scope.activeMapping.input_attribute_paths.push({
                                type: 'MappingAttributePathInstance',
                                name: 'input mapping attribute path instance',
                                id: (new Date().getTime() + 1) * -1,
                                attribute_path: path
                            });

                        }
                    });

                });

            }


            if ($scope.$$phase !== '$digest') {
                $scope.$digest();
            }
        });

        //** Start of sending transformation to server

        /**
         * Send all transformations to the server
         * @param task - Transformations to send
         * @param persist - if true, the transformation result should be persisted by the backend
         */
        function sendTransformations(task, persist) {

            TaskResource.execute({persist: !!persist}, Util.toJson(task)).$promise.then(function(result) {
                console.log('transformation finished', result);
                PubSub.broadcast('transformationFinished', result);
            }, function(resp) {
                console.log(resp);
                $window.alert(resp.message || resp.data.error);
            });
        }

        /**
         * Send a single transformation to the server
         */
        $scope.sendTransformation = function() {

            var payload = {
                name: $scope.activeMapping.name,
                description: 'A Transformation',
                job: {
                    mappings: [$scope.activeMapping]
                },
                input_data_model: $scope.project.input_data_model,
                output_data_model: $scope.project.output_data_model
            };

            sendTransformations(payload, false);
        };

        /**
         * This actually sends a Transformation
         */
        $scope.sendTransformations = function(persist) {

            var payload = {
                name: 'Transformations',
                description: 'Transformations',
                job: {
                    mappings: $scope.project.mappings
                },
                input_data_model: $scope.project.input_data_model,
                output_data_model: $scope.project.output_data_model
            };

            sendTransformations(payload, persist);
        };
        //** End of sending transformation to server

        //** Start handling filter
        $scope.onFunctionClick = function(component) {
            var newComponent = angular.copy(getComponent(component.id));
            PubSub.broadcast('handleEditConfig', newComponent);
        };

        PubSub.subscribe($scope, 'handleConfigEdited', function(component) {
            angular.forEach($scope.activeMapping.transformation.function.components, function(comp) {
                if (comp.id === component.id) {
                    comp.parameter_mappings = component.parameter_mappings;
                }
            });
        });

        $scope.onFilterClick = function(component) {

            var childScope = $scope.$new();
            childScope.component = component;

            $scope.currentComponent = component;

            var modalInstance = $modal.open({
                templateUrl: 'views/directives/filter.html',
                controller: 'FilterCtrl',
                scope: childScope
            });

            modalInstance.result.then(angular.noop);

        };

        //** End handling filter


    })
    .directive('transformation', function() {
        return {
            scope: true,
            restrict: 'E',
            replace: false,
            templateUrl: 'views/directives/transformation.html',
            controller: 'TransformationCtrl'
        };
    });
