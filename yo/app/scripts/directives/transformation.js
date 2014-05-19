'use strict';

angular.module('dmpApp')
    .controller('TransformationCtrl', function($scope, $window, $modal, $q, $rootScope, $timeout, PubSub, loDash, schemaParser, filterHelper, TaskResource, Util) {
        $scope.internalName = 'Transformation Logic Widget';

        var activeComponentId = null,
            availableIds = [],
        // TODO: Find better solution instead of hard limiting to 6 items per row
            gridMaxItemsPerRow = 6,
            isDraggingToGrid = false;

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
            loDash.forEach($scope.project.mappings, function(mapping) {

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
            });
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

        var showTransformationPlumbsTimeout = null;

        function showTransformationPlumbsInit() {

            if(showTransformationPlumbsTimeout && showTransformationPlumbsTimeout.then) {
                $timeout.cancel(showTransformationPlumbsTimeout);
            }

            showTransformationPlumbsTimeout = $timeout(function() {
                showTransformationPlumbs();
            }, 100);

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
            angular.forEach($scope.gridItemConnections, function(itemConnection) {

                if(itemConnection.source.data) {

                    if(itemConnection.source.type === 'attribute_path_instance') {
                        connectOptions.source = {
                            type : 'transformation-input',
                            id : itemConnection.source.data.attribute_path.id
                        };
                    } else {
                        connectOptions.source = {
                            type : 'component',
                            id : itemConnection.source.data.id
                        };
                    }

                    connectOptions.target = {
                        type : 'component',
                        id : itemConnection.target.id
                    };

                    var newConnectOptions = angular.copy(connectOptions);

                    PubSub.broadcast('jsp-connector-connect', newConnectOptions);

                }

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
         * Handles a dropped element to a grid position
         * @param positionX
         * @param positionY
         * @param itemDataOriginal
         */
        function dropToGrid(positionX, positionY, itemDataOriginal) {

            var itemData = angular.copy(itemDataOriginal),
                itemName = 'component' + getId()*-1;

            if(!itemData.hasOwnProperty('function_description')) {
                itemData.function_description = angular.copy(itemData);
            }

            addToGrid(positionX, positionY, itemData, itemName, getId());

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
        function addToGrid(positionX, positionY, itemData, itemName, id) {

            $scope.gridItems.push({
                positionX: positionX,
                positionY: positionY,
                function: itemData,
                name : itemName,
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
        }, true);

        PubSub.subscribe($rootScope, ['DRAG-START'], function() {
            isDraggingToGrid = true;
            createDropPlaceholder();

            hideTransformationPlumbs();
        });

        PubSub.subscribe($rootScope, ['GRIDSTER-DRAG-START'], hideTransformationPlumbs);

        PubSub.subscribe($rootScope, ['DRAG-END', 'GRIDSTER-DRAG-END'], function() {

            isDraggingToGrid = false;

            removeDropPlaceholder();
            isDraggingToGrid = false;

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

            var walkChainedComponentsRegister = [],
                gridItemConnectionsRegister = [];


            function walkChainedComponents(result, components, pool) {
                var nextLevel = loDash(components).pluck('output_components').flatten().pluck('id').value(),
                    connectComponents;

                // if a component has multiple inputs another connector needs to be created
                if(loDash.indexOf(walkChainedComponentsRegister, nextLevel[0]) > -1) {

                    connectComponents = loDash.map(nextLevel, function(id) {
                        return pool[id];
                    });

                    var connectComponentSource = loDash.filter(result, function(cp) {

                        return loDash.any(connectComponents[0].input_components, {id: cp.id});
                    });

                    gridItemConnectionsRegister.push({
                        target : connectComponents,
                        source : connectComponentSource,
                        type : 'griditem'
                    });

                    // end of the line.
                    nextLevel = [];
                } else {

                    connectComponents = loDash.map(nextLevel, function(id) {
                        return pool[id];
                    });

                    angular.forEach(connectComponents, function(connectComponent) {
                        if(connectComponent.parameter_mappings.inputString && connectComponent.parameter_mappings.inputString.length > 0) {

                            var inputString = connectComponent.parameter_mappings.inputString.split(',');

                            angular.forEach(inputString, function(input_variable) {

                                if(input_variable.indexOf('component') === -1) {

                                    gridItemConnectionsRegister.push({
                                        target : connectComponents,
                                        source : input_variable,
                                        type : 'attribute_path_instance'
                                    });

                                }

                            });

                        }
                    });

                }

                if (loDash.isEmpty(nextLevel)) {
                    return result;
                }

                walkChainedComponentsRegister = walkChainedComponentsRegister.concat(nextLevel);

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
                            var realPosX = posX,
                                realPosY = posY;
                            if (component.description) {
                                try {
                                    var pos = angular.fromJson(component.description);
                                    realPosX = pos.x;
                                    realPosY = pos.y;
                                } catch (ignore) {}
                            }
                            addToGrid(realPosX, realPosY, component.function, component.name, component.id);
                        }
                    });
                });

                if(gridItemConnectionsRegister.length > 0) {

                    angular.forEach(gridItemConnectionsRegister, function(gridItemConnectionsRegisterItem) {

                        var targetComponent = getGridItemFromComponentId(gridItemConnectionsRegisterItem.target[0].id),
                            connectionSource;

                        if(gridItemConnectionsRegisterItem.type === 'griditem') {

                            var sourceComponent = getGridItemFromComponentId(gridItemConnectionsRegisterItem.source[0].id);

                            connectionSource = {
                                name: sourceComponent.function.name,
                                type: 'griditem',
                                data: sourceComponent
                            };

                        } else {

                            var sourceIap = getIapByVariableName(gridItemConnectionsRegisterItem.source);

                            connectionSource = {
                                name: gridItemConnectionsRegisterItem.source,
                                type: 'attribute_path_instance',
                                data: sourceIap
                            };

                        }

                        addGridItemConnections(
                            connectionSource,
                            targetComponent
                        );

                    });

                }

            }

            showTransformationPlumbsInit();

        }


        /**
         * Returns the IAP by giving the varname
         * @param varName
         * @returns {*}
         */
        function getIapByVariableName(varName) {

            if(!$scope.activeMapping.transformation.parameter_mappings[varName]) {
                return null;
            }

            return loDash.find($scope.activeMapping.input_attribute_paths, function(input_attribute_path) {
                return input_attribute_path.attribute_path.attributes[0].uri === $scope.activeMapping.transformation.parameter_mappings[varName];
            });
        }

        /**
         * Returns a iap varName by giving a iap index position
         * @param index
         * @returns {Mixed|string|undefined|*}
         */
        function getIapVariableNameByIndex(index) {

            var input_attribute_path = $scope.activeMapping.input_attribute_paths[index];

            return loDash.findKey($scope.activeMapping.transformation.parameter_mappings, function(parameter_mapping) {
                return input_attribute_path.attribute_path.attributes[0].uri === parameter_mapping;
            });

        }

        /**
         * Returns component from gridItems by component id
         * @param componentId
         * @returns {*|Mixed}
         */
        function getGridItemFromComponentId(componentId) {
            return loDash.find($scope.gridItems, { id : componentId}) ;
        }

        /**
         * Lookup a component in the projects pool, optionally creating a new one
         * @param component
         * @returns {*}
         */
        function resolveComponent(component) {
            var storedComponent;

            storedComponent = getComponent(component.id);
            if (!storedComponent) {
                storedComponent = createNewComponent(component);
            }

            storedComponent.description = angular.toJson({
                x: component.positionX,
                y: component.positionY
            });

            return storedComponent;
        }

        /**
         * Chain a string of components together by setting their (in|out)put_components
         * This is a aggregation function that is meant to be used by loDash.reduce or the like
         * @param result
         * @param component
         * @returns {*}
         */
        function chainRowComponents(result, component) {

            component.input_components = [];
            component.output_components = [];

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

                if(!component.parameter_mappings.inputString) {

                    component.parameter_mappings.inputString = last.name;

                } else {

                    var inputString = component.parameter_mappings.inputString.split(','),
                        componentName = last.name;

                    if(loDash.indexOf(inputString, componentName) === -1) {

                        inputString.push(componentName);

                        component.parameter_mappings.inputString = inputString.join(',');

                    }

                }

            } else {

                if(!component.parameter_mappings.inputString) {

                    var gridItem = getGridItemFromComponentId(component.id);
                    component.parameter_mappings.inputString = getIapVariableNameByIndex(gridItem.positionX);

                }
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

                if(loDash.indexOf(transformation.function.parameters, varName) > -1) {
                    transformation.function.parameters.push(varName);
                }

                if (rowComponents.length > 0) {
                    rowComponents[0].parameter_mappings['inputString'] = varName;
                }

                // chain the row together
                return loDash.reduce(rowComponents, chainRowComponents, []);
            });

            transformation.function.components = loDash.flatten(rowComponents);

            var outputAttributes = $scope.activeMapping.output_attribute_path.attribute_path.attributes;

            var transformationOutputVariable = getOutputVariable($scope.activeMapping);

            transformation.parameter_mappings[transformationOutputVariable] = buildUriReference(outputAttributes);

            angular.forEach($scope.gridItemConnections, function(itemConnection) {

                var componentIndex,
                    componentName = itemConnection.source.name;

                if(itemConnection.source.type === 'griditem') {
                    componentName = itemConnection.source.data.name;
                }

                componentIndex = loDash.findIndex($scope.activeMapping.transformation.function.components, {id : itemConnection.target.id});

                if($scope.activeMapping.transformation.function.components[componentIndex].parameter_mappings.inputString && $scope.activeMapping.transformation.function.components[componentIndex].parameter_mappings.inputString.length > 0) {

                    var inputString = $scope.activeMapping.transformation.function.components[componentIndex].parameter_mappings.inputString.split(',');

                    if(loDash.indexOf(inputString, componentName) === -1) {

                        inputString.push(componentName);

                        $scope.activeMapping.transformation.function.components[componentIndex].parameter_mappings.inputString = inputString.join(',');
                    }

                } else {
                    $scope.activeMapping.transformation.function.components[componentIndex].parameter_mappings.inputString = componentName;
                }

                if(itemConnection.source.type === 'griditem') {

                    $scope.activeMapping.transformation.function.components[componentIndex].input_components.push({id : itemConnection.source.data.id });

                    componentIndex = loDash.findIndex($scope.activeMapping.transformation.function.components, {id : itemConnection.source.data.id});
                    $scope.activeMapping.transformation.function.components[componentIndex].output_components.push({id : itemConnection.target.id });

                }

            });
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
         * @param component {*} Internal object
         * @returns {{id: (*|$scope.file.id|.lines.params.id|exports.expected.id|exports.config.id|id), name: (*|string|name|jasmine-node.spec-requirejs.requirejs.sut.name|parser.name|exports.callee.object.name), description: (*|string|parser.description|.about.description|.info.description|exports.expected.description), function: (*|map.function|exports.function|mout.src.index.function|objectTypes.function|Function), parameter_mappings: {}, output_components: Array, input_components: Array}}
         */
        function createNewComponent(component) {

            return {
                id: component.id,
                name: component.name,
                description: component.description,
                function: component.function,
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
            activate(tab.id, false);
        };

        /**
         * Formats an attribute path for output
         * @param ap - Attribute path  data structure
         * @returns {string}
         */
        $scope.formatAttributePath = function(ap) {
            if (angular.isObject(ap) && angular.isDefined(ap.attributes)) {
                return buildAttributeName(ap.attributes, 'name', ' › ');
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
        $scope.onFunctionClick = function(component) {
            var newComponent = angular.copy(getComponent(component.id));
            PubSub.broadcast('handleEditConfig', newComponent);
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
                    return Util.collect(filter.inputFilters, function(f) {
                        var path = loDash.find($scope.project.input_data_model.schema.attribute_paths, {id: f.apId});
                        if (path) {
                            path = buildUriReference(path.attributes);
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
            return (item.function.function_description.name === 'concat');
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
                        var currentRowItems = loDash.find($scope.gridItems, {positionX : row});

                        if(!currentRowItems || currentRowItems.length === 0) {

                            var thisOpenEnded = true;

                            angular.forEach($scope.activeMapping.transformation.function.components, function(component) {
                                if(component.parameter_mappings.inputString && component.parameter_mappings.inputString.length > 0) {

                                    var inputString = component.parameter_mappings.inputString.split(',');

                                    if(loDash.indexOf(inputString, $scope.activeMapping.input_attribute_paths[row].attribute_path.attributes[0].name) > -1) {
                                        thisOpenEnded = false;
                                    }
                                }
                            });

                            if(thisOpenEnded) {
                                openEndedComponents.push({
                                    display : $scope.formatAttributePath($scope.activeMapping.input_attribute_paths[row].attribute_path),
                                    name : buildVariableName($scope.activeMapping.input_attribute_paths[row].attribute_path.attributes),
                                    type : 'attribute_path_instance',
                                    data : $scope.activeMapping.input_attribute_paths[row]
                                });
                            }

                        } else {

                            loDash.last(loDash.sortBy(currentRowItems, 'positionY'));

                            var currentRowIndexInGridItemConnection = loDash.findIndex($scope.gridItemConnections, function(gridItemConnection) {
                                if(loDash.isNull(gridItemConnection.source.data)) { return false; }
                                return gridItemConnection.source.data.id === currentRowItems.id;
                            });

                            if(currentRowIndexInGridItemConnection === -1) {
                                openEndedComponents.push({
                                    display : currentRowItems.function.function_description.name,
                                    name : currentRowItems.function.function_description.name,
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

            $scope.gridItemConnections.push({source : source, target : target});

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
