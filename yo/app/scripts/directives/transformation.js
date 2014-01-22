'use strict';

angular.module('dmpApp')
    .controller('TransformationCtrl', ['$scope', '$window', '$modal', '$q', 'PubSub', 'Lo-Dash', 'TaskResource', 'DataModelGen',
    function ($scope, $window, $modal, $q, PubSub, loDash, TaskResource, DataModelGen) {
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

        var dmg = new DataModelGen($scope.project.mappings);

        $scope.activeMapping = null;
        $scope.showSortable = false;
        $scope.tabs = [];

        function activate(id, skipBroadcast) {
            $scope.showSortable = true;
            if (activeComponentId !== id) {
                $scope.$broadcast('tabSwitch', id);

                $scope.activeMapping =  $scope.project.mappings[availableIds.indexOf(id)];

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
            return loDash.map(ap.attributes, 'name').join(' › ');
        };

        function sendTransformations(tasks) {
            var promises = loDash.map(tasks, function(task) {
                //noinspection JSUnresolvedVariable
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

                var payload = dmg.genTask([tab]);
                //dump(payload);

                sendTransformations(payload);
            }
        };

        $scope.sendTransformations = function () {

            var payload = dmg.genTask($scope.tabs);
            //dump(payload);

            sendTransformations(payload);
        };

        PubSub.subscribe($scope, 'connectionSelected', function(data) {

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
                            transformation : {},
                            input_attribute_paths : inputAttributePaths,
                            output_attribute_path : outputAttributePaths[0],
                            _$components : []
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

        var mappingsCount = $scope.project.mappings.length;
        loDash.forEach($scope.project.mappings, function(mapping, idx) {
            var last = idx === mappingsCount - 1;

            $scope.tabs.push({title: mapping.name, active: last, id: mapping._$internal_id});
            availableIds.push(mapping._$internal_id);

            if (last) {
                activate(mapping._$internal_id, true);
            }
        });

        function push(data, index, oldIndex) {
            if (angular.isDefined(oldIndex)) {
                $scope.activeMapping._$components.splice(oldIndex, 1);
            }
            if (angular.isDefined(index)) {
                $scope.activeMapping._$components.splice(index, 0, data);
            } else {
                $scope.activeMapping._$components.push(data);
            }
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
