'use strict';

angular.module('dmpApp')
    .controller('ModelCtrl',
           ['$scope', '$routeParams', '$timeout', '$modal', 'localStorageService', 'ProjectResource', 'schemaParser', 'PubSub', 'Lo-Dash', 'Util', 'jsP',
    function($scope,   $routeParams,   $timeout,   $modal,   localStorageService,   ProjectResource,   schemaParser,   PubSub,   loDash,    Util, jsP) {

        $scope.alerts = [];

        $scope.projectId = $routeParams.projectId;
        $scope.projectIsDraft = false;

        // Mock project data for angular data handling
        $scope.project = {
            id : 0,
            name : '',
            description : '',
            mappings : [],
            functions : [],
            input_data_model : {},
            _$input_data_model_schema : {},
            output_data_model : {},
            _$output_data_model_schema : {}
        };

        $scope.$project_saved_state =  {};

        $scope.isOutputDataModelLoaded = false;

        $scope.closeAlert = function(idx) {
            if (angular.isDefined(idx) && $scope.alerts.length > idx) {
                $scope.alerts.splice(idx);
            }
        };

        $scope.setOutputDataModel = function(dataModel) {
            $scope.project.output_data_model = dataModel;

            $scope.processOutputDataModel();
        };

        $scope.setOutputSchema = function(schema) {
            $scope.setOutputDataModel({schema: schema});
        };

        $scope.processOutputDataModel = function() {

            if($scope.project.output_data_model) {

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

            $timeout(function() {
                PubSub.broadcast('inputDataSelected', { });
            }, 1);

        };

        $scope.dataModelToSchema = function(dataModel) {
            return schemaParser.fromDomainSchema(dataModel.schema);
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

            if($scope.project.input_data_model) {
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

        function saveProjectDraft(project) {

            var projectToSave = project || $scope.project;
            $scope.projectIsDraft = true;

            localStorageService.set(getStorageDraftKey(projectToSave.id), projectToSave);

            console.log('Project changed: ', projectToSave);
        }

        function discardProjectDraft(projectId) {

            localStorageService.remove(getStorageDraftKey(projectId));
            PubSub.broadcast('projectDraftDiscarded');
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

        $scope.onSaveProjectClick = function(idx) {

            if (blocked(idx)) {
                return;
            }

            $scope.projectIsDraft = false;

            discardProjectDraft($scope.project.id);

            ProjectResource.update({ id: $scope.project.id }, Util.toJson($scope.project), function(project) {
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

            modalInstance.result.then(function () {

                $scope.projectIsDraft = false;
                var projectId = $scope.project.id;
                $scope.project.id = 0;

                discardProjectDraft(projectId);

                $scope.loadProjectData(projectId, function() {
                    $scope.closeAlert(idx);
                });

            }, function () {

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
            return $scope.project.id + ':' + angular.toJson($scope.project);
        }, function(newValue, oldValue) {
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


        $scope.$on('$locationChangeStart', function () {
            jsP.detachEveryConnection({});
        });

        $scope.loadProjectData($routeParams.projectId);

    }]);
