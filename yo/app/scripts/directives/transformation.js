'use strict';

angular.module('dmpApp')
    .controller('TransformationCtrl', function ($scope, $window, $modal, $q, $rootScope, PubSub, loDash, TaskResource, Util) {
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
            mobileBreakPoint : 100,
            minRows : 0,
            maxRows : 0,
            maxGridRows : 0,
            maxColumns : gridMaxItemsPerRow,
            noFloatingUp : true,
            containment : '.gridster'
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
                minRows : 0,
                maxRows : 0,
                maxGridRows : 0
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

        //** Start to handle function drag/drops

        /**
         * Generates placeholders inside the grid to show possible drop positions.
         */
        function createDropPlaceholder() {

            for(var j = 0; j < $scope.gridsterOpts.maxRows; j++) {

                for(var i = 0; i < gridMaxItemsPerRow; i++) {

                    if(loDash.findIndex($scope.gridItems, { positionY: i, positionX: j  }) < 0) {
                        $scope.gridItems.push({
                            positionX: j,
                            positionY: i,
                            placeholder : true
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
         * @param functionData - A function data structure
         */
        function buildFunctionToProject() {

            $scope.project.functions = [];

            angular.forEach($scope.project.mappings, function(mapping) {

                angular.forEach(mapping.transformation.function.components, function(component) {

                    if(loDash.indexOf($scope.project.functions, component.function) === -1) {
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

            addToGrid(positionX, positionY, itemData, getId(itemData.id));

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
                positionX : positionX,
                positionY : positionY,
                function: itemData,
                id : id
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
            if(isDraggingToGrid === false) {
                createInternalComponentsFromGridItems();
            }
            isDraggingToGrid = null;
        }, true);

        PubSub.subscribe($rootScope, ['DRAG-START'], function() {
            isDraggingToGrid = true;
            createDropPlaceholder();

        });

        PubSub.subscribe($rootScope, ['DRAG-END', 'GRIDSTER-DRAG-END'], function() {
            //removeDropPlaceholder();
            isDraggingToGrid = false;
        });

        //** End of function drag/drops handling

        //** Start of grid creation

        /**
         * Builds visual grid from internal data structure
         */
        function createGridFromInternalComponents() {

            $scope.gridItems = [];

            if (typeof $scope.activeMapping.transformation !== 'undefined' &&
                typeof $scope.activeMapping.transformation.function !== 'undefined' &&
                typeof $scope.activeMapping.transformation.function.components !== 'undefined') {

                angular.forEach($scope.activeMapping.transformation.function.components, function(value, key) {

                    // TODO: Build along path

                    if(value !== null) {
                        addToGrid(0, key, value.function, value.id);
                    }
                });

            }

        }

        /**
         * Builds the components inside the project data structure from the
         * visual grid representation.
         */
        function createInternalComponentsFromGridItems() {
            var internalComponents = [];

            if(!$scope.activeMapping.id) {
                return;
            }

            if (angular.isUndefined($scope.activeMapping.transformation)) {
                $scope.activeMapping.transformation = createNewTransformation();
            }

            var mapRowComponents = function(component) {

                var newComponent = getComponent(component.id);

                if (newComponent) {
                    return newComponent;
                }

                return createNewComponent(component.function, component.id);
            };

            var chainRowComponents = function(result, component) {

                if (result.length > 0) {
                    var last = loDash.last(result);

                    component.input_components = [{
                        id: last.id
                    }];

                    last.output_components = [{
                        id: component.id
                    }];
                }

                result.push(component);

                return result;
            };

            // TODO: Expand to combine multiple input paths
            // for(var i = 0; i < $scope.gridsterOpts.maxRows; i++) {
            for(var i = 0; i < 1; i++) {

                // get all in this row to array
                var rowComponents = loDash.filter($scope.gridItems, {positionX : i});

                // order by column
                rowComponents = loDash.sortBy(rowComponents, 'positionY');

                // replace array entry with original internal component oder generiere eine neue
                rowComponents = loDash.map(rowComponents, mapRowComponents);

                // kreiere verkettung aus array reihenfolge
                internalComponents = loDash.reduce(rowComponents, chainRowComponents, internalComponents);

                // füge aktuelle reihe zu internalComponents
                $scope.activeMapping.transformation.function.components = internalComponents;

                // ermittle input_attribute_paths für aktuelle row
                // TODO: Change to flexible multi input handling

                if(typeof $scope.activeMapping.transformation.parameter_mappings === 'undefined') {
                    $scope.activeMapping.transformation.parameter_mappings = {};
                }

                $scope.activeMapping.transformation.parameter_mappings['transformationInputString'] =
                    $scope.activeMapping.input_attribute_paths[i].attribute_path.attributes[0].uri;

            }

            // ermittle output_attripute_path für aktuelle row

            $scope.activeMapping.transformation.parameter_mappings['transformationOutputVariable'] =
                $scope.activeMapping.output_attribute_path.attribute_path.attributes[0].uri;

        }

        /**
         * Extracts a component by id
         * @param id - Component id to return
         * @returns {*|Mixed}
         */
        function getComponent(id) {
            return loDash.find($scope.activeMapping.transformation.function.components, { id : id});
        }

        /**
         * Creates default component data structure around a given function
         * @param func - Function object
         * @param id {number} - the ID to use
         * @returns {{id: number, name: (*|string|string|name|parser.name|exports.callee.object.name), description: (*|string|parser.description|.about.description|.info.description|exports.expected.description), function: *, parameter_mappings: {}, output_components: Array, input_components: Array}}
         */
        function createNewComponent(func, id) {

            return {
                id : id,
                name : func.name,
                description : func.description,
                function : func,
                parameter_mappings : {},
                output_components : [],
                input_components : []
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
                name : name,
                description : description,
                function : {
                    name : name,
                    description : description,
                    //TODO: make flex, this only handles one input to transformation
                    parameters : ['transformationInputString'],
                    type : 'Transformation',
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

                $scope.activeMapping =  $scope.project.mappings[availableIds.indexOf(id)];
                activateTab(id);

                if(!$scope.activeMapping) {
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
                tab.active= false;
                return tab;
            });

            if(tabIndex>= 0) {
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
        $scope.formatAttributePath = function (ap) {
            if (angular.isObject(ap) && angular.isDefined(ap.attributes)) {
                return loDash.map(ap.attributes, 'name').join(' › ');
            }
            return '';
        };

        //** End of mapping activation and selection

        PubSub.subscribe($scope, 'connectionSelected', function(data) {

            if (activeComponentId !== data.mapping_id) {
                if (loDash.any($scope.project.mappings, { 'id' : data.mapping_id })) {

                    var idx = availableIds.indexOf(data.mapping_id);
                    activateTab(idx);

                    var midx = loDash.findIndex($scope.project.mappings, {id : data.mapping_id});

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
                            id :  data.mapping_id,
                            _$connection_id : data.connection_id,
                            name : data.name,
                            transformation : createNewTransformation(),
                            input_attribute_paths : [{
                                type : 'MappingAttributePathInstance',
                                name : 'input mapping attribute path instance',
                                id : (new Date().getTime()+1)*-1,
                                attribute_path : inputAttributePaths[0]
                            }],
                            output_attribute_path : {
                                type : 'MappingAttributePathInstance',
                                name : 'output mapping attribute path instance',
                                id : (new Date().getTime()+2)*-1,
                                attribute_path : outputAttributePaths[0]
                            }
                        };

                    $scope.project.mappings.push(mapping);

                    $scope.tabs.push( { title: data.name, active: true, id: data.mapping_id, mappingId : data.mapping_id } );
                    availableIds.push(data.mapping_id);

                    activate(data.mapping_id, true);
                }
            } else {
                $scope.activeMapping._$connection_id = data.connection_id;
            }

            $scope.gridsterOpts.maxRows =
                $scope.gridsterOpts.minRows =
                    $scope.gridsterOpts.maxGridRows =
                        $scope.gridsterOpts.gridHeight = data.additionalInput.length +1;

            if($scope.activeMapping.input_attribute_paths.length !== data.additionalInput.length+1) {

                angular.forEach(data.additionalInput, function(input) {
                    angular.forEach($scope.project.input_data_model.schema.attribute_paths, function(path) {
                        if(loDash.findIndex(path.attributes, { 'id': input.path[0] }) >= 0) {

                            $scope.activeMapping.input_attribute_paths.push({
                                type : 'MappingAttributePathInstance',
                                name : 'input mapping attribute path instance',
                                id : (new Date().getTime()+1)*-1,
                                attribute_path : path
                            });

                        }
                    });

                });

            }


            if($scope.$$phase !== '$digest') {
                $scope.$digest();
            }
        });

        //** Start of sending transformation to server

        /**
         * Send all transformations to the server
         * @param tasks - Tranformations to send
         */
        function sendTransformations(tasks) {

            var promises = loDash.map(tasks, function(task) {
                //noinspection JSUnresolvedVariable
                return TaskResource.execute(Util.toJson(task)).$promise;
            });

            $q.all(promises)
                .then(function(results) {
                    loDash.forEach(results, function(result) {
                        //dump(result);
                        PubSub.broadcast('transformationFinished', result);
                    });
                }, function(resp) {
                    console.log(resp);
                    $window.alert(resp.message || resp.data.error);
                });

        }

        /**
         * Send a single transformation to the server
         * @param tab - Tranformation to send
         */
        $scope.sendTransformation = function () {

                var payload = {
                    name: $scope.activeMapping.name,
                    description : 'A Transformation',
                    job: {
                        mappings : [$scope.activeMapping]
                    },
                    input_data_model :$scope.project.input_data_model,
                    output_data_model : $scope.project.output_data_model
                };

                sendTransformations([payload]);
            };

        /**
         * This actually sends a Transformation
         */
        $scope.sendTransformations = function () {

            var payload = {
                name: 'Transformations',
                description : 'Transformations',
                job: {
                    mappings : $scope.project.mappings
                },
                input_data_model :$scope.project.input_data_model,
                output_data_model : $scope.project.output_data_model
            };

            sendTransformations([payload]);
        };
        //** End of sending transformation to server

        //** Start handling filter
        $scope.onFunctionClick = function(component) {
            var newComponent = angular.copy(getComponent(component.id));
            PubSub.broadcast('handleEditConfig', newComponent);
        };

        PubSub.subscribe($scope, 'handleConfigEdited', function(component) {
            angular.forEach($scope.activeMapping.transformation.function.components, function (comp) {
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

            modalInstance.result.then(function () { });

        };

        //** End handling filter


    })
    .directive('transformation', function () {
        return {
            scope : true,
            restrict: 'E',
            replace: false,
            templateUrl: 'views/directives/transformation.html',
            controller: 'TransformationCtrl'
        };
    });
