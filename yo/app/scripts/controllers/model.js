/**
 * Copyright (C) 2013 – 2015  SLUB Dresden & Avantgarde Labs GmbH (<code@dswarm.org>)
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
    .controller('ModelCtrl', function($scope, $routeParams, $timeout, $modal, localStorageService, ProjectResource, SchemaResource, SchemaAttributepathsResource, schemaParser, PubSub, loDash, Util, jsP, endpointLabel, filterHelper) {

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

        $scope.onDclClickTreeLeaf = function(data) {

            if(!data) { data = {}; }

            $modal.open({
                templateUrl: 'views/controllers/show-tree-data.html',
                controller: 'ShowTreeDataCtrl',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            });

        };

        $scope.panes = {
            left : 0,
            right : 0,
            bottom : 0,
            configuration: 0
        };

        // NEW TREEE TEST END

        // Mock project data for angular data handling
        $scope.project = {
            uuid: 0,
            name: '',
            description: '',
            mappings: [],
            functions: [],
            input_data_model: {},
            _$input_data_model_schema: {},
            output_data_model: {},
            _$output_data_model_schema: {}
        };

        function getSchema() {

            var filterTypes = [
                {id: 'NUMERIC', name: 'numeric filter'},
                {id: 'REGEXP', name: 'regular expression'},
                {id: 'EQUALS', name: 'equals'},
                {id: 'NOTEQUALS', name: 'not-equals'}
            ];

            var defaultFilterType = filterTypes[1];

            var filterTypeObj = {
                filterTypes: filterTypes,
                defaultFilterType: defaultFilterType
            };

            var s = schemaParser.fromDomainSchema($scope.project.input_data_model.schema, true, true, filterTypeObj);
            s.name = s.name || '';

            return s;
        }

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

        function showChild(needle, child) {

            if(child.uuid === needle) {

                child.$wasRendered = true;
                child.$show = true;

                return;
            }

            if(child.hasChildren) {
                loDash.map(child.children, function(child) {
                    showChild(needle, child);
                });
            }

        }

        $scope.processOutputDataModel = function() {

            if (loDash.size($scope.project.output_data_model) > 0) {

                $scope.project._$output_data_model_schema = $scope.dataModelToSchema($scope.project.output_data_model);

                $scope.isOutputDataModelLoaded = true;

                loDash.map($scope.project.mappings, function(mapping) {

                    loDash.map(mapping.output_attribute_path.attribute_path.attributes, function(attribute) {

                        loDash.map($scope.project._$output_data_model_schema.children, function(child) {
                            showChild(attribute.uuid, child);
                        });

                    });


                });

                $timeout(function() {
                    PubSub.broadcast('outputDataSelected', {});
                }, 1);

            } else {
                $scope.isOutputDataModelLoaded = false;
            }

        };

        $scope.processInputDataModel = function() {
            $scope.project._$input_data_model_schema = $scope.dataModelToSchema($scope.project.input_data_model);

            loDash.map($scope.project.mappings, function(mapping) {

                loDash.map(mapping.input_attribute_paths, function(input_attribute_path) {

                    loDash.map(input_attribute_path.attribute_path.attributes, function(attribute) {

                        loDash.map($scope.project._$input_data_model_schema.children, function(child) {
                            showChild(attribute.uuid, child);
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

        $scope.projectHasContentSchemaForFilterShortCut = function() {

            try {
                var contentSchema = $scope.project.input_data_model.schema.content_schema;

                if(contentSchema && contentSchema.key_attribute_paths && contentSchema.key_attribute_paths.length && contentSchema.value_attribute_path) {

                    return contentSchema;
                }
            } catch(e) {

            }

            return false;
        };

        //====================================
        // Project drafting
        //====================================

        function getStorageDraftKey(projectId) {
            return 'project.draft.' + (projectId || $scope.project.uuid);
        }

        $scope.loadProjectData = function(projectId, cb) {
            var callback = angular.isFunction(cb) ? cb : angular.identity,
                draft = localStorageService.get(getStorageDraftKey(projectId));

            if (angular.isObject(draft) && draft.uuid === projectId) {

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

            localStorageService.set(getStorageDraftKey(projectToSave.uuid), projectToSave);

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

            discardProjectDraft($scope.project.uuid);

            var projectToSend = Util.toJson(prepareProject());

            ProjectResource.update({ id: $scope.project.uuid }, projectToSend, function(project) {

                latestSave = project;

                $scope.closeAlert(idx);

                restoreProject(project);
            });
        };

        function setSelectedRecords(project, selectedRecordURIs) {

            if(loDash.isEmpty(selectedRecordURIs)) {

                return;
            }

            if(!loDash.isArray(selectedRecordURIs)) {
                selectedRecordURIs = [selectedRecordURIs];
            }

            project.selected_records = selectedRecordURIs;
        }

        function setSkipFilterExpression(project, expr) {

            if(loDash.isEmpty(expr)) {

                return;
            }

            if(!loDash.isArray(expr)) {
                expr = [expr];
            }

            var expression = JSON.stringify(expr);
            if (project.skip_filter) {
                project.skip_filter.expression = expression;
            } else {
                project.skip_filter = {
                    uuid: Util.getId(),
                    expression: expression
                };
            }
        }

        function openSelectRecords(project) {

            var recordsSelected = true;

            if (!project._$selectedRecords) {
                project._$selectedRecords = [];
                recordsSelected = false;
            }

            var modalInstance = $modal.open({
                templateUrl: 'views/directives/select-records.html',
                controller: 'SelectRecordsCtrl',
                windowClass: 'wide',
                resolve: {
                    project: function() {
                        return project;
                    },
                    recordsSelected: function() {
                        return recordsSelected;
                    }
                }
            });

            modalInstance.result.then(function(reason) {

                if(reason && (reason.removeFilter || reason.resetRecordSelection)) {

                    delete project._$selectedRecords;
                    delete project.selected_records;

                    PubSub.broadcast('inputDataChanged', {});
                } else if(reason && reason.selectedRecords && reason.recordsHaveBeenSearched) {

                    // update, if record selection was successful

                    var selectedRecordURIs = loDash.map(reason.selectedRecords, function(selectedRecord) {
                        return selectedRecord.id;
                    });

                    setSelectedRecords(project, selectedRecordURIs);

                    var message = {
                        records: reason.selectedRecords,
                        dataModel: project.input_data_model
                    };

                    PubSub.broadcast('inputDataChanged', message);
                }
            });
        }

        function openSkipFilter(project) {

            if (!project._$filters) {
                project._$filters = [];
            }

            if(project.skip_filter) {

                // load skip filter

                var filterName = 'my skip filter';

                if(project.skip_filter.name) {
                    filterName = project.skip_filter.name;
                }

                var expression = angular.fromJson(project.skip_filter.expression),
                    schema = getSchema();
                project._$filters = filterHelper.parseFilterDefinitions(expression, filterName, schema);
            }

            var modalInstance = $modal.open({
                templateUrl: 'views/directives/skip-filter.html',
                controller: 'FilterCtrl',
                windowClass: 'wide',
                resolve: {
                    filterObject: function() {
                        return project;
                    },
                    attributePathId: function() {
                        return '';
                    },
                    filters: function() {
                        return project._$filters;
                    }
                }
            });

            modalInstance.result.then(function(reason) {

                if(reason && reason.removeFilter) {

                    project._$filters = [];
                    project.skip_filter = null;
                } else {

                    var filters = filterHelper.prepareFilters(project._$filters, project);
                    var filtersExpression = filterHelper.buildFilterExpression(filters);

                    setSkipFilterExpression(project, filtersExpression);
                }
            });
        }

        $scope.onSelectRecordsClick = function() {

            openSelectRecords($scope.project);
        };

        $scope.onDefineSkipFilterClick = function() {

            openSkipFilter($scope.project);
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
                var projectId = $scope.project.uuid;
                $scope.project.uuid = 0;

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

        $scope.onRunProjectRunClick = function() {
            PubSub.broadcast('sendTransformations', false);
        };

        $scope.onSaveProjectSaveClick = function() {
            PubSub.broadcast('sendTransformations', true);
        };

        function toggleSourceData() {

            $scope.panes.left = $scope.panes.left === 1 ? 0 : 1;

            $timeout(function() {
                PubSub.broadcast('schemaCanvasUpdated', {});
            }, 200);

        }

        $scope.onToggleSourceDataClick = function() {
            toggleSourceData();
        };

        function toggleTargetData() {

            $scope.panes.right = $scope.panes.right === 1 ? 0 : 1;

            $timeout(function() {
                PubSub.broadcast('schemaCanvasUpdated', {});
            }, 200);

        }

        function showTargetData() {

            $scope.panes.right = 1;

            $timeout(function() {
                PubSub.broadcast('schemaCanvasUpdated', {});
            }, 200);

        }

        $scope.onToggleTargetDataClick = function() {
            toggleTargetData();
        };

        PubSub.subscribe($scope, 'transformationFinished', function() {
            showTargetData();
        });

        function showOverlayData() {
            $scope.panes.bottom = 1;
        }

        function hideOverlayData() {
            $scope.panes.bottom = 0;
        }

        function isOpen(p) {
            return !!$scope.panes[p];
        }
        function isEitherOpen(a, b) {
            return ($scope.panes[a] + $scope.panes[b]) === 1;
        }
        function isBothOpen(a, b) {
            return $scope.panes[a] && $scope.panes[b];
        }
        function isNoneOpen(a, b) {
            return !$scope.panes[a] && !$scope.panes[b];
        }

        $scope.schemaClasses = function() {
            return {
                'col-md-12': isNoneOpen('left', 'right'),
                'col-md-9': isEitherOpen('left', 'right'),
                'col-md-6': isBothOpen('left', 'right'),
                'col-md-offset-3': isOpen('left'),
                offCanvasBlind: isOpen('bottom'),
                offCanvasDoublyBlind: isOpen('configuration')
            };
        };

        $scope.bottomRowClasses = function() {
            return {
                'col-md-9': isEitherOpen('left', 'right'),
                'col-md-6': isBothOpen('left', 'right'),
                'col-md-offset-3': isOpen('left'),
                offCanvasShow: isOpen('bottom'),
                offCanvasBlind: isOpen('configuration')
            };
        };

        $scope.onCloseTransformationSelectorClick = function() {
            hideFunctionConfiguration();
            hideOverlayData();
            PubSub.broadcast('jsp-connector-disconnect', { type: [ 'transformation', 'component' ]  });

            $timeout(function() {
                PubSub.broadcast('projectModelChanged', {});
            }, 1);

            $timeout(function() {
                PubSub.broadcast('paintPlumbs', $scope.project.mappings);
            }, 100);
        };

        PubSub.subscribe($scope, 'connectionSelected', function(data) {

            if(data.click) {
                showOverlayData();
            }

            $timeout(function() {
                PubSub.broadcast('schemaCanvasUpdated', {});
            }, 400);

        });

        function showFunctionConfiguration() {
            $scope.panes.configuration = 1;
        }

        function hideFunctionConfiguration() {
            $scope.panes.configuration = 0;
        }

        PubSub.subscribe($scope, 'handleEditConfig', showFunctionConfiguration);

        PubSub.subscribe($scope,
            ['changeOutputModel', 'connectionSelected',
                'projectDraftDiscarded', 'projectModelChanged', 'removeComponent',
                'restoreCurrentProject', 'configurationClosed'],
            hideFunctionConfiguration);

        $scope.$watch(function() {

            if (latestSave === $scope.project) {
                return false;
            }

            return $scope.project.uuid + ':' + Util.toJson($scope.project);
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

            endpointLabel.ask('Name the new Leaf', 'The name has to be at least 3 characters long', 'Ok', 'URI', prefill, error).then(function(modalData) {

                var result = function(schema) {

                    if(isInputLeaf) { $scope.project.input_data_model.schema = schema; }
                    else { $scope.project.output_data_model.schema = schema; }

                    PubSub.broadcast('restoreCurrentProject', {});

                },
                error = function(error) {
                    $scope.newLeaf(data, isInputLeaf, { label: modalData.label, extra : modalData.extra }, error.data.error);
                };

                var modelId = (isInputLeaf) ? $scope.project.input_data_model.schema.uuid : $scope.project.output_data_model.schema.uuid;

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
