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

angular.module('dmpApp')
    .controller('ModelCtrl', function($scope, $routeParams, $timeout, $modal, localStorageService, ProjectResource, SchemaResource, SchemaAttributepathsResource, schemaParser, PubSub, loDash, Util, jsP, endpointLabel) {

        var latestSave = {};

        $scope.alerts = [];

        $scope.projectId = $routeParams.projectId;
        $scope.projectIsDraft = false;


        $scope.jspSourceOptions = {
            scope: 'schema',
            container: 'schema',
            anchor: ['Continuous', { faces: ['top'] } ],
            endpoint: ['Dot', {
                radius: 5,
                cssClass: 'source-endpoint source-endpoint-tree'
            }],
            connectorOverlays: [
                ['Arrow', {
                    location: 1,
                    width: 10,
                    length: 12,
                    foldback: 0.75
                }]
            ],
            connector: 'StateMachine',
            connectorStyle: {
                strokeStyle: 'black',
                lineWidth: 3
            },
            paintStyle: {
                fillStyle: 'black',
                lineWidth: 3
            }
        };

        $scope.jspTargetOptions = {
            scope: 'schema',
            container: 'schema',
            anchor: ['Continuous', { faces: ['top'] } ],
            endpoint: ['Dot', {
                radius: 5,
                cssClass: 'transparent'
            }],
            connector: 'StateMachine',
            connectorStyle: {
                strokeStyle: 'black',
                lineWidth: 3
            },
            paintStyle: {
                fillStyle: 'transparent',
                lineWidth: 3
            },
            dropOptions: {
                hoverClass: 'mapping-droppable'
            }
        };

        $scope.isCollapsed = function(data) {
            return !data.$show;
        };

        $scope.wasRendered = function(data) {
            return data.$wasRendered;
        };

        $scope.expandCollapse = function(that, data) {

            data.$wasRendered = true;
            data.$show = !data.$show;

            $timeout(function() {
                PubSub.broadcast('schemaCanvasUpdated', {});
            }, 0);
        };

        // NEW TREEE TEST END

        // Mock project data for angular data handling
        $scope.project = {
            id: 0,
            name: '',
            description: '',
            mappings: [],
            functions: [],
            input_data_model: {},
            _$input_data_model_schema: {},
            output_data_model: {},
            _$output_data_model_schema: {}
        };

        $scope.$project_saved_state = {};

        $scope.isOutputDataModelLoaded = false;

        $scope.closeAlert = function(idx) {
            if (angular.isDefined(idx) && $scope.alerts.length > idx) {
                $scope.alerts.splice(idx, 1);
            }
        };

        $scope.setOutputDataModel = function(dataModel) {

            if ($scope.project.output_data_model) {
                $scope.removeMappings();
            }

            $scope.project.output_data_model = dataModel;

            $scope.processOutputDataModel();
        };

        $scope.removeMappings = function() {

            $scope.project.mappings = [];

            PubSub.broadcast('changeOutputModel', {});

        };

        $scope.setOutputSchema = function(dataModel) {
            $scope.setOutputDataModel(dataModel);
            PubSub.broadcast('restoreCurrentProject', {});
        };

        $scope.processOutputDataModel = function() {

            if (loDash.size($scope.project.output_data_model) > 0) {

                $scope.project._$output_data_model_schema = $scope.dataModelToSchema($scope.project.output_data_model);

                $scope.isOutputDataModelLoaded = true;

                $timeout(function() {
                    PubSub.broadcast('outputDataSelected', {});
                }, 1);

            } else {
                $scope.isOutputDataModelLoaded = false;
            }

        };

        $scope.processInputDataModel = function() {
            $scope.project._$input_data_model_schema = $scope.dataModelToSchema($scope.project.input_data_model);

            var showChild = function(needle, child) {

                if(child.id === needle) {

                    child.$wasRendered = true;
                    child.$show = true;

                    return;
                }

                if(child.hasChildren) {
                    loDash.map(child.children, function(child) {
                        showChild(needle, child);
                    });
                }

            };

            loDash.map($scope.project.mappings, function(mapping) {

                loDash.map(mapping.input_attribute_paths, function(input_attribute_path) {

                    loDash.map(input_attribute_path.attribute_path.attributes, function(attribute) {

                        loDash.map($scope.project._$input_data_model_schema.children, function(child) {
                            showChild(attribute.id, child);
                        });


                    });

                });

            });


            $timeout(function() {
                PubSub.broadcast('inputDataSelected', { });
            }, 1);

        };

        $scope.dataModelToSchema = function(dataModel) {
            return schemaParser.fromDomainSchema(dataModel.schema);
        };

        $scope.projectIsMabXml = function() {
            try {
                return $scope.project.input_data_model.configuration.parameters.storage_type === 'mabxml';
            } catch(e) {
                return false;
            }
        };

        //====================================
        // Project drafting
        //====================================

        function getStorageDraftKey(projectId) {
            return 'project.draft.' + (projectId || $scope.project.id);
        }

        $scope.loadProjectData = function(projectId, cb) {
            var callback = angular.isFunction(cb) ? cb : angular.identity,
                draft = localStorageService.get(getStorageDraftKey(projectId));

            if (angular.isObject(draft) && +draft.id === +projectId) {

                $scope.projectIsDraft = true;

                callback();
                restoreProject(draft);
            } else {

                ProjectResource.get({id: projectId}, function(project) {

                    callback();
                    restoreProject(project);
                });
            }
        };

        function restoreProject(project) {

            var mappingCounter = 0;

            angular.forEach(project.mappings, function() {
                project.mappings[mappingCounter]._$components = [];
                mappingCounter++;
            });

            $scope.project = project;

            if ($scope.project.input_data_model) {
                $scope.processInputDataModel();
            }

            $scope.processOutputDataModel();

            $timeout(function() {
                PubSub.broadcast('projectModelChanged', {});
            }, 1);

            $timeout(function() {
                PubSub.broadcast('paintPlumbs', $scope.project.mappings);
            }, 500);

        }

        function restoreCurrentProject() {
            restoreProject($scope.project);
        }

        PubSub.subscribe($scope, 'restoreCurrentProject', restoreCurrentProject);

        function saveProjectDraft(project) {

            var projectToSave = project || $scope.project;
            $scope.projectIsDraft = true;

            localStorageService.set(getStorageDraftKey(projectToSave.id), projectToSave);

        }

        function discardProjectDraft(projectId) {

            localStorageService.remove(getStorageDraftKey(projectId));
            PubSub.broadcast('projectDraftDiscarded', {});
        }

        function blocked(idx) {
            if (angular.isDefined(idx)) {
                var alert = $scope.alerts[idx];
                if (alert) {
                    if (alert.busy) {
                        return true;
                    } else {
                        $scope.alerts[idx].busy = true;
                    }
                }
            }
            return false;
        }

        /**
         * workaround backend requirements for DD-447
         * that is, the backend can't really deal with empty transformations
         * and we need to not send this, if it is empty
         */
        function prepareProject() {
            var project = angular.copy($scope.project);
            loDash.forEach(project.mappings, function(mapping) {
                if (mapping.transformation &&
                    mapping.transformation.function &&
                    mapping.transformation.function.components &&
                    mapping.transformation.function.components.length === 0) {

                    delete mapping.transformation;
                }
            });
            return project;
        }

        $scope.onSaveProjectClick = function(idx) {

            if (blocked(idx)) {
                return;
            }

            $scope.projectIsDraft = false;

            discardProjectDraft($scope.project.id);

            var projectToSend = Util.toJson(prepareProject());

            ProjectResource.update({ id: $scope.project.id }, projectToSend, function(project) {

                latestSave = project;

                $scope.closeAlert(idx);

                restoreProject(project);
            });
        };

        $scope.onDiscardDraftClick = function(idx) {
            if (blocked(idx)) {
                return;
            }

            var modalInstance = $modal.open({
                templateUrl: 'views/controllers/confirm-discard-draft.html'
            });

            modalInstance.result.then(function() {

                $scope.projectIsDraft = false;
                var projectId = $scope.project.id;
                $scope.project.id = 0;

                discardProjectDraft(projectId);

                $scope.loadProjectData(projectId, function() {
                    $scope.closeAlert(idx);
                });

            }, function() {

                if (angular.isDefined(idx) && $scope.alerts.length > idx) {
                    $scope.alerts[idx].busy = false;
                }
            });
        };

        $scope.saveProjectDraft = loDash.debounce(saveProjectDraft, 200, {
            leading: true,
            trailing: true
        });

        $scope.$watch(function() {

            if (latestSave === $scope.project) {
                return false;
            }

            return $scope.project.id + ':' + Util.toJson($scope.project);
        }, function(newValue, oldValue) {

            if (newValue === false) {
                return;
            }

            if (newValue === oldValue) {
                // initial call after registration
                return;
            }

            if (+oldValue.charAt(0) === 0 || +newValue.charAt(0) === 0) {
                // initial load, do not store yet
                return;
            }

            $scope.saveProjectDraft();
        }, true);


        $scope.$on('$locationChangeStart', function() {
            jsP.detachEveryConnection({});
        });

        $scope.loadProjectData($routeParams.projectId);

        $scope.newLeaf = function(data, isInputLeaf, prefill, error) {

            endpointLabel.ask('Name the new Leaf', 'The name has to be at least 3 characters long', 'URI', prefill, error).then(function(modalData) {

                var result = function(schema) {

                    if(isInputLeaf) { $scope.project.input_data_model.schema = schema; }
                    else { $scope.project.output_data_model.schema = schema; }

                    PubSub.broadcast('restoreCurrentProject', {});

                },
                error = function(error) {
                    $scope.newLeaf(data, isInputLeaf, { label: modalData.label, extra : modalData.extra }, error.data.error);
                };

                var modelId = (isInputLeaf) ? $scope.project.input_data_model.schema.id : $scope.project.output_data_model.schema.id;

                if(data) {

                    SchemaAttributepathsResource.add_attribute({
                        id: modelId,
                        attributepathid: data._$path_id
                    }, { name: modalData.label, uri : modalData.extra }, result, error);

                } else {

                    SchemaResource.save({
                        id: modelId
                    }, [{ name: modalData.label, uri : modalData.extra }], result, error);
                }

            });
        };

    });
