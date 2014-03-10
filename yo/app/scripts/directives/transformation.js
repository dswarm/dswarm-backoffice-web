'use strict';

angular.module('dmpApp')
    .controller('TransformationCtrl', function ($scope, $window, $modal, $q, PubSub, loDash, TaskResource, Util) {
        $scope.internalName = 'Transformation Logic Widget';

        var activeComponentId = null,
            availableIds = [],
            makeComponentId = (function () {
                var _id = 0;
                return function () {
                    _id += 1;
                    return [activeComponentId, 'fun_' + _id].join(':');
                };
            })(),
            lastPayload;

        function init() {
            activeComponentId = '';
            availableIds = [];
            $scope.activeMapping = { _$components : [] };
            $scope.showSortable = false;
            $scope.tabs = [];

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

        function activate(id, skipBroadcast) {
            $scope.showSortable = true;
            if (activeComponentId !== id) {
                $scope.$broadcast('tabSwitch', id);

                $scope.activeMapping =  $scope.project.mappings[availableIds.indexOf(id)];

                if(!$scope.activeMapping) {
                    $scope.activeMapping = { _$components : [] };
                }
                if($scope.activeMapping._$components.length !== $scope.project.mappings[availableIds.indexOf(id)].transformation.function.components.length) {
                    $scope.activeMapping._$components = createInternalComponentsFromComponents($scope.project.mappings[availableIds.indexOf(id)].transformation.function.components);
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
            if($scope.$$phase !== '$digest') {
                $scope.$digest();
            }
        });

        function createInternalComponentsFromComponents(components) {

            var internalComponents = [];

            if(!components) {
                return internalComponents;
            }

            angular.forEach(components, function(component){
                internalComponents.push( { _$componentType : 'fun', payload : component.function, id : component.id});
            });

            return internalComponents;

        }

        function createComponentsFromInternalComponents(internalComponents) {

            var components = [];

            if(!internalComponents) {
                return components;
            }

            internalComponents.reverse();

            angular.forEach(internalComponents, function(value, key){

                var aNewComponent = {
                    id : (new Date().getTime()+key)*-1,
                    name : value.payload.name,
                    description : value.payload.description,
                    'function' : value.payload,
                    parameter_mappings : {},
                    output_components : [],
                    input_components : []
                };

                angular.forEach(value.payload.function_description.parameters, function (parameter, name) {
                    aNewComponent.parameter_mappings[name] = parameter.data;
                });

                if(components.length > 0) {

                    aNewComponent.input_components = [{
                        id : components[components.length-1].id
                    }];

                    components[components.length-1].output_components = [aNewComponent];
                }

                components.push(aNewComponent);
            });

            return components;
        }

        function push(data, index, oldIndex) {

            if(!loDash.contains($scope.project.functions, data.payload)) {
                $scope.project.functions.push(data.payload);
            }

            if (angular.isDefined(oldIndex)) {
                $scope.activeMapping._$components.splice(oldIndex, 1);
            }
            if (angular.isDefined(index)) {
                $scope.activeMapping._$components.splice(index, 0, data);
            } else {
                $scope.activeMapping._$components.push(data);
            }

            $scope.activeMapping.transformation.function.components = createComponentsFromInternalComponents($scope.activeMapping._$components);

        }

        $scope.sortableCallbacks = {
            receive: function (event, ui) {
                var payload = angular.element(ui.item).scope()['child'],
                    componentId = makeComponentId();

                lastPayload = { _$componentType : 'fun', payload : payload, id : componentId };
            },
            update: function (event, ui) {
                //noinspection JSCheckFunctionSignatures
                var index = ui.item.parent().children('.function').index(ui.item),
                    payload, oldIndex;
                if (lastPayload) {
                    payload = angular.copy(lastPayload);
                    lastPayload = null;
                } else {
                    payload = ui.item.scope()['component'];
                    oldIndex = $scope.activeMapping._$components.indexOf(payload);
                }

                if (payload) {
                    push(payload, index, oldIndex);
                    ui.item.remove();
                }

                $scope.$digest();
                $scope.saveProjectDraft();
            }
        };

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

        $scope.$watch('activeMapping._$components', function() {
            if($scope.activeMapping && $scope.activeMapping.transformation) {
                $scope.activeMapping.transformation.function.components = createComponentsFromInternalComponents($scope.activeMapping._$components);
            }
        }, true);

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
