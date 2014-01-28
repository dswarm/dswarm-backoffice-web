'use strict';

angular.module('dmpApp')
    .controller('TransformationCtrl', ['$scope', '$window', '$modal', '$q', 'PubSub', 'Lo-Dash', 'TaskResource', 'DataModelGen', 'Util',
    function ($scope, $window, $modal, $q, PubSub, loDash, TaskResource, DataModelGen, Util) {
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
            lastPayload,
            dmg;

        function init() {
            dmg = new DataModelGen($scope.project.mappings);
            activeComponentId = '';
            $scope.activeMapping = { _$components : [] };
            $scope.showSortable = false;
            $scope.tabs = [];

            // restore mappings if a previous project was loaded from a draft
            loDash.forEach($scope.project.mappings, function(mapping) {

                $scope.tabs.push({title: mapping.name, active: false, id: mapping._$internal_id, mappingId : mapping.id});
                availableIds.push(mapping._$internal_id);
            });

            var last = loDash.last($scope.project.mappings);

            if (last) {
                activate(last._$internal_id, true);
            }
        }
        init();
        PubSub.subscribe($scope, ['projectDraftDiscarded', 'projectModelChanged'], init);

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

                if(!$scope.activeMapping._$components) {
                    $scope.activeMapping._$components = [];
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

            var existingTabId = loDash.findIndex($scope.tabs, {mappingId : data.mapping_id});

            if(existingTabId >= 0) {
                $scope.tabs[existingTabId].id = data.internal_id;
                activeComponentId = data.internal_id;
            }

            if (activeComponentId !== data.internal_id) {
                if (loDash.any($scope.project.mappings, { '_$internal_id' : data.internal_id })) {

                    var idx = availableIds.indexOf(data.internal_id);
                    $scope.tabs[idx].active = true;
                    activate(data.internal_id, true);

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
                            id :  new Date().getTime()*-1,
                            _$internal_id : data.internal_id,
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
                            input_attribute_paths : inputAttributePaths,
                            output_attribute_path : outputAttributePaths[0],
                            _$components : []
                        };

                    $scope.project.mappings.push(mapping);

                    $scope.tabs.push( { title: data.name, active: true, id: data.internal_id, mappingId : data.mapping_id } );
                    availableIds.push(data.internal_id);

                    activate(data.internal_id, true);
                }
            }
            if($scope.$$phase !== '$digest') {
                $scope.$digest();
            }
        });

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

            if(!loDash.contains($scope.project.functions, data)) {
                $scope.project.functions.push(data);
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

                lastPayload = {componentType: 'fun', payload: payload, id: componentId};
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

    }])
    .directive('transformation', [ function () {
        return {
            scope : true,
            restrict: 'E',
            replace: true,
            templateUrl: 'views/directives/transformation.html',
            controller: 'TransformationCtrl'
        };
    }]);
