'use strict';

angular.module('dmpApp')
    .controller('TransformationCtrl', ['$scope', '$window', '$modal', '$q', 'PubSub', 'Lo-Dash', 'TaskResource', 'DataModelGen',
        function ($scope, $window, $modal, $q, PubSub, loDash, TaskResource, DataModelGen) {
        $scope.internalName = 'Transformation Logic Widget';

        var activeComponentId = null
            , availableIds = []
            , makeComponentId = (function () {
                var _id = 0;
                return function () {
                    _id += 1;
                    return [activeComponentId, 'fun_' + _id].join(':');
                };
            })(),
            lastPayload;

        $scope.showSortable = false;
        $scope.tabs = [];
        $scope.activeMapping = {
            $components : {}
        };

        function activate(id, skipBroadcast) {
            $scope.showSortable = true;
            if (activeComponentId !== id) {
                $scope.$broadcast('tabSwitch', id);

                $scope.activeMapping =  $scope.project.mappings[
                    loDash.findIndex($scope.project.mappings,  { '$internal_id' : id })
                    ];

                activeComponentId = id;

                if (!skipBroadcast) {
                    PubSub.broadcast('connectionSwitched', { id: $scope.activeMapping.$connection_id });
                }
            }
        }

        $scope.switchTab = function(tab) {
            activate(tab.id);
        };

        function sendTransformationss(tasks) {
            var promises = loDash.map(tasks, function(task) {
                return TaskResource.execute(task).$promise;
            });

            $q.all(promises)
                .then(function(results) {
                    loDash.forEach(results, function(result) {
                        console.log(result);
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

                sendTransformationss([payload]);
            }
        };

        $scope.sendTransformations = function () {

            var payload = {
                name: "Transformations",
                description : 'Transformations',
                job: {
                    mappings : $scope.project.mappings
                },
                input_data_model :$scope.project.input_data_model,
                output_data_model : $scope.project.output_data_model
            };

            sendTransformationss([payload]);
        };

        PubSub.subscribe($scope, 'connectionSelected', function(data) {

            if (activeComponentId !== data.internal_id) {
                if (loDash.findIndex($scope.project.mappings,  { '$internal_id' : data.internal_id }) > -1) {
                    var idx = availableIds.indexOf(data.internal_id);
                    $scope.tabs[idx].active = true;
                } else {

                    var mapping = {
                            id :  new Date().getTime()*-1,
                            $internal_id : data.internal_id,
                            $connection_id : data.connection_id,
                            name : data.name,
                            transformation : {
                                "name": "transformation",
                                "description": "transformation",
                                "function": {
                                    "name": "transformation",
                                    "type": "transformation",
                                    "components": []
                                }
                            },
                            input_attribute_paths : [loDash.find($scope.project.input_data_model.schema.attribute_paths, { 'id': data.inputAttributePath.$path_id })],
                            output_attribute_path : loDash.find($scope.project.output_data_model.schema.attribute_paths, { 'id': data.outputAttributePath.$path_id }),
                            $components : []
                        };

                    $scope.project.mappings.push(mapping);

                    $scope.tabs.push( { title: data.name, active: true, id: data.internal_id } );
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

            internalComponents.reverse();

            angular.forEach(internalComponents, function(value, key){

                var aNewComponent = {
                    id : (new Date().getTime()+key)*-1,
                    name : value.payload.name,
                    description : value.payload.description,
                    'function' : value.payload,
                    parameter_mapping : {},
                    output_components : [],
                    input_components : []
                };

                angular.forEach(value.payload.function_description.parameters, function (parameter, name) {
                    aNewComponent.parameter_mapping[name] = parameter.data;
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
                $scope.activeMapping.$components.splice(oldIndex, 1);
            }
            if (angular.isDefined(index)) {
                $scope.activeMapping.$components.splice(index, 0, data);
            } else {
                $scope.activeMapping.$components.push(data);
            }

            $scope.activeMapping.transformation.function.components = createComponentsFromInternalComponents($scope.activeMapping.$components);

        }

        $scope.sortableCallbacks = {
            receive: function (event, ui) {
                var payload = angular.element(ui.item).scope()['child']
                    , componentId = makeComponentId();

                lastPayload = {componentType: 'fun', payload: payload, id: componentId};
            },
            update: function (event, ui) {
                //noinspection JSCheckFunctionSignatures
                var index = ui.item.parent().children('.function').index(ui.item)
                    , payload, oldIndex;
                if (lastPayload) {
                    payload = angular.copy(lastPayload);
                    lastPayload = null;
                } else {
                    payload = ui.item.scope()['component'];
                    oldIndex = $scope.activeMapping.$components.indexOf(payload);
                }

                if (payload) {
                    push(payload, index, oldIndex);
                    ui.item.remove();
                }

                $scope.$digest();
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

        $scope.$watch('activeMapping.$components', function() {
            if($scope.activeMapping.transformation) {
                $scope.activeMapping.transformation.function.components = createComponentsFromInternalComponents($scope.activeMapping.$components);
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
