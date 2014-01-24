'use strict';

angular.module('dmpApp')
    .controller('ModelCtrl', ['$scope', '$routeParams', '$timeout', 'localStorageService', 'ProjectResource', 'schemaParser', 'PubSub', 'Lo-Dash', 'Util',
    function($scope, $routeParams, $timeout, localStorageService, ProjectResource, schemaParser, PubSub, loDash, Util) {

        /* jshint camelcase:false */

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
            $scope.alerts.splice(idx);
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

        function loadProjectData(projectId, cb) {
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
        }

        function restoreProject(project) {

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
            }, 1000);

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

        $scope.onSaveProjectClick = function(idx) {
            if ($scope.alerts[idx] && $scope.alerts[idx].busy) {
                return;
            }

            if(!$scope.alerts[idx]) {
                $scope.alerts[idx] = {};
            }

            $scope.alerts[idx].busy = true;

            $scope.projectIsDraft = false;

            discardProjectDraft($scope.project.id);

            ProjectResource.update({ id: $scope.project.id }, Util.toJson($scope.project), function() {
                $scope.closeAlert(idx);
            });
        };

        $scope.onDiscardDraftClick = function(idx) {
            if ($scope.alerts[idx].busy) {
                return;
            }
            $scope.alerts[idx].busy = true;

            $scope.projectIsDraft = false;
            var projectId = $scope.project.id;
            $scope.project.id = 0;

            discardProjectDraft(projectId);

            loadProjectData(projectId, function() {
                $scope.closeAlert(idx);
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

        loadProjectData($routeParams.projectId);

    }]);
