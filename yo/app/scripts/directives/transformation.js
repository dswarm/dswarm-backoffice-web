'use strict';

angular.module('dmpApp')
    .controller('TransformationCtrl', function($scope, $window, $modal, $q, $rootScope, $timeout, PubSub, loDash, schemaParser, filterHelper, TaskResource, Util) {
        $scope.internalName = 'Transformation Logic Widget';

        var activeComponentId = null,
            availableIds = [],
        // TODO: Find better solution instead of hard limiting to 6 items per row
            gridMaxItemsPerRow = 6;

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
        $scope.gridItemConnections = [];
        $scope.transformationStateError = '';

        $scope.activeMapping = {};
        $scope.output_attribute_paths = [];
        $scope.$watch('activeMapping', function() {
            if(typeof $scope.activeMapping.output_attribute_path !== 'undefined') {

                $scope.output_attribute_paths = [$scope.activeMapping.output_attribute_path];

            }
        }, true);

        var getOutputVariable = (function() {
            var template = '__TRANSFORMATION_OUTPUT_VARIABLE__',
                counter = 0,
                outVariablesPool = {};

            function getOutputVariable(mapping) {
                if (loDash.has(outVariablesPool, mapping.id)) {
                    return outVariablesPool[mapping.id];
                }

                var variableName = template + (++counter);
                outVariablesPool[mapping.id] = variableName;

                return variableName;
            }

            return getOutputVariable;
        }());


        /**
         * returns eigther id or generates a new one
         * @param optId string the id to return
         * @returns {*}
         */
        function getId(optId) {
            return angular.isDefined(optId) ? optId
                : (new Date().getTime() + Math.floor(Math.random() * 1001)) * -1;
        }

        //** Start of directive init
        function getSchema() {
            var s = schemaParser.fromDomainSchema($scope.project.input_data_model.schema, true);
            s.name = s.name || '';

            return s;
        }

        /**
         * Initializes vars etc.
         */
        function init() {
            activeComponentId = '';
            availableIds = [];
            $scope.activeMapping = { };
            $scope.tabs = [];

            $scope.gridItems = [];
            $scope.gridItemConnections = [];

            $scope.gridsterOpts = angular.extend({}, $scope.gridsterOpts, {
                minRows: 0,
                maxRows: 0,
                maxGridRows: 0
            });

            // restore mappings if a previous project was loaded from a draft
            loDash.reduce($scope.project.mappings, function(previous, mapping) {

                loDash.forEach(mapping.input_attribute_paths, function(iap) {
                    if (iap.filter) {
                        var schema = getSchema(),
                            expression = angular.fromJson(iap.filter.expression),

                            filter = filterHelper.applyFilter(schema, expression),

                            iapFilter = {
                                filter: filter,
                                name: iap.filter.name
                            };

                        filterHelper.buildFilterInputs([iapFilter]);

                        // all existing they're merged into one filter now, this might be good or not?
                        iap._$filters = [iapFilter];
                    }
                });

                $scope.tabs.push({ title: mapping.name, active: false, id: mapping.id });
                availableIds.push(mapping.id);

                return mapping;
            }, null);
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

        /**
         * Hides all transformations
         */
        function hideTransformationPlumbs() {
            $scope.transformationStateError = '';

            PubSub.broadcast('jsp-connector-disconnect', { type: [ 'transformation', 'component' ]  });
        }

        var showTransformationPlumbsTimeout = null;

        /**
         * Initializes show of all transformations. Saves timeout to prevent multiple
         * events running into each other
         */
        function showTransformationPlumbsInit() {

            if(showTransformationPlumbsTimeout && showTransformationPlumbsTimeout.then) {
                $timeout.cancel(showTransformationPlumbsTimeout);
            }

            showTransformationPlumbsTimeout = $timeout(function() {
                showTransformationPlumbs();
            }, 100);

        }

        /**
         * The real function to show transformations. Use only via init function
         */
        function showTransformationPlumbs() {

            var connectOptions = { type : 'transformation' };

            $scope.transformationStateError = '';

            loDash.map($scope.gridItems, function(griditem) {

                var inputStrings = (!loDash.isNull(griditem.component.parameter_mappings.inputString)) ? griditem.component.parameter_mappings.inputString.split(',') : [];

                loDash.map(inputStrings, function(inputString) {

                    connectOptions.target = {
                        type : 'component',
                        id : griditem.id
                    };

                    if (inputString.length > 0) {

                        if (inputString.indexOf('component') === -1) {

                            var iap = loDash.find($scope.activeMapping.input_attribute_paths, function (iap) {
                                return Util.buildVariableName(iap.attribute_path.attributes) === inputString;
                            });

                            connectOptions.source = {
                                type: 'transformation-input',
                                id: iap.attribute_path.id
                            };
                        } else {

                            var component = loDash.find($scope.gridItems, function (griditem) {
                                return griditem.name === inputString;
                            });

                            connectOptions.source = {
                                type: 'component',
                                id: component.id
                            };
                        }

                        var newConnectOptions = angular.copy(connectOptions);
                        PubSub.broadcast('jsp-connector-connect', newConnectOptions);

                    }

                });

            });

            if($scope.activeMapping.input_attribute_paths) {

                if( ( $scope.activeMapping.input_attribute_paths.length > 1 ) && ( getOpenEndedComponents(-1).length > 1 ) ) {
                    $scope.transformationStateError = 'Mehr als ein möglicher Output-Weg. Bitte mit concat verringern';

                } else {

                    if($scope.gridItems.length === 0) {

                        connectOptions.source =  {
                            type : 'transformation-input',
                            id : $scope.activeMapping.input_attribute_paths[0].attribute_path.id
                        };

                    } else {

                        var lastItem = loDash($scope.activeMapping.transformation.function.components)
                            .filter(function(component) {
                                return component.output_components.length === 0;
                            })
                            .first();

                        connectOptions.source =  {
                            type : 'component',
                            id : lastItem.id
                        };

                    }

                    connectOptions.target = {
                        type : 'transformation-output',
                        id : $scope.activeMapping.output_attribute_path.attribute_path.id
                    };

                    PubSub.broadcast('jsp-connector-connect', connectOptions);

                }

            }


        }

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
         * Returns the prev component from grid by x,y position
         * @param positionX int
         * @param positionY int
         * @returns {*}
         */
        function findPrevGridItem(positionX, positionY) {

            if($scope.gridItems.length <= 1) {
                return undefined;
            } else {
                return loDash($scope.gridItems)
                    .filter({positionX : positionX, positionY : positionY - 1})
                    .first();
            }

        }

        /**
         * Ensure that the inputString is reference in component. Ensures there
         * is only one instance
         * @param component object the component
         * @param inputString string inputstring to add
         */
        function ensureInputString(component, inputString) {

            var componentInputString = (!loDash.isNull(component.parameter_mappings.inputString)) ? component.parameter_mappings.inputString.split(',') : [];

            componentInputString = loDash.filter(componentInputString, function(inputString) {
                return inputString.length > 0;
            });

            if(loDash.indexOf(componentInputString, inputString) === -1) {
                componentInputString.push(inputString);
            }

            component.parameter_mappings.inputString = componentInputString.join(',');

        }

        /**
         * Adds other component to input component array. Ensures only one instance
         * of that component
         * @param component object The component to add to
         * @param prevComponent object The component to be added
         */
        function ensureInputComponent(component, prevComponent) {

            if(loDash.indexOf(component.input_components, { id : prevComponent.id }) === -1) {
                component.input_components.push({ id : prevComponent.id });
            }

        }

        /**
         * Adds other component to output component array. Ensures only one instance
         * of that component
         * @param component object The component to add to
         * @param prevComponent object The component to be added
         */
        function ensureOutputComponent(component, prevComponent) {

            if(loDash.indexOf(prevComponent.output_components, { id : component.id }) === -1) {
                prevComponent.output_components.push({ id : component.id });
            }

        }

        /**
         * Adds other component to output and input component array. Ensures only one instance
         * of that component
         * @param component object The component to add to
         * @param prevComponent object The component to be added
         */
        function ensureInputOutputComponents(component, prevComponent) {

            ensureInputComponent(component, prevComponent);
            ensureOutputComponent(component, prevComponent);

        }

        function updateInputOutputMappings() {

            var transformation = $scope.activeMapping.transformation;

            var outputAttributes = $scope.activeMapping.output_attribute_path.attribute_path.attributes;
            var transformationOutputVariable = getOutputVariable($scope.activeMapping);

            transformation.parameter_mappings = loDash.omit(transformation.parameter_mappings, function(value, key) {
                return key.indexOf('TRANSFORMATION_OUTPUT_VARIABLE') > -1;
            });

            transformation.parameter_mappings[transformationOutputVariable] = Util.buildUriReference(outputAttributes);

            loDash.times($scope.gridsterOpts.maxRows, function(i) {
                var inputAttributes = $scope.activeMapping.input_attribute_paths[i].attribute_path.attributes;
                // create a simple name for this input_attribute_path
                var varName = Util.buildAttributeName(inputAttributes, 'name', '_');
                // create the fq-uri for this input_attribute_path
                transformation.parameter_mappings[varName] = Util.buildUriReference(inputAttributes);
            });

        }

        /**
         * Updates the input and output objets for a given grid position
         * @param positionX int
         * @param positionY int
         */
        function updateGridInputOutput(positionX, positionY) {

            var currentGridItem = loDash($scope.gridItems)
                .filter({positionX : positionX, positionY : positionY })
                .first();

            var prevGridItem = findPrevGridItem(positionX, positionY);

            if(prevGridItem) {

                if(prevGridItem.component.output_components.length > 0) {

                    var component = loDash.find($scope.activeMapping.transformation.function.components, { id : prevGridItem.component.output_components[0].id});
                    removeFromComponentList([component], 'input_components', prevGridItem.component.id);

                    removeInputString(component, prevGridItem.component.name);

                    prevGridItem.component.output_components = [];
                }

                ensureInputString(currentGridItem.component, prevGridItem.name);
                ensureInputOutputComponents(currentGridItem.component, prevGridItem.component);

            } else {

                ensureInputString(currentGridItem.component, Util.buildAttributeName($scope.activeMapping.input_attribute_paths[positionX].attribute_path.attributes, 'name', '_'));

            }

        }

        /**
         * Adds component to project
         * @param component object the component to be added
         */
        function addComponentToProject(component) {

            $scope.activeMapping.transformation.function.components.push(component);

        }

        /**
         * Handles a dropped element to a grid position
         * @param positionX
         * @param positionY
         * @param functionDataOriginal
         */
        function dropToGrid(positionX, positionY, functionDataOriginal) {

            var componentData = {
                function: angular.copy(functionDataOriginal),
                name : 'component' + getId() * -1,
                id: getId(),
                output_components : [],
                input_components : [],
                description: angular.toJson({
                    x: Util.buildVariableName($scope.activeMapping.input_attribute_paths[positionX].attribute_path.attributes),
                    y: positionY
                })
            };

            removeDropPlaceholder();

            ensureComponentProperties(componentData);

            addToGrid(positionX, positionY, componentData);

            addComponentToProject(componentData);

            updateGridInputOutput(positionX, positionY);

            buildFunctionToProject();
        }

        /**
         * Adds an element to a specific position inside the grid
         * @param positionX - X position
         * @param positionY - Y position
         * @param itemData - The original data of the dropped function
         */
        function addToGrid(positionX, positionY, componentData) {

            $scope.gridItems.push({
                positionX: positionX,
                positionY: positionY,
                component: componentData,
                name : componentData.name,
                id: componentData.id
            });

        }

        /**
         * Removes an id from an id referenced list of components (e.g.
         * input_components or output_components)
         * @param components array The list of objects to be extracted
         * @param componentName The referenced list name to extract from
         * @param idToRemove int Which id to remove
         */
        function removeFromComponentList(components, componentName, idToRemove) {

            loDash.map(components, function(component) {

                var otherComponents = loDash.find($scope.activeMapping.transformation.function.components, { id : component.id});

                otherComponents[componentName] = loDash.filter(otherComponents[componentName], function(otherComponent) {
                    return otherComponent.id !== idToRemove;
                });

            });

        }

        /**
         * Removes input string from stringified inputString list
         * @param component object Component to be removed from
         * @param inputStringToRemove string String to be removed
         */
        function removeInputString(component, inputStringToRemove) {

            var inputString = component.parameter_mappings.inputString.split(',');

            inputString = loDash.without(inputString, inputStringToRemove);

            component.parameter_mappings.inputString = inputString.join(',');
        }

        /**
         * Receives a drop of a dragged function from the list to the grid.
         * @param dragEl - DOM element that has been dragged
         * @param dropEl - DOM element that has been dropped
         */
        $scope.dropped = function(dragEl, dropEl) {
            dropToGrid(angular.element(dropEl).scope().item.positionX, angular.element(dropEl).scope().item.positionY, angular.element(dragEl).scope().child);
        };

        PubSub.subscribe($rootScope, ['DRAG-START'], function() {
            createDropPlaceholder();

            hideTransformationPlumbs();
        });

        PubSub.subscribe($rootScope, ['GRIDSTER-DRAG-START'], hideTransformationPlumbs);

        PubSub.subscribe($rootScope, ['DRAG-END', 'GRIDSTER-DRAG-END'], function() {

            removeDropPlaceholder();

            loDash.map($scope.gridItems, function(gridItem) {

                var inputAPRows = loDash.zipObject(loDash.map($scope.activeMapping.input_attribute_paths, function(iap, idx) {
                    return [getRowIdentifier(iap), idx];
                }));

                var pos = angular.fromJson(gridItem.component.description);

                var storedPositionX = inputAPRows[pos.x],
                    storedPositionY = pos.y;

                if(gridItem.positionX !== storedPositionX || storedPositionY !== gridItem.positionY) {

                    removeFromComponentList(gridItem.component.input_components, 'output_components', gridItem.id);
                    gridItem.component.input_components = [];

                    removeFromComponentList(gridItem.component.output_components, 'input_components', gridItem.id);
                    gridItem.component.output_components = [];

                    gridItem.component.parameter_mappings.inputString = '';

                    updateGridInputOutput(gridItem.positionX, gridItem.positionY);

                    gridItem.component.description = angular.toJson({
                        x: Util.buildVariableName($scope.activeMapping.input_attribute_paths[gridItem.positionX].attribute_path.attributes),
                        y: gridItem.positionY
                    });

                }



            });

            showTransformationPlumbsInit();

        });

        function unsubscribePlumbEvents() {
            PubSub.unsubscribe($rootScope, ['GRIDSTER-DRAG-START']);
            PubSub.unsubscribe($rootScope, ['DRAG-END', 'GRIDSTER-DRAG-END']);
        }

        $rootScope.$on('$locationChangeStart', function() {
            unsubscribePlumbEvents();
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
                        $scope.gridsterOpts.minGridRows =
                            $scope.gridsterOpts.gridHeight = height;
        }

        /**
         * returns a "hash" value for a given inputAttributePath, that can be used
         *  to reliably identify the value identity of an inputAttributePath
         * @param iap
         * @returns {*}
         */
        function getRowIdentifier(iap) {
            return Util.buildVariableName(iap.attribute_path.attributes);
        }

        function ensureComponentProperties(component) {
            if (!component.parameter_mappings) {
                component.parameter_mappings = { inputString : null };
            }
            if (!component.input_components) {
                component.input_components = [];
            }
            if (!component.output_components) {
                component.output_components = [];
            }
        }


        /**
         * Builds visual grid from internal data structure
         */
        function createGridFromInternalComponents() {

            hideTransformationPlumbs();

            setGridHeight($scope.activeMapping.input_attribute_paths.length);

            $scope.gridItems = [];

            var inputAPRows = loDash.zipObject(loDash.map($scope.activeMapping.input_attribute_paths, function(iap, idx) {
                return [getRowIdentifier(iap), idx];
            }));

            if(!$scope.activeMapping.transformation) {
                $scope.activeMapping.transformation = createNewTransformation();
            }

            var transformation = $scope.activeMapping.transformation;

            loDash.forEach(transformation.function.components, ensureComponentProperties);

            loDash.times($scope.activeMapping.input_attribute_paths.length, function(idx) {

                var rowComponents = loDash.filter(transformation.function.components, function(component) {
                    var pos = angular.fromJson(component.description);
                    return inputAPRows[pos.x] === idx;
                });

                rowComponents = loDash.sortBy(rowComponents, function(component) {
                    var pos = angular.fromJson(component.description);
                    return pos.y;
                });

                loDash.map(rowComponents, function(component) {

                    var realPosX, realPosY;

                    var pos = angular.fromJson(component.description);

                    realPosX = inputAPRows[pos.x];
                    realPosY = pos.y;

                    addToGrid(realPosX, realPosY, component);

                });

            });

            showTransformationPlumbsInit();

        }

        /**
         * Builds the components inside the project data structure from the
         * visual grid representation.
         */
        function createInternalComponentsFromGridItems() {

            if (!$scope.activeMapping.id) {
                return;
            }

        }

        /**
         * Extracts a component by id
         * @param id - Component id to return
         * @returns {*}
         */
        function getComponent(id) {
            return loDash.find($scope.activeMapping.transformation.function.components, {id: id});
        }

        /**
         * Creates a default data structure for a transformation
         * @param {String=} name - Optional given name
         * @param {String=} description - Optional given description
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
                $scope.gridItemConnections = [];
                activateTab(id);

                if (!$scope.activeMapping) {
                    $scope.activeMapping = {};
                }

                activeComponentId = id;

                if (!skipBroadcast) {
                    PubSub.broadcast('connectionSwitched', { id: $scope.activeMapping._$connection_id });
                }

                createGridFromInternalComponents();

                updateInputOutputMappings();

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
            activate(tab.id, false);
        };

        /**
         * Formats an attribute path for output
         * @param ap - Attribute path  data structure
         * @returns {string}
         */
        $scope.formatAttributePath = function(ap) {
            if (angular.isObject(ap) && angular.isDefined(ap.attributes)) {
                return Util.buildAttributeName(ap.attributes, 'name', ' › ');
            }
            return '';
        };

        //** End of mapping activation and selection

        PubSub.subscribe($scope, 'connectionSelected', function(data) {

            hideTransformationPlumbs();

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

            if ($scope.activeMapping.input_attribute_paths.length !== data.additionalInput.length + 1) {

                var shortPaths = loDash.map($scope.project.input_data_model.schema.attribute_paths, function(ap) {
                    return [loDash.map(ap.attributes, 'id'), ap];
                });

                angular.forEach(data.additionalInput, function(input) {

                    //noinspection FunctionWithInconsistentReturnsJS
                    var pathInSchema = Util.collect(shortPaths, function(sp) {
                        if (loDash.isEqual(sp[0], input.path)) {
                            return sp[1];
                        }
                    })[0];

                    var alreadyInIap = pathInSchema && loDash.any($scope.activeMapping.input_attribute_paths, function(iap) {
                        return iap.attribute_path.id === pathInSchema.id;
                    });

                    if(pathInSchema && !alreadyInIap) {
                        $scope.activeMapping.input_attribute_paths.push({
                            type: 'MappingAttributePathInstance',
                            name: 'input mapping attribute path instance',
                            id: (new Date().getTime() + 1) * -1,
                            attribute_path: pathInSchema
                        });
                    }
                });
            }

            setGridHeight($scope.activeMapping.input_attribute_paths.length);

            showTransformationPlumbsInit();

            updateInputOutputMappings();

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

        //** Start of configuring components
        $scope.onFunctionClick = function(component, onlyIfAlreadyOpened) {
            var newComponent = angular.copy(getComponent(component.id));
            PubSub.broadcast('handleEditConfig', {
                component: newComponent,
                onlyIfAlreadyOpened: !!onlyIfAlreadyOpened
            });
        };

        PubSub.subscribe($scope, 'handleConfigEdited', function(component) {
            angular.forEach($scope.activeMapping.transformation.function.components, function(comp) {

                if (comp.id === component.id) {
                    if(component.parameter_mappings.inputStringSorting) {
                        component.parameter_mappings.inputString = loDash.flatten(component.parameter_mappings.inputStringSorting, 'id');
                        component.parameter_mappings.inputString = component.parameter_mappings.inputString.join(',');

                        delete component.parameter_mappings.inputStringSorting;
                    } else {
                        if(comp.parameter_mappings.inputString && comp.parameter_mappings.inputString.length > 0) {
                            component.parameter_mappings.inputString = comp.parameter_mappings.inputString;
                        }
                    }

                    comp.parameter_mappings = component.parameter_mappings;
                }
            });
        });
        //** End of configuring components

        //** Start handling filter
        // dectivated until further notice
        PubSub.subscribe($scope, 'FilterKeySelected', function(data) {
            // TODO: get a IAP instance from somewhere
            openFilter($scope.activeMapping, data.attributePathId, null);
        });

        $scope.onFilterClick = function(iap) {

            openFilter($scope.activeMapping, iap.attribute_path.id, iap);
        };

        function openFilter(mapping, attributePathId, IAPInstance) {
            if (!IAPInstance._$filters) {
                IAPInstance._$filters = [];
            }

            var modalInstance = $modal.open({
                templateUrl: 'views/directives/filter.html',
                controller: 'FilterCtrl',
                windowClass: 'wide',
                resolve: {
                    mapping: function() {
                        return mapping;
                    },
                    attributePathId: function() {
                        return attributePathId;
                    },
                    filters: function() {
                        return IAPInstance._$filters;
                    }
                }
            });


            modalInstance.result.then(function() {
                var filters = loDash.flatten(loDash.map(IAPInstance._$filters, function(filter) {
                    //noinspection FunctionWithInconsistentReturnsJS
                    return Util.collect(filter.inputFilters, function(f) {
                        var path = loDash.find($scope.project.input_data_model.schema.attribute_paths, {id: f.apId});
                        if (path) {
                            path = Util.buildUriReference(path.attributes);
                            // path = loDash.pluck(path.attributes, 'uri').join('&amp;#30;');
                            return [path, f.title];
                        }
                    });
                }), true);

                var expression = JSON.stringify(loDash.zipObject(filters));
                // expression = expression.replace(new RegExp('\"', 'g'), '&quot;');

                if (IAPInstance.filter) {
                    IAPInstance.filter.expression = expression;
                } else {
                    IAPInstance.filter = {
                        id: getId(),
                        expression: expression
                    };
                }
            });
        }
        //** End handling filter

        $scope.isMultiple = function(item) {
            return (item.component.function.name === 'concat');
        };

        /**
         * Returns all open ends
         * @param excludeRow Row to exclude from open end findings. E.g. current row
         * @returns {Array}
         */
        function getOpenEndedComponents(excludeRow) {

            excludeRow = loDash.isNull(excludeRow) ? -1 : excludeRow;

            var openEndedComponents = [];

            // find all ends if there is more than one possibility

            if ( $scope.activeMapping.input_attribute_paths.length > 1 ) {

                angular.forEach($scope.activeMapping.input_attribute_paths, function(path, row) {

                    if(row !== excludeRow) {
                        //var currentRowItems = loDash.find($scope.gridItems, {positionX : row});

                        var currentRowItems = loDash.filter($scope.gridItems, function(griditem) {
                            return griditem.positionX === row && !griditem.placeholder && griditem.component.output_components.length === 0;
                        });

                        if(!currentRowItems || currentRowItems.length === 0) {

                            var thisOpenEnded = true;

                            angular.forEach($scope.activeMapping.transformation.function.components, function(component) {
                                if(component.parameter_mappings.inputString && component.parameter_mappings.inputString.length > 0) {

                                    var inputString = component.parameter_mappings.inputString.split(',');

                                    if(loDash.indexOf(inputString, Util.buildVariableName($scope.activeMapping.input_attribute_paths[row].attribute_path.attributes)) > -1) {
                                        thisOpenEnded = false;
                                    }
                                }
                            });

                            if(thisOpenEnded) {
                                openEndedComponents.push({
                                    display : $scope.formatAttributePath($scope.activeMapping.input_attribute_paths[row].attribute_path),
                                    name : Util.buildVariableName($scope.activeMapping.input_attribute_paths[row].attribute_path.attributes),
                                    type : 'attribute_path_instance',
                                    data : $scope.activeMapping.input_attribute_paths[row]
                                });
                            }

                        } else {

                            currentRowItems = loDash(currentRowItems).sortBy('positionY').last();

                            var currentRowIndexInGridItemConnection = loDash.findIndex($scope.gridItemConnections, function(gridItemConnection) {
                                if(loDash.isUndefined(gridItemConnection)) { return false; }
                                if(loDash.isNull(gridItemConnection.source.data)) { return false; }
                                return gridItemConnection.source.data.id === currentRowItems.id;
                            });

                            if(currentRowIndexInGridItemConnection === -1) {
                                openEndedComponents.push({
                                    display : currentRowItems.component.function.name,
                                    name : currentRowItems.component.function.name,
                                    type : 'griditem',
                                    data : currentRowItems
                                });
                            }

                        }
                    }

                });

            }

            return openEndedComponents;
        }


        /**
         * Are there any open ended components?
         * @returns {boolean}
         */
        $scope.hasOpenEndedComponents = function() {
            return (getOpenEndedComponents(-1).length > 1);
        };

        /**
         * Adds additional grid item connections to register
         * @param source object
         * @param target
         */
        function addGridItemConnections(source, target) {

            ensureInputString(target.component, (source.type ==='attribute_path_instance') ? source.name : source.data.name);

            if(source.type !=='attribute_path_instance') {
                ensureInputOutputComponents(target.component, source.data.component);
            }

            createInternalComponentsFromGridItems();
        }

        /**
         *
         * @param currentItem
         * @returns {modalInstance.result|*}
         */
        function askMultipleComponentInput(currentItem) {

            var modalInstance = $modal.open({
                templateUrl: 'views/modals/multiple-input-component-selector.html',
                controller: 'MultipleInputComponentSelectorCtrl',
                resolve: {
                    componentSet: function() {
                        return getOpenEndedComponents(currentItem.positionX);
                    }
                }
            });

            return modalInstance.result;
        }

        /**
         * Function when
         * @param currentItem The current item
         */
        $scope.onMultipleComponentInputAdd = function(currentItem) {

            askMultipleComponentInput(currentItem).then(function(component) {

                hideTransformationPlumbs();

                addGridItemConnections(component[0], currentItem);

                $scope.onFunctionClick(currentItem, true);

                showTransformationPlumbsInit();

            });

        };


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
