'use strict';

angular.module('dmpApp')
    .controller('TransformationCtrl', function ($scope, $window, $modal, $q, $rootScope, PubSub, loDash, TaskResource, Util) {
        $scope.internalName = 'Transformation Logic Widget';

        var activeComponentId = null,
            availableIds = [],
        // Until a better idea comes up, limit to 6 items per row.
            gridMaxItemsPerRow = 6,
            isDraggingToGrid = false;

        //** Gridster config goes here
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
            maxRows : 0
        };

        $scope.customItemMap = {
            sizeX: 1,
            sizeY: 1,
            row: 'item.positionX',
            col: 'item.positionY'
        };

        $scope.gridItems = [];
        $scope.inputItems = [];
        $scope.outputItems = [];
        //** End of Gridster config

        //** Start of directive init
        function init() {
            activeComponentId = '';
            availableIds = [];
            $scope.activeMapping = { _$components : [] };
            $scope.showSortable = false;
            $scope.tabs = [];

            $scope.gridItems = [];
            $scope.inputItems = [];
            $scope.outputItems = [];

            $scope.gridsterOpts = angular.extend({}, $scope.gridsterOpts, {
                minRows : 0,
                maxRows : 0
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
        var createDropPlaceholder = function() {

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
        };
        var removeDropPlaceholder = function() {
            $scope.gridItems = loDash.remove($scope.gridItems, function(item) { return !item.placeholder; });
            $scope.$digest();
        };

        var dropToGrid = function(positionX, positionY, itemData) {
            $scope.gridItems.push({
                'positionX' : positionX,
                'positionY' : positionY,
                'function': itemData
            });

            //createInternalComponentsFromGridItems();
        };

        $scope.$watchCollection('gridItems', function() {

            if(!isDraggingToGrid) {
                console.log('/// NEW GRIDITEM:', $scope.gridItems);
            }
        });

        PubSub.subscribe($rootScope, 'DRAG-START', function() {
            isDraggingToGrid = true;
            createDropPlaceholder();
        });

        PubSub.subscribe($rootScope, 'DRAG-END', function() {
            isDraggingToGrid = false;
            removeDropPlaceholder();
        });

        $scope.dropped = function(dragEl, dropEl) {

            console.log(angular.element(dropEl).scope().item);

            dropToGrid(angular.element(dropEl).scope().item.positionX, angular.element(dropEl).scope().item.positionY, angular.element(dragEl).scope().child);
        };
        //** End of function drag/drops handling


        //** Start of mapping activation and selection
        function activate(id, skipBroadcast) {
            $scope.showSortable = true;
            if (activeComponentId !== id) {
                $scope.$broadcast('tabSwitch', id);

                $scope.activeMapping =  $scope.project.mappings[availableIds.indexOf(id)];

                if(!$scope.activeMapping) {
                    $scope.activeMapping = { _$components : [] };
                }
                if($scope.activeMapping._$components.length !== $scope.project.mappings[availableIds.indexOf(id)].transformation.function.components.length) {
                    //$scope.activeMapping._$components = createInternalComponentsFromComponents($scope.project.mappings[availableIds.indexOf(id)].transformation.function.components);
                }

                activeComponentId = id;

                if (!skipBroadcast) {
                    PubSub.broadcast('connectionSwitched', { id: $scope.activeMapping._$connection_id });
                }
            }
        }

        $scope.switchTab = function(tab) {
            activate(tab.id);
        };

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
                    $scope.tabs[idx].active = true;

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
                            transformation : {
                                name : 'transformation',
                                description : 'transformation',
                                function : {
                                    name : 'transformation',
                                    type : 'Transformation',
                                    components: []
                                }
                            },
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
                            },
                            _$components : []
                        };

                    $scope.project.mappings.push(mapping);

                    $scope.tabs.push( { title: data.name, active: true, id: data.mapping_id, mappingId : data.mapping_id } );
                    availableIds.push(data.mapping_id);

                    activate(data.mapping_id, true);
                }
            }

            $scope.gridsterOpts.maxRows = $scope.gridsterOpts.minRows = data.additionalInput.length +1;

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

                //var activeMappingIndex = loDash.findIndex($scope.project.mappings, { id : $scope.activeMapping.id });

            }


            if($scope.$$phase !== '$digest') {
                $scope.$digest();
            }
        });

        //** Start of sending tranformation to server
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

        $scope.sendTransformation = function (tab) {
            if (activeComponentId === tab.id) {

                var payload = {
                    name: tab.title,
                    description : 'A Transformation',
                    job: {
                        mappings : [$scope.activeMapping]
                    },
                    input_data_model :$scope.project.input_data_model,
                    output_data_model : $scope.project.output_data_model
                };

                sendTransformations([payload]);
            }
        };

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
        //** End of sending tranformation to server

        //** Start handling filter
        $scope.onFunctionClick = function(component) {
            PubSub.broadcast('handleEditConfig', component);
        };

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
